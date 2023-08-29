package controllers

import (
	"github.com/gofiber/fiber/v2"
	"strconv"
	"strings"
	"utr-api-v2/ini"
	"utr-api-v2/models"
	"utr-api-v2/pubsub"
	"utr-api-v2/schemas"
	"utr-api-v2/utils"
)

// CreateSwimmer handles the following endpoint: PUT /teams/:id/swimmers/
func CreateSwimmer(ctx *fiber.Ctx) error {
	teamID, err := strconv.Atoi(ctx.Params("id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// parse payload
	payload := ctx.Locals("payload").(schemas.CreateSwimmerRequest)

	// create swimmer
	swimmer := models.NewSwimmer(teamID, payload)
	err = ini.DB.Create(&swimmer).Error
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// publish changes to channel
	channel := strings.Replace(
		pubsub.ChannelNameTeamDetails, "?", strconv.Itoa(teamID), 1)
	pubsub.PublishUpdate(channel)

	// respond
	return ctx.SendStatus(fiber.StatusOK)
}

// GetSwimmerDetails handles the following endpoint: GET /teams/:tid/swimmers/:sid
func GetSwimmerDetails(ctx *fiber.Ctx) error {
	// get swimmer ID
	swimmerID := ctx.Params("sid")

	// fetch details
	var race models.Swimmer
	err := ini.DB.Joins("Sex").First(&race, swimmerID).Error

	if err != nil {
		return ctx.Status(fiber.StatusNotFound).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// respond
	return ctx.Status(fiber.StatusOK).
		JSON(utils.NewObjectResponseMessage(race))
}

// EditSwimmerDetails handles the following endpoint: PATCH /teams/:tid/swimmers/:sid
func EditSwimmerDetails(ctx *fiber.Ctx) error {
	// parse team and swimmer ID
	teamID := ctx.Params("tid")
	swimmerID := ctx.Params("sid")

	// parse request body
	payload := ctx.Locals("payload").(schemas.EditSwimmerRequest)

	// fetch details
	var swimmer models.Swimmer
	err := ini.DB.Joins("Sex").First(&swimmer, teamID).Error

	if err != nil {
		return ctx.Status(fiber.StatusNotFound).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// edit fields
	if &payload.Name != nil {
		swimmer.Name = payload.Name
	}
	if &payload.YearOfBirth != nil {
		swimmer.YearOfBirth = payload.YearOfBirth
	}
	if &payload.Sex != nil {
		swimmer.SexID = payload.Sex
	}
	if &payload.Team != nil {
		swimmer.TeamID = payload.Team
	}

	// save object
	err = ini.DB.Save(&swimmer).Error
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// publish changes to channels
	teamChannel := strings.Replace(
		pubsub.ChannelNameTeamDetails, "?", teamID, 1)
	pubsub.PublishUpdate(teamChannel)
	swimmerChannel := strings.Replace(
		pubsub.ChannelNameSwimmerDetails, "?", swimmerID, 1)
	pubsub.PublishUpdate(swimmerChannel)

	// respond
	return ctx.SendStatus(fiber.StatusOK)
}

// DeleteSwimmer handles the following endpoint: DELETE /teams/:tid/swimmers/:sid
func DeleteSwimmer(ctx *fiber.Ctx) error {
	// parse team and swimmer ID
	teamID := ctx.Params("tid")
	swimmerID := ctx.Params("tid")

	// delete object
	err := ini.DB.Where("id = ?", swimmerID).Delete(&models.Swimmer{}).Error
	if err != nil {
		return ctx.Status(fiber.StatusNotFound).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// publish changes to channels
	teamChannels := strings.Replace(
		pubsub.ChannelNameTeamDetails, "?", teamID, 1)
	pubsub.PublishUpdate(teamChannels)
	swimmerChannels := strings.Replace(
		pubsub.ChannelNameSwimmerDetails, "?", swimmerID, 1)
	pubsub.PublishUpdate(swimmerChannels)

	// respond
	return ctx.SendStatus(fiber.StatusOK)
}
