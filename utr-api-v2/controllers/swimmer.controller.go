package controllers

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2/log"
	"net/url"
	"strconv"
	"utr-api-v2/ini"
	"utr-api-v2/models"
	"utr-api-v2/pubsub"
)

func SwimmerDetailsSocket(channel *pubsub.Channel, conn *websocket.Conn) {
	// parse swimmer ID
	swimmerID, err := strconv.Atoi(conn.Params("id"))
	if err != nil {
		log.Warnf("Failed to parse team ID: %s", err.Error())
		return
	}

	createSwimmerMessage := func() *pubsub.Message {
		var swimmer models.Swimmer
		ini.DB.Joins("Sex").First(&swimmer, swimmerID)
		return &pubsub.Message{
			Headers: "type=object",
			Body:    swimmer,
		}
	}

	pubsub.Whisper(conn, createSwimmerMessage())

	pubsub.OnClientMessage(conn, func(payload url.Values) {
		if payload.Get("command") == "edit" {
			var swimmer models.Swimmer
			ini.DB.First(&swimmer, swimmerID)

			if payload.Has("name") {
				swimmer.Name = payload.Get("name")
			}
			if payload.Has("yearOfBirth") {
				yob, err := strconv.Atoi(payload.Get("yearOfBirth"))
				if err != nil {
					log.Warnf("Failed to parse 'year of birth': %s", err.Error())
				} else {
					swimmer.YearOfBirth = uint(yob)
				}
			}
			if payload.Has("sex") {
				swimmer.SexID = payload.Get("sex")
			}

			ini.DB.Save(&swimmer)
		} else {
			return
		}

		channel.Broadcast(createSwimmerMessage())
	})
}
