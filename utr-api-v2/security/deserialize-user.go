package security

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/golang-jwt/jwt"
	"strings"
	"utr-api-v2/ini"
	"utr-api-v2/models"
)

func deserializeUser(ctx *fiber.Ctx, accessLevel int) error {
	log.Info("Deserializing user...")

	var tokenString string
	authorization := ctx.Get("Authorization")
	if strings.HasPrefix(authorization, "Bearer ") {
		tokenString = strings.TrimPrefix(authorization, "Bearer ")
	} else if ctx.Cookies("token") != "" {
		tokenString = ctx.Cookies("token")
	}

	if tokenString == "" {
		log.Warn("Failed to parse JWT token: Unauthenticated")
		return ctx.Status(fiber.StatusUnauthorized).Send([]byte("Unauthenticated"))
	}

	config, _ := ini.LoadConfig(".")
	tokenByte, err := jwt.Parse(tokenString, func(jwtToken *jwt.Token) (interface{}, error) {
		if _, ok := jwtToken.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %s", jwtToken.Header["alg"])
		}

		return []byte(config.JwtSecret), nil
	})
	if err != nil {
		log.Warnf("Failed to parse JWT token: %s", err.Error())
		return ctx.Status(fiber.StatusUnauthorized).Send([]byte(err.Error()))
	}

	claims, ok := tokenByte.Claims.(jwt.MapClaims)
	if !ok || !tokenByte.Valid {
		log.Warn("Failed to parse JWT token: Invalid JWT token")
		return ctx.Status(fiber.StatusUnauthorized).Send([]byte("Invalid JWT token"))
	}

	var user models.User
	ini.DB.Where("id = ?", claims["sub"]).First(&user)

	if user.ID.String() != claims["sub"] {
		log.Warn("Failed to parse JWT token: Stolen JWT token")
		return ctx.Status(fiber.StatusForbidden).Send([]byte("Stolen JWT token"))
	}
	if user.AccessLevel < accessLevel {
		log.Warn("Failed to parse JWT token: Insufficient access level")
		return ctx.Status(fiber.StatusForbidden).Send([]byte("Insufficient access level"))
	}

	ctx.Locals("user", models.FilterUserRecord(&user))
	log.Infof("User deserialized: %s (%s)", user.Username, user.ID.String())

	return ctx.Next()
}
