package controllers

import (
	"github.com/gofiber/contrib/websocket"
	"net/url"
	"utr-api-v2/ini"
	"utr-api-v2/models"
	"utr-api-v2/pubsub"
)

func ResolveIdSocket(_ *pubsub.Channel, conn *websocket.Conn) {
	sendResolvedString := func(name string) {
		pubsub.Whisper(conn, &pubsub.Message{
			Type:    pubsub.MessageTypeText,
			Content: name,
		})
	}

	pubsub.OnClientMessage(conn, func(payload url.Values) {
		if !payload.Has("type") || !payload.Has("id") {
			pubsub.WhisperError(conn, "Missing type or ID")
			return
		}

		id := payload.Get("id")

		switch payload.Get("type") {
		case "team":
			var team models.Team
			err := ini.DB.Where("id = ?", id).First(&team).Error
			if err != nil {
				pubsub.WhisperError(conn, err.Error())
				return
			}

			sendResolvedString(team.Name)
		case "swimmer":
			var swimmer models.Swimmer
			err := ini.DB.Where("id = ?", id).First(&swimmer).Error
			if err != nil {
				pubsub.WhisperError(conn, err.Error())
				return
			}

			sendResolvedString(swimmer.Name)
		}
	})
}
