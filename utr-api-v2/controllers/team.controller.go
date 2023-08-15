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

func AllTeamsSocket(conn *websocket.Conn) {
	// get channel
	channel := pubsub.GetChannel("team")

	// handle register & unregister
	defer func() {
		channel.Unregister(conn)
	}()
	channel.Register(conn)

	sendData := func() {
		var teams []models.Team
		ini.DB.Find(&teams)
		channel.Whisper(&pubsub.Message{
			Headers: "type=list",
			Body:    teams,
		}, conn)
	}

	// send initial data
	sendData()

	for {
		// read message from the client
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Warnf("Failed to read message: %s", err.Error())
			channel.Whisper(&pubsub.Message{
				Headers: "type=error",
				Body:    err.Error(),
			}, conn)
			break
		}
		log.Infof("Received WebSocket message: %s", msg)

		// parse client message
		payload, err := url.ParseQuery(string(msg))
		if err != nil {
			log.Warnf("Failed to parse client message: %s", err.Error())
			channel.Whisper(&pubsub.Message{
				Headers: "type=error",
				Body:    err.Error(),
			}, conn)
			continue
		}

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
	}
}

func TeamDetailsSocket(conn *websocket.Conn) {
	// get channel
	channel := pubsub.GetChannel("team")

	// handle register & unregister
	defer func() {
		channel.Unregister(conn)
	}()
	channel.Register(conn)

	// parse team ID
	teamID, err := strconv.Atoi(conn.Params("id"))
	if err != nil {
		log.Warnf("Failed to parse team ID: %s", err.Error())
		return
	}

	sendData := func() {
		var team models.Team
		ini.DB.First(&team, teamID)
		channel.Whisper(&pubsub.Message{
			Headers: "type=object",
			Body:    team,
		}, conn)
	}

	// send initial data
	sendData()

	for {
		// read message from the client
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Warnf("Failed to read message: %s", err.Error())
			channel.Whisper(&pubsub.Message{
				Headers: "type=error",
				Body:    err.Error(),
			}, conn)
			break
		}
		log.Infof("Received WebSocket message: %s", msg)

		// parse client message
		payload, err := url.ParseQuery(string(msg))
		if err != nil {
			log.Warnf("Failed to parse client message: %s", err.Error())
			channel.Whisper(&pubsub.Message{
				Headers: "type=error",
				Body:    err.Error(),
			}, conn)
			continue
		}

		// handle commands
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
	}
}
