package controllers

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2/log"
	"gorm.io/datatypes"
	"net/url"
	"strconv"
	"time"
	"utr-api-v2/ini"
	"utr-api-v2/models"
	"utr-api-v2/pubsub"
)

func AllCompetitionsSocket(channel *pubsub.Channel, conn *websocket.Conn) {
	createCompetitionsMessage := func() *pubsub.Message {
		var competitions []models.Competition
		ini.DB.Find(&competitions)
		return &pubsub.Message{
			Type:    pubsub.MessageTypeList,
			Content: competitions,
		}
	}

	sendError := func(msg string) {
		log.Warn(msg)
		pubsub.Whisper(conn, &pubsub.Message{
			Type:    pubsub.MessageTypeError,
			Content: msg,
		})
	}

	// send initial data
	pubsub.Whisper(conn, createCompetitionsMessage())

	pubsub.OnClientMessage(conn, func(payload url.Values) {
		if !payload.Has("command") {
			sendError("Missing command")
			return
		}

		switch payload.Get("command") {
		case "create":
			date, err := time.Parse(time.DateOnly, payload.Get("date"))
			if err != nil {
				sendError(err.Error())
			}

			competition := &models.Competition{
				Name:     payload.Get("name"),
				Location: payload.Get("location"),
				Date:     datatypes.Date(date),
			}

			err = ini.DB.Create(competition).Error
			if err != nil {
				sendError(err.Error())
				return
			}
		case "delete":
			if !payload.Has("id") {
				sendError("Missing ID")
				return
			}

			ini.DB.Where("id = ?").Delete(&models.Competition{})
		}

		// send modified data back
		channel.Broadcast(createCompetitionsMessage())
	})
}

func CompetitionDetailsSocket(channel *pubsub.Channel, conn *websocket.Conn) {
	sendError := func(msg string) {
		log.Warn(msg)
		pubsub.Whisper(conn, &pubsub.Message{
			Type:    pubsub.MessageTypeError,
			Content: msg,
		})
	}

	id, err := strconv.Atoi(conn.Params("id"))
	if err != nil {
		sendError("Failed to parse ID: " + err.Error())
		return
	}

	createCompetitionMessage := func() *pubsub.Message {
		var competition models.Competition
		ini.DB.
			Preload("Races").
			Preload("Races.SwimmingStyle").
			Where("id = ?", id).
			First(&competition)

		return &pubsub.Message{
			Type:    pubsub.MessageTypeObject,
			Content: competition,
		}
	}

	// send initial data
	pubsub.Whisper(conn, createCompetitionMessage())

	pubsub.OnClientMessage(conn, func(payload url.Values) {
		switch payload.Get("command") {
		case "edit":
			var competition models.Competition
			ini.DB.Where("id = ?", id).First(&competition)

			if payload.Has("name") {
				competition.Name = payload.Get("name")
			}
			if payload.Has("location") {
				competition.Location = payload.Get("location")
			}
			if payload.Has("date") {
				date, err := time.Parse(time.DateOnly, payload.Get("date"))
				if err != nil {
					sendError(err.Error())
				} else {
					competition.Date = datatypes.Date(date)
				}
			}

			ini.DB.Save(&competition)
		case "createRace":
			length, err := strconv.Atoi(payload.Get("length"))
			if err != nil {
				sendError("Failed to parse 'length': " + err.Error())
				return
			}

			var relay int
			if payload.Has("relay") {
				relay, err = strconv.Atoi(payload.Get("relay"))
				if err != nil {
					sendError("Failed to parse 'relay': " + err.Error())
					return
				}
			}

			race := &models.Race{
				Length:          length,
				Relay:           relay,
				SwimmingStyleID: payload.Get("styleId"),
				CompetitionID:   id,
			}

			err = ini.DB.Create(&race).Error
			if err != nil {
				sendError(err.Error())
				return
			}
		case "deleteRace":
			err := ini.DB.
				Where("id = ?", payload.Get("raceId")).
				Delete(&models.Race{}).
				Error
			if err != nil {
				sendError(err.Error())
			}
		}

		// send back modified data
		channel.Broadcast(createCompetitionMessage())
	})
}
