package controllers

import (
	"github.com/gofiber/fiber/v2"
	"strings"
	"utr-api-v2/ini"
	"utr-api-v2/models"
	"utr-api-v2/pubsub"
	"utr-api-v2/schemas"
	"utr-api-v2/utils"
)

// GetTeamList handles the following endpoint: GET /teams/
func GetTeamList(ctx *fiber.Ctx) error {
	// fetch list
	var teams []models.Team
	err := ini.DB.Find(&teams).Error
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.NewListResponseMessage(teams))
}

// CreateTeam handles the following endpoint: PUT /teams/
func CreateTeam(ctx *fiber.Ctx) error {
	// parse payload
	payload := ctx.Locals("payload").(schemas.CreateTeamRequest)

	// create team
	team := models.NewTeam(payload)
	err := ini.DB.Create(&team).Error
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// publish update and respond
	pubsub.PublishUpdate(pubsub.ChannelNameTeamList)
	return ctx.SendStatus(fiber.StatusCreated)
}

// GetTeamDetails handles the following endpoint: GET /teams/:id
func GetTeamDetails(ctx *fiber.Ctx) error {
	// get team ID
	id := ctx.Params("id")

	// fetch details
	var team models.Team
	err := ini.DB.
		Preload("Swimmers").Preload("Swimmers.Sex").
		Where("id = ?", id).First(&team).Error

	if err != nil {
		return ctx.Status(fiber.StatusNotFound).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// respond
	return ctx.Status(fiber.StatusOK).
		JSON(utils.NewObjectResponseMessage(team))
}

// EditTeamDetails handles the following endpoint: PATH /teams/:id
func EditTeamDetails(ctx *fiber.Ctx) error {
	// get team ID
	id := ctx.Params("id")

	// parse request body
	payload := ctx.Locals("payload").(schemas.EditTeamRequest)

	// fetch team
	var team models.Team
	err := ini.DB.
		Preload("Swimmers").Preload("Swimmers.Sex").
		Where("id = ?", id).First(&team).Error

	if err != nil {
		return ctx.Status(fiber.StatusNotFound).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	if &payload.Name != nil {
		team.Name = payload.Name
	}
	if &payload.City != nil {
		team.City = payload.City
	}

	// save object
	err = ini.DB.Save(&team).Error
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// publish changes to channel
	pubsub.PublishUpdate(pubsub.ChannelNameTeamList)
	channel := strings.Replace(pubsub.ChannelNameTeamDetails, "?", id, 1)
	pubsub.PublishUpdate(channel)

	// respond
	return ctx.SendStatus(fiber.StatusOK)
}

// DeleteTeam  handles the following endpoint: DELETE /teams/:id
func DeleteTeam(ctx *fiber.Ctx) error {
	// get team ID
	id := ctx.Params("id")

	// delete object
	err := ini.DB.Where("id = ?", id).Delete(&models.Team{}).Error
	if err != nil {
		return ctx.Status(fiber.StatusNotFound).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// publish changes
	pubsub.PublishUpdate(pubsub.ChannelNameTeamList)
	channel := strings.Replace(pubsub.ChannelNameTeamDetails, "?", id, 1)
	pubsub.PublishUpdate(channel)

	// respond
	return ctx.SendStatus(fiber.StatusOK)
}
