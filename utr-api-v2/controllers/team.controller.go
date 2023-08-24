package controllers

import (
	"net/url"
	"strconv"
	"utr-api-v2/ini"
	"utr-api-v2/models"
	"utr-api-v2/pubsub"
)

func AllTeamsSocket(channel *pubsub.Channel, client *pubsub.Client) {
	createTeamsMessage := func() *pubsub.Message {
		var teams []models.Team
		err := ini.DB.Find(&teams).Error
		if err != nil {
			return &pubsub.Message{
				Type:    pubsub.MessageTypeError,
				Content: err.Error(),
			}
		} else {
			return &pubsub.Message{
				Type:    pubsub.MessageTypeList,
				Content: teams,
			}
		}
	}

	// send initial data
	client.Whisper(createTeamsMessage())

	client.OnMessage(func(payload url.Values) {
		if !payload.Has("command") {
			client.WhisperError("Missing command")
		}

		switch payload.Get("command") {
		case "create":
			team := &models.Team{
				Name: payload.Get("name"),
				City: payload.Get("city"),
			}

			err := ini.DB.Create(&team).Error
			if err != nil {
				client.WhisperError(err.Error())
				return
			}
		case "delete":
			teamID, err := strconv.Atoi(payload.Get("team"))
			if err != nil {
				client.WhisperError("Failed to parse team ID: " + err.Error())
				return
			}

			err = ini.DB.Where("id = ?", teamID).Delete(&models.Team{}).Error
			if err != nil {
				client.WhisperError(err.Error())
				return
			}
		default:
			return
		}

		// send back modified data to the clients
		channel.Broadcast(createTeamsMessage())
	})
}

func TeamDetailsSocket(channel *pubsub.Channel, client *pubsub.Client) {
	// parse team ID
	teamID, err := strconv.Atoi(client.Connection.Params("id"))
	if err != nil {
		client.WhisperError("Failed to parse team ID: " + err.Error())
		return
	}

	createTeamMessage := func() *pubsub.Message {
		var team models.Team
		ini.DB.Preload("Swimmers").Preload("Swimmers.Sex").First(&team, teamID)
		return &pubsub.Message{
			Type:    pubsub.MessageTypeObject,
			Content: team,
		}
	}

	// send initial data
	client.Whisper(createTeamMessage())

	client.OnMessage(func(payload url.Values) {
		if !payload.Has("command") {
			client.WhisperError("Missing command")
		}

		switch payload.Get("command") {
		case "edit":
			var team models.Team
			err := ini.DB.Where("id = ?", teamID).First(&team).Error
			if err != nil {
				client.WhisperError(err.Error())
				return
			}

			if payload.Has("name") {
				team.Name = payload.Get("name")
			}
			if payload.Has("city") {
				team.City = payload.Get("city")
			}

			err = ini.DB.Save(&team).Error
			if err != nil {
				client.WhisperError(err.Error())
				return
			}
		case "createSwimmer":
			yob, err := strconv.Atoi(payload.Get("yearOfBirth"))
			if err != nil {
				client.WhisperError("Failed to parse year of birth: " + err.Error())
				return
			}

			swimmer := models.Swimmer{
				TeamID:      teamID,
				Name:        payload.Get("name"),
				YearOfBirth: uint(yob),
				SexID:       payload.Get("sex"),
			}

			err = ini.DB.Create(&swimmer).Error
			if err != nil {
				client.WhisperError(err.Error())
				return
			}
		case "deleteSwimmer":
			swimmerID, err := strconv.Atoi(payload.Get("swimmerId"))
			if err != nil {
				client.WhisperError("Failed to parse swimmer ID: " + err.Error())
				return
			}

			err = ini.DB.Where("id = ?", swimmerID).Delete(&models.Swimmer{}).Error
			if err != nil {
				client.WhisperError(err.Error())
				return
			}
		default:
			return
		}

		// send back modified data
		channel.Broadcast(createTeamMessage())
	})
}
