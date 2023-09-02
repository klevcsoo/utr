package controllers

import (
	"github.com/gofiber/fiber/v2"
	"reflect"
	"utr-api-v2/ini"
	"utr-api-v2/models"
	"utr-api-v2/utils"
)

// GetResolvedObjectName handles the following endpoint: GET /resolve/:type/:id
func GetResolvedObjectName(ctx *fiber.Ctx) error {
	objectType := ctx.Params("type")
	id := ctx.Params("id")

	var model reflect.Type
	switch objectType {
	case "team":
		model = reflect.TypeOf(models.Team{})
	case "swimmer":
		model = reflect.TypeOf(models.Swimmer{})
	default:
		return ctx.Status(fiber.StatusBadRequest).
			JSON(utils.NewErrorResponseMessage("Invalid object type"))
	}

	err := ini.DB.Where("id = ?", id).First(&model).Error
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	return ctx.Status(fiber.StatusOK).
		JSON(utils.NewTextResponseMessage(
			reflect.ValueOf(model).FieldByName("Name").String()))
}
