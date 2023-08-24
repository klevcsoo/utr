package controllers

import (
	"net/url"
	"utr-api-v2/ini"
	"utr-api-v2/models"
	"utr-api-v2/pubsub"
)

func ResolveIdSocket(_ *pubsub.Channel, client *pubsub.Client) {
	sendResolvedString := func(name string) {
		client.Whisper(&pubsub.Message{
			Type:    pubsub.MessageTypeText,
			Content: name,
		})
	}

	client.OnMessage(func(payload url.Values) {
		if !payload.Has("type") || !payload.Has("id") {
			client.WhisperError("Missing type or ID")
			return
		}

		id := payload.Get("id")

		switch payload.Get("type") {
		case "team":
			var team models.Team
			err := ini.DB.Where("id = ?", id).First(&team).Error
			if err != nil {
				client.WhisperError(err.Error())
				return
			}

			sendResolvedString(team.Name)
		case "swimmer":
			var swimmer models.Swimmer
			err := ini.DB.Where("id = ?", id).First(&swimmer).Error
			if err != nil {
				client.WhisperError(err.Error())
				return
			}

			sendResolvedString(swimmer.Name)
		}
	})
}
