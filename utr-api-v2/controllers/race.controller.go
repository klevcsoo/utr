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

// CreateRace handles the following endpoint: PUT /competitions/:id/races/
func CreateRace(ctx *fiber.Ctx) error {
	competitionID, err := strconv.Atoi(ctx.Params("id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// parse payload
	payload := ctx.Locals("payload").(schemas.CreateRaceRequest)

	// create competition
	competition := models.NewRace(competitionID, payload)
	err = ini.DB.Create(&competition).Error
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// publish changes to space
	space := strings.Replace(
		pubsub.SpaceNameCompetitionDetails, "?", strconv.Itoa(competitionID), 1)
	pubsub.PublishUpdate(space)

	// respond
	return ctx.SendStatus(fiber.StatusOK)
}

// GetRaceDetails handles the following endpoint: GET /competitions/:cid/races/:rid
func GetRaceDetails(ctx *fiber.Ctx) error {
	// get race ID
	raceID := ctx.Params("rid")

	// fetch details
	var race models.Race
	err := ini.DB.
		Joins("Competition").Joins("SwimmingStyle").Joins("Entries").
		Where("\"races\".\"id\" = ?", raceID).First(&race).
		Error

	if err != nil {
		return ctx.Status(fiber.StatusNotFound).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// respond
	return ctx.Status(fiber.StatusOK).
		JSON(utils.NewObjectResponseMessage(race))
}

// EditRaceDetails handles the following endpoint: PATCH /competitions/:cid/races/:rid
func EditRaceDetails(ctx *fiber.Ctx) error {
	// parse competition and race ID
	competitionID := ctx.Params("cid")
	raceID := ctx.Params("rid")

	// parse request body
	payload := ctx.Locals("payload").(schemas.EditRaceRequest)

	// fetch details
	var race models.Race
	err := ini.DB.
		Joins("Competition").Joins("SwimmingStyle").Joins("Entries").
		Where("\"races\".\"id\" = ?", raceID).First(&race).
		Error

	if err != nil {
		return ctx.Status(fiber.StatusNotFound).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// edit fields
	if payload.Length != 0 {
		race.Length = payload.Length
	}
	if payload.SwimmingStyle != "" {
		race.SwimmingStyleID = payload.SwimmingStyle
	}
	if payload.RelayEnabled == true {
		race.Relay = payload.Relay
	}

	// save object
	err = ini.DB.Save(&race).Error
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// publish changes to spaces
	competitionSpace := strings.Replace(
		pubsub.SpaceNameCompetitionDetails, "?", competitionID, 1)
	pubsub.PublishUpdate(competitionSpace)
	raceSpace := strings.Replace(
		pubsub.SpaceNameRaceDetails, "?", raceID, 1)
	pubsub.PublishUpdate(raceSpace)

	// respond
	return ctx.SendStatus(fiber.StatusOK)
}

// DeleteRace handles the following endpoint: DELETE /competitions/:cid/races/:rid
func DeleteRace(ctx *fiber.Ctx) error {
	// parse competition and race ID
	competitionID := ctx.Params("cid")
	raceID := ctx.Params("rid")

	// delete object
	err := ini.DB.Where("id = ?", raceID).Delete(&models.Race{}).Error
	if err != nil {
		return ctx.Status(fiber.StatusNotFound).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// publish changes to spaces
	competitionSpace := strings.Replace(
		pubsub.SpaceNameCompetitionDetails, "?", competitionID, 1)
	pubsub.PublishUpdate(competitionSpace)
	raceSpace := strings.Replace(
		pubsub.SpaceNameRaceDetails, "?", raceID, 1)
	pubsub.PublishUpdate(raceSpace)

	// respond
	return ctx.SendStatus(fiber.StatusOK)
}
