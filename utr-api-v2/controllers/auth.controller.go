package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
	"strings"
	"time"
	"utr-api-v2/ini"
	"utr-api-v2/models"
	"utr-api-v2/schemas"
	"utr-api-v2/utils"
)

func CreateNewUser(ctx *fiber.Ctx) error {
	var payload *schemas.NewUserRequest

	if err := ctx.BodyParser(&payload); err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	errors := utils.ValidateStruct(payload)
	if errors != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}
	println(1)

	hashedPass, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	user := models.User{
		Username:    payload.Username,
		Password:    string(hashedPass),
		AccessLevel: payload.AccessLevel,
	}

	result := ini.DB.Create(&user)
	if result.Error != nil && strings.Contains(result.Error.Error(), "duplicate key value violates unique") {
		return ctx.SendStatus(fiber.StatusConflict)
	} else if result.Error != nil {
		return ctx.SendStatus(fiber.StatusBadGateway)
	}

	return ctx.SendStatus(fiber.StatusCreated)
}

func LogUserIn(ctx *fiber.Ctx) error {
	var payload *schemas.LoginRequest

	if err := ctx.BodyParser(&payload); err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	errors := utils.ValidateStruct(payload)
	if errors != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	var user models.User
	result := ini.DB.Where("username = ?", payload.Username).First(&user)
	if result.Error != nil {
		return ctx.SendStatus(fiber.StatusNotFound)
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))
	if err != nil {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	config, _ := ini.LoadConfig(".")
	tokenByte := jwt.New(jwt.SigningMethodHS512)
	now := time.Now().UTC()
	claims := tokenByte.Claims.(jwt.MapClaims)

	claims["sub"] = user.ID
	claims["exp"] = now.Add(config.JwtExpiresIn).Unix()
	claims["iat"] = now.Unix()
	claims["nbf"] = now.Unix()

	tokenString, err := tokenByte.SignedString([]byte(config.JwtSecret))
	if err != nil {
		return ctx.SendStatus(fiber.StatusBadGateway)
	}

	ctx.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    tokenString,
		Path:     "/",
		MaxAge:   config.JwtMaxAge * 60,
		Secure:   false,
		HTTPOnly: true,
		Domain:   "localhost",
	})

	return ctx.SendStatus(fiber.StatusOK)
}

func LogUserOut(ctx *fiber.Ctx) error {
	expired := time.Now().Add(-time.Hour * 24)
	ctx.Cookie(&fiber.Cookie{
		Name:    "token",
		Value:   "",
		Expires: expired,
	})

	return ctx.SendStatus(fiber.StatusOK)
}
