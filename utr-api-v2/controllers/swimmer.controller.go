package controllers

import (
	"github.com/gofiber/contrib/websocket"
	"net/url"
	"strconv"
	"utr-api-v2/ini"
	"utr-api-v2/models"
	"utr-api-v2/pubsub"
)

func SwimmerDetailsSocket(channel *pubsub.Channel, conn *websocket.Conn) {
	// parse swimmer ID
	swimmerID := conn.Params("id")

	createSwimmerMessage := func() *pubsub.Message {
		var swimmer models.Swimmer
		err := ini.DB.Joins("Sex").First(&swimmer, swimmerID).Error

		if err != nil {
			return &pubsub.Message{
				Type:    pubsub.MessageTypeError,
				Content: err.Error(),
			}
		} else {
			return &pubsub.Message{
				Type:    pubsub.MessageTypeObject,
				Content: swimmer,
			}
		}
	}

	// send initial data
	pubsub.Whisper(conn, createSwimmerMessage())

	pubsub.OnClientMessage(conn, func(payload url.Values) {
		if !payload.Has("command") {
			pubsub.WhisperError(conn, "Missing command")
			return
		}

		switch payload.Get("command") {
		case "edit":
			var swimmer models.Swimmer
			err := ini.DB.First(&swimmer, swimmerID).Error
			if err != nil {
				pubsub.WhisperError(conn, err.Error())
				return
			}

			if payload.Has("name") {
				swimmer.Name = payload.Get("name")
			}
			if payload.Has("yearOfBirth") {
				yob, err := strconv.Atoi(payload.Get("yearOfBirth"))
				if err != nil {
					pubsub.WhisperError(conn, "Failed to parse 'yearOfBirth': "+err.Error())
					return
				}

				swimmer.YearOfBirth = uint(yob)
			}
			if payload.Has("sex") {
				swimmer.SexID = payload.Get("sex")
			}

			err = ini.DB.Save(&swimmer).Error
			if err != nil {
				pubsub.WhisperError(conn, err.Error())
				return
			}
		default:
			return
		}

		channel.Broadcast(createSwimmerMessage())
	})
}
