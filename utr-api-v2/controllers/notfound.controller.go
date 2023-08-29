package controllers

import (
	"github.com/gofiber/fiber/v2"
	"utr-api-v2/utils"
)

func NotFoundController(ctx *fiber.Ctx) error {
	return ctx.Status(fiber.StatusNotFound).
		JSON(utils.NewErrorResponseMessage("API endpoint not found"))
}
