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

func AllTeamsSocket(channel *pubsub.Channel, conn *websocket.Conn) {
	createTeamsMessage := func() *pubsub.Message {
		var teams []models.Team
		ini.DB.Find(&teams)
		return &pubsub.Message{
			Headers: "type=list",
			Body:    teams,
		}
	}

	// send initial data
	pubsub.Whisper(conn, createTeamsMessage())

	pubsub.OnClientMessage(conn, func(payload url.Values) {
		if payload.Get("command") == "create" {
			// handle create command
			team := &models.Team{
				Name: payload.Get("name"),
				City: payload.Get("city"),
			}
			ini.DB.Create(&team)

		} else {
			return
		}

		// send back modified data to the clients
		channel.Broadcast(createTeamsMessage())
	})
}

func TeamDetailsSocket(channel *pubsub.Channel, conn *websocket.Conn) {
	// parse team ID
	teamID, err := strconv.Atoi(conn.Params("id"))
	if err != nil {
		log.Warnf("Failed to parse team ID: %s", err.Error())
		return
	}

	createTeamMessage := func() *pubsub.Message {
		var team models.Team
		ini.DB.Preload("Swimmers").Preload("Swimmers.Sex").First(&team, teamID)
		return &pubsub.Message{
			Headers: "type=object",
			Body:    team,
		}
	}
	whisperError := func(err error) {
		pubsub.Whisper(conn, &pubsub.Message{
			Headers: "type=error",
			Body:    err.Error(),
		})
	}

	// send initial data
	pubsub.Whisper(conn, createTeamMessage())

	// handle commands
	pubsub.OnClientMessage(conn, func(payload url.Values) {
		if payload.Get("command") == "edit" {
			var team models.Team
			ini.DB.First(&team, teamID)

			if payload.Has("name") {
				team.Name = payload.Get("name")
			}
			if payload.Has("city") {
				team.City = payload.Get("city")
			}

			ini.DB.Save(&team)
		} else if payload.Get("command") == "delete" {
			ini.DB.Delete(&models.Team{}, teamID)
		} else if payload.Get("command") == "createSwimmer" {
			yob, err := strconv.Atoi(payload.Get("yearOfBirth"))
			if err != nil {
				log.Warnf("Failed to parse year of birth: %s", err.Error())
				whisperError(err)
				return
			} else {
				swimmer := models.Swimmer{
					TeamID:      teamID,
					Name:        payload.Get("name"),
					YearOfBirth: uint(yob),
					SexID:       payload.Get("sex"),
				}

				err := ini.DB.Create(&swimmer).Error
				if err != nil {
					log.Warn(err.Error())
					whisperError(err)
					return
				}
			}
		} else {
			return
		}

		channel.Broadcast(createTeamMessage())
	})
}
