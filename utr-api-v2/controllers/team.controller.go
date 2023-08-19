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
	fetchTeams := func() *[]models.Team {
		var teams []models.Team
		ini.DB.Find(&teams)
		return &teams
	}
	broadcastTeams := func() {
		channel.Broadcast(&pubsub.Message{
			Headers: "type=list",
			Body:    fetchTeams(),
		})
	}

	// send initial data
	pubsub.Whisper(&pubsub.Message{
		Headers: "type=list",
		Body:    fetchTeams(),
	}, conn)

	pubsub.OnClientMessage(conn, func(payload url.Values) {
		if payload.Get("command") == "create" {
			// handle create command
			team := &models.Team{
				Name: payload.Get("name"),
				City: payload.Get("city"),
			}
			ini.DB.Create(&team)

			// send back modified data to the client
			broadcastTeams()
		}
	})
}

func TeamDetailsSocket(channel *pubsub.Channel, conn *websocket.Conn) {
	// parse team ID
	teamID, err := strconv.Atoi(conn.Params("id"))
	if err != nil {
		log.Warnf("Failed to parse team ID: %s", err.Error())
		return
	}

	fetchTeam := func() *models.TeamWithSwimmers {
		var team models.TeamWithSwimmers
		ini.DB.First(&team, teamID)
		return &team
	}
	broadcastTeam := func() {
		channel.Broadcast(&pubsub.Message{
			Headers: "type=object",
			Body:    fetchTeam(),
		})
	}

	// send initial data
	pubsub.Whisper(&pubsub.Message{
		Headers: "type=object",
		Body:    fetchTeam(),
	}, conn)

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
			broadcastTeam()
		} else if payload.Get("command") == "delete" {
			ini.DB.Delete(&models.Team{}, teamID)
			broadcastTeam()
		}
	})
}
