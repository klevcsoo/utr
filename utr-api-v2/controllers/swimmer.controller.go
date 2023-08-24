package controllers

import (
	"net/url"
	"strconv"
	"utr-api-v2/ini"
	"utr-api-v2/models"
	"utr-api-v2/pubsub"
)

func SwimmerDetailsSocket(channel *pubsub.Channel, client *pubsub.Client) {
	// parse swimmer ID
	swimmerID := client.Connection.Params("id")

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
	client.Whisper(createSwimmerMessage())

	client.OnMessage(func(payload url.Values) {
		if !payload.Has("command") {
			client.WhisperError("Missing command")
			return
		}

		switch payload.Get("command") {
		case "edit":
			var swimmer models.Swimmer
			err := ini.DB.First(&swimmer, swimmerID).Error
			if err != nil {
				client.WhisperError(err.Error())
				return
			}

			if payload.Has("name") {
				swimmer.Name = payload.Get("name")
			}
			if payload.Has("yearOfBirth") {
				yob, err := strconv.Atoi(payload.Get("yearOfBirth"))
				if err != nil {
					client.WhisperError("Failed to parse 'yearOfBirth': " + err.Error())
					return
				}

				swimmer.YearOfBirth = uint(yob)
			}
			if payload.Has("sex") {
				swimmer.SexID = payload.Get("sex")
			}

			err = ini.DB.Save(&swimmer).Error
			if err != nil {
				client.WhisperError(err.Error())
				return
			}
		default:
			return
		}

		channel.Broadcast(createSwimmerMessage())
	})
}
