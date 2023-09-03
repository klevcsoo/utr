package controllers

import (
	"github.com/gofiber/fiber/v2"
	"os"
	"strings"
	"utr-api-v2/utils"
)

// GetEnvironmentVariables handles the following endpoint: GET /support/env
func GetEnvironmentVariables(ctx *fiber.Ctx) error {
	variables := make(map[string]string)
	for _, e := range os.Environ() {
		pair := strings.SplitN(e, "=", 2)
		variables[pair[0]] = pair[1]
	}

	return ctx.Status(fiber.StatusOK).
		JSON(utils.NewObjectResponseMessage(variables))
}
