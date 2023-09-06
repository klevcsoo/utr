package controllers

import (
	"github.com/gofiber/fiber/v2"
	"strings"
	"time"
	"utr-api-v2/ini"
	"utr-api-v2/models"
	"utr-api-v2/pubsub"
	"utr-api-v2/schemas"
	"utr-api-v2/utils"
)

// GetCompetitionList handles the following endpoint: GET competitions/
func GetCompetitionList(ctx *fiber.Ctx) error {
	// fetch list
	var competitions []models.Competition
	err := ini.DB.Find(&competitions).Error
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.NewListResponseMessage(competitions))
}

// CreateCompetition handles the following endpoint: PUT competitions/
func CreateCompetition(ctx *fiber.Ctx) error {
	// parse payload
	payload := ctx.Locals("payload").(schemas.CreateCompetitionRequest)

	// create competition
	competition := models.NewCompetition(payload)
	err := ini.DB.Create(&competition).Error
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// publish update and respond
	pubsub.PublishUpdate(pubsub.ChannelNameCompetitionList)
	return ctx.SendStatus(fiber.StatusCreated)
}

// GetCompetitionDetails handles the following endpoint: GET competitions/:id
func GetCompetitionDetails(ctx *fiber.Ctx) error {
	// get competition ID
	id := ctx.Params("id")

	// fetch details
	var competition models.Competition
	err := ini.DB.
		Preload("Races").
		Preload("Races.SwimmingStyle").
		Where("id = ?", id).
		First(&competition).Error

	if err != nil {
		return ctx.Status(fiber.StatusNotFound).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// respond
	return ctx.Status(fiber.StatusOK).
		JSON(utils.NewObjectResponseMessage(competition))
}

// EditCompetitionDetails handles the following endpoint: PATCH competitions/:id
func EditCompetitionDetails(ctx *fiber.Ctx) error {
	// get competition ID
	id := ctx.Params("id")

	// parse request body
	payload := ctx.Locals("payload").(schemas.EditCompetitionRequest)

	// fetch competition
	var competition models.Competition
	err := ini.DB.
		Preload("Races").
		Preload("Races.SwimmingStyle").
		Where("id = ?", id).
		First(&competition).Error

	if err != nil {
		return ctx.Status(fiber.StatusNotFound).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// edit fields
	if payload.Name != nil {
		competition.Name = *payload.Name
	}
	if payload.Location != nil {
		competition.Location = *payload.Location
	}
	if payload.Date != nil {
		date, _ := time.Parse(time.DateOnly, *payload.Date)
		competition.Date = date
	}

	// save object
	err = ini.DB.Save(&competition).Error
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// publish changes to channel
	pubsub.PublishUpdate(pubsub.ChannelNameCompetitionList)
	channel := strings.Replace(pubsub.ChannelNameCompetitionDetails, "?", id, 1)
	pubsub.PublishUpdate(channel)

	// respond
	return ctx.SendStatus(fiber.StatusOK)
}

// DeleteCompetition handles the following endpoint: DELETE competitions/:id
func DeleteCompetition(ctx *fiber.Ctx) error {
	// get competition ID
	id := ctx.Params("id")

	// delete object
	err := ini.DB.Where("id = ?", id).Delete(&models.Competition{}).Error
	if err != nil {
		return ctx.Status(fiber.StatusNotFound).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// publish changes
	pubsub.PublishUpdate(pubsub.ChannelNameCompetitionList)
	channel := strings.Replace(pubsub.ChannelNameCompetitionDetails, "?", id, 1)
	pubsub.PublishUpdate(channel)

	// respond
	return ctx.SendStatus(fiber.StatusOK)
}
