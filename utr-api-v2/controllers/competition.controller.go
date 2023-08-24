package controllers

import (
	"github.com/gofiber/contrib/websocket"
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
		err := ini.DB.Find(&competitions).Error
		if err != nil {
			return &pubsub.Message{
				Type:    pubsub.MessageTypeError,
				Content: err.Error(),
			}
		} else {
			return &pubsub.Message{
				Type:    pubsub.MessageTypeList,
				Content: competitions,
			}
		}
	}

	// send initial data
	pubsub.Whisper(conn, createCompetitionsMessage())

	pubsub.OnClientMessage(conn, func(payload url.Values) {
		if !payload.Has("command") {
			pubsub.WhisperError(conn, "Missing command")
			return
		}

		switch payload.Get("command") {
		case "create":
			date, err := time.Parse(time.DateOnly, payload.Get("date"))
			if err != nil {
				pubsub.WhisperError(conn, err.Error())
				return
			}

			competition := &models.Competition{
				Name:     payload.Get("name"),
				Location: payload.Get("location"),
				Date:     datatypes.Date(date),
			}

			err = ini.DB.Create(competition).Error
			if err != nil {
				pubsub.WhisperError(conn, err.Error())
				return
			}
		case "delete":
			if !payload.Has("id") {
				pubsub.WhisperError(conn, "Missing ID")
				return
			}

			err := ini.DB.Where("id = ?").Delete(&models.Competition{}).Error
			if err != nil {
				pubsub.WhisperError(conn, err.Error())
				return
			}
		}

		// send modified data back
		channel.Broadcast(createCompetitionsMessage())
	})
}

func CompetitionDetailsSocket(channel *pubsub.Channel, conn *websocket.Conn) {
	id, err := strconv.Atoi(conn.Params("id"))
	if err != nil {
		pubsub.WhisperError(conn, "Failed to parse ID: "+err.Error())
		return
	}

	createCompetitionMessage := func() *pubsub.Message {
		var competition models.Competition
		err := ini.DB.
			Preload("Races").
			Preload("Races.SwimmingStyle").
			Where("id = ?", id).
			First(&competition).Error

		if err != nil {
			return &pubsub.Message{
				Type:    pubsub.MessageTypeError,
				Content: err.Error(),
			}
		} else {
			return &pubsub.Message{
				Type:    pubsub.MessageTypeObject,
				Content: competition,
			}
		}
	}

	// send initial data
	pubsub.Whisper(conn, createCompetitionMessage())

	pubsub.OnClientMessage(conn, func(payload url.Values) {
		if !payload.Has("command") {
			pubsub.WhisperError(conn, "Missing command")
			return
		}

		switch payload.Get("command") {
		case "edit":
			var competition models.Competition
			err := ini.DB.Where("id = ?", id).First(&competition).Error
			if err != nil {
				pubsub.WhisperError(conn, err.Error())
				return
			}

			if payload.Has("name") {
				competition.Name = payload.Get("name")
			}
			if payload.Has("location") {
				competition.Location = payload.Get("location")
			}
			if payload.Has("date") {
				date, err := time.Parse(time.DateOnly, payload.Get("date"))
				if err != nil {
					pubsub.WhisperError(conn, err.Error())
					return
				}

				competition.Date = datatypes.Date(date)
			}

			err = ini.DB.Save(&competition).Error
			if err != nil {
				pubsub.WhisperError(conn, err.Error())
				return
			}
		case "createRace":
			length, err := strconv.Atoi(payload.Get("length"))
			if err != nil {
				pubsub.WhisperError(conn, "Failed to parse 'length': "+err.Error())
				return
			}

			var relay int
			if payload.Has("relay") {
				relay, err = strconv.Atoi(payload.Get("relay"))
				if err != nil {
					pubsub.WhisperError(conn, "Failed to parse 'relay': "+err.Error())
					return
				}
			}

			race := &models.Race{
				Length:          length,
				Relay:           relay,
				SwimmingStyleID: payload.Get("style"),
				CompetitionID:   id,
			}

			err = ini.DB.Create(&race).Error
			if err != nil {
				pubsub.WhisperError(conn, err.Error())
				return
			}
		case "deleteRace":
			err := ini.DB.
				Where("id = ?", payload.Get("race")).
				Delete(&models.Race{}).
				Error

			if err != nil {
				pubsub.WhisperError(conn, err.Error())
				return
			}
		}

		// send back modified data
		channel.Broadcast(createCompetitionMessage())
	})
}
