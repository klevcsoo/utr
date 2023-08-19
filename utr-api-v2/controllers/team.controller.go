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
		var team models.TeamWithSwimmers
		ini.DB.First(&team, teamID)
		return &pubsub.Message{
			Headers: "type=object",
			Body:    team,
		}
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
		} else {
			return
		}

		channel.Broadcast(createTeamMessage())
	})
}
