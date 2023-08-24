package controllers

import (
	"github.com/gofiber/contrib/websocket"
	"net/url"
	"strconv"
	"utr-api-v2/ini"
	"utr-api-v2/models"
	"utr-api-v2/pubsub"
)

func RaceDetailsSocket(channel *pubsub.Channel, conn *websocket.Conn) {
	// parse race ID
	raceID := conn.Params("id")

	createRaceMessage := func() *pubsub.Message {
		var race models.Race
		err := ini.DB.
			Joins("Competition").Joins("SwimmingStyle").Joins("Entries").
			Where("\"races\".\"id\" = ?", raceID).First(&race).
			Error

		if err != nil {
			return &pubsub.Message{
				Type:    pubsub.MessageTypeError,
				Content: err.Error(),
			}
		} else {
			return &pubsub.Message{
				Type:    pubsub.MessageTypeObject,
				Content: race,
			}
		}
	}

	// send initial data
	pubsub.Whisper(conn, createRaceMessage())

	pubsub.OnClientMessage(conn, func(payload url.Values) {
		if !payload.Has("command") {
			pubsub.WhisperError(conn, "Missing command")
			return
		}

		switch payload.Get("command") {
		case "edit":
			var race models.Race
			err := ini.DB.Where("id = ?", raceID).First(&race).Error
			if err != nil {
				pubsub.WhisperError(conn, err.Error())
				return
			}

			if payload.Has("length") {
				length, err := strconv.Atoi(payload.Get("length"))
				if err != nil {
					pubsub.WhisperError(conn, "Failed to parse 'length': "+err.Error())
					return
				}

				race.Length = length
			}
			if payload.Has("relay") {
				relay, err := strconv.Atoi("relay")
				if err != nil {
					pubsub.WhisperError(conn, "Failed to parse 'relay': "+err.Error())
					return
				}

				race.Relay = relay
			}
			if payload.Has("style") {
				race.SwimmingStyleID = payload.Get("style")
			}

			err = ini.DB.Save(&race).Error
			if err != nil {
				pubsub.WhisperError(conn, err.Error())
				return
			}
		default:
			return
		}

		channel.Broadcast(createRaceMessage())
	})
}
