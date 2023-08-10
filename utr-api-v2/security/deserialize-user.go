package security

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"strings"
	"utr-api-v2/ini"
	"utr-api-v2/models"
)

func deserializeUser(ctx *fiber.Ctx, accessLevel int) error {
	var tokenString string
	authorization := ctx.Get("Authorization")
	if strings.HasPrefix(authorization, "Bearer ") {
		tokenString = strings.TrimPrefix(authorization, "Bearer ")
	} else if ctx.Cookies("token") != "" {
		tokenString = ctx.Cookies("token")
	}

	if tokenString == "" {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	config, _ := ini.LoadConfig(".")
	tokenByte, err := jwt.Parse(tokenString, func(jwtToken *jwt.Token) (interface{}, error) {
		if _, ok := jwtToken.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %s", jwtToken.Header["alg"])
		}

		return []byte(config.JwtSecret), nil
	})

	if err != nil {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	claims, ok := tokenByte.Claims.(jwt.MapClaims)
	if !ok || !tokenByte.Valid {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	var user models.User
	ini.DB.Where("id = ?", claims["sub"]).First(&user)

	if user.ID.String() != claims["sub"] {
		return ctx.SendStatus(fiber.StatusForbidden)
	}
	if user.AccessLevel < accessLevel {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	ctx.Locals("user", models.FilterUserRecord(&user))

	return ctx.Next()
}
