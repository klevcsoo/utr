package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
	"strconv"
	"strings"
	"time"
	"utr-api-v2/ini"
	"utr-api-v2/models"
	"utr-api-v2/schemas"
	"utr-api-v2/utils"
)

func CreateUser(ctx *fiber.Ctx) error {
	var payload *schemas.NewUserRequest

	if err := ctx.BodyParser(&payload); err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	errors := utils.ValidateStruct(payload)
	if errors != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	hashedPass, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	user := models.User{
		Username:    payload.Username,
		DisplayName: payload.DisplayName,
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

	return ctx.Status(fiber.StatusOK).Send([]byte(tokenString))
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

func GetMe(ctx *fiber.Ctx) error {
	user := ctx.Locals("user").(*schemas.UserPublicData)
	return ctx.Status(fiber.StatusOK).JSON(user)
}

func GetUserList(ctx *fiber.Ctx) error {
	var users *[]models.User
	ini.DB.Find(&users)

	publicUsers := utils.Map(users, models.FilterUserRecord)

	return ctx.Status(200).JSON(publicUsers)
}

func GetUser(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if id == "" {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	var user models.User
	ini.DB.Where(&user, "id = ?", id)

	return ctx.Status(200).JSON(models.FilterUserRecord(&user))
}

func DeleteUser(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if id == "" {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	ini.DB.Delete(&models.User{}, id)

	return ctx.SendStatus(fiber.StatusOK)
}

func ChangePassword(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if id == "" {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	// get user in question
	var user models.User
	ini.DB.First(&user, "id = ?", id)
	if user.ID == nil {
		return ctx.SendStatus(fiber.StatusNotFound)
	}

	// parse request body
	var payload *schemas.ChangeUserPasswordRequest
	if err := ctx.BodyParser(&payload); err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	// validate request body
	errors := utils.ValidateStruct(payload)
	if errors != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	// authenticate user for security
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.OldPassword))
	if err != nil {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	// hash new password
	hashedPass, err := bcrypt.GenerateFromPassword([]byte(payload.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	// update user
	user.Password = string(hashedPass)
	ini.DB.Save(&user)

	return ctx.SendStatus(200)
}

func ChangeAccessLevel(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if id == "" {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	// parse access level value
	accessLevel, err := strconv.Atoi(ctx.Params("accessLevel"))
	if err != nil {
		log.Warnf("Failed to update user access level: %s", err.Error())
		return ctx.SendStatus(400)
	}

	// get user
	var user models.User
	ini.DB.First(&user, "id = ?", id)

	// update & save user
	user.AccessLevel = accessLevel
	ini.DB.Save(&user)

	return ctx.SendStatus(fiber.StatusOK)
}

func ChangeDisplayName(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if id == "" {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	displayName := ctx.Params("displayName")
	if displayName == "" {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	// get user
	var user models.User
	ini.DB.First(&user)

	// update & save user
	user.DisplayName = displayName
	ini.DB.Save(&user)

	return ctx.SendStatus(fiber.StatusOK)
}
