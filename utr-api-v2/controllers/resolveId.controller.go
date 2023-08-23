package controllers

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2/log"
	"net/url"
	"utr-api-v2/ini"
	"utr-api-v2/models"
	"utr-api-v2/pubsub"
)

func ResolveIdSocket(_ *pubsub.Channel, conn *websocket.Conn) {
	sendError := func(msg string) {
		log.Warnf(msg)
		pubsub.Whisper(conn, &pubsub.Message{
			Type:    pubsub.MessageTypeError,
			Content: msg,
		})
	}

	sendResolvedString := func(name string) {
		pubsub.Whisper(conn, &pubsub.Message{
			Type:    pubsub.MessageTypeText,
			Content: name,
		})
	}

	pubsub.OnClientMessage(conn, func(payload url.Values) {
		if !payload.Has("type") || !payload.Has("id") {
			sendError("Missing type or ID")
			return
		}

		id := payload.Get("id")

		switch payload.Get("type") {
		case "team":
			var team models.Team
			ini.DB.Where("id = ?", id).First(&team)
			sendResolvedString(team.Name)
		case "swimmer":
			var swimmer models.Swimmer
			ini.DB.Where("id = ?", id).First(&swimmer)
			sendResolvedString(swimmer.Name)
		}
	})
}
