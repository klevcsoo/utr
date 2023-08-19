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

const channelName = "teams"

func AllTeamsSocket(conn *websocket.Conn) {
	// get channel
	channel := pubsub.GetChannel(channelName)

	// handle register & unregister
	defer func() {
		channel.Unregister(conn)
	}()
	channel.Register(conn)

	sendData := func() {
		var teams []models.Team
		ini.DB.Find(&teams)
		pubsub.Whisper(&pubsub.Message{
			Headers: "type=list",
			Body:    teams,
		}, conn)
	}

	// send initial data
	sendData()

	pubsub.OnClientMessage(conn, func(payload url.Values) {
		if payload.Get("command") == "create" {
			// handle create command
			team := &models.Team{
				Name: payload.Get("name"),
				City: payload.Get("city"),
			}
			ini.DB.Create(&team)

			// send back modified data to the client
			sendData()
		}
	})
}

func TeamDetailsSocket(conn *websocket.Conn) {
	// parse team ID
	teamID, err := strconv.Atoi(conn.Params("id"))
	if err != nil {
		log.Warnf("Failed to parse team ID: %s", err.Error())
		return
	}

	// get channel
	channel := pubsub.GetChannel(channelName + "/" + string(rune(teamID)))

	// handle register & unregister
	defer func() {
		channel.Unregister(conn)
	}()
	channel.Register(conn)

	sendData := func() {
		var team models.TeamWithSwimmers
		ini.DB.First(&team, teamID)
		pubsub.Whisper(&pubsub.Message{
			Headers: "type=object",
			Body:    team,
		}, conn)
	}

	// send initial data
	sendData()

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
			sendData()
		} else if payload.Get("command") == "delete" {
			ini.DB.Delete(&models.Team{}, teamID)
			sendData()
		}
	})
}
