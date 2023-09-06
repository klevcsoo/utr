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

// CreateEntry handles the following endpoint:
// PUT /competitions/:cid/races/:rid/entries/
func CreateEntry(ctx *fiber.Ctx) error {
	raceID, err := strconv.Atoi(ctx.Params("rid"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// parse payload
	payload := ctx.Locals("payload").(schemas.CreateEntryRequest)

	// create entry
	entry := models.NewEntry(raceID, payload)
	err = ini.DB.Create(&entry).Error
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// publish changes to channel
	channel := strings.Replace(
		pubsub.ChannelNameEntryDetails, "?", strconv.Itoa(raceID), 1)
	pubsub.PublishUpdate(channel)

	// respond
	return ctx.SendStatus(fiber.StatusCreated)
}

// GetEntryDetails handles the following endpoint:
// GET /competitions/:cid/races/:rid/entries/:eid
func GetEntryDetails(ctx *fiber.Ctx) error {
	// get entry ID
	entryID := ctx.Params("eid")

	// fetch details
	var entry models.Entry
	err := ini.DB.
		Joins("Swimmer").Joins("Swimmer.Team").
		Joins("Race").Joins("Race.SwimmingStyle").
		Where("\"entries\".\"id\" = ?", entryID).First(&entry).
		Error

	if err != nil {
		return ctx.Status(fiber.StatusNotFound).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// respond
	return ctx.Status(fiber.StatusOK).
		JSON(utils.NewObjectResponseMessage(entry))
}

// EditEntryDetails handles the following endpoint:
// PATCH /competitions/:cid/races/:rid/entries/:eid
func EditEntryDetails(ctx *fiber.Ctx) error {
	// parse race and entry ID
	raceID := ctx.Params("rid")
	entryID := ctx.Params("eid")

	// parse request body
	payload := ctx.Locals("payload").(schemas.EditEntryRequest)

	// fetch details
	var entry models.Entry
	err := ini.DB.Where("id = ?", entryID).First(&entry).Error

	if err != nil {
		return ctx.Status(fiber.StatusNotFound).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	if payload.EntryTime != nil {
		entry.EntryTime = *payload.EntryTime
	}
	if payload.TimeResult != nil {
		entry.TimeResult = *payload.TimeResult
	}
	if payload.Present != nil {
		entry.Present = *payload.Present
	}

	// save object
	err = ini.DB.Save(&entry).Error
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// publish changes to channels
	raceChannel := strings.Replace(
		pubsub.ChannelNameRaceDetails, "?", raceID, 1)
	pubsub.PublishUpdate(raceChannel)
	competitionChannel := strings.Replace(
		pubsub.ChannelNameEntryDetails, "?", entryID, 1)
	pubsub.PublishUpdate(competitionChannel)

	// respond
	return ctx.SendStatus(fiber.StatusOK)
}

// DeleteEntry handles the following endpoint:
// DELETE /competitions/:cid/races/:rid/entries/:eid
func DeleteEntry(ctx *fiber.Ctx) error {
	// parse race and entry ID
	raceID := ctx.Params("rid")
	entryID := ctx.Params("eid")

	// delete object
	err := ini.DB.Where("id = ?", entryID).Delete(&models.Entry{}).Error
	if err != nil {
		return ctx.Status(fiber.StatusNotFound).
			JSON(utils.NewErrorResponseMessage(err.Error()))
	}

	// publish changes to channels
	raceChannel := strings.Replace(
		pubsub.ChannelNameRaceDetails, "?", raceID, 1)
	pubsub.PublishUpdate(raceChannel)
	competitionChannel := strings.Replace(
		pubsub.ChannelNameEntryDetails, "?", entryID, 1)
	pubsub.PublishUpdate(competitionChannel)

	// respond
	return ctx.SendStatus(fiber.StatusOK)
}
