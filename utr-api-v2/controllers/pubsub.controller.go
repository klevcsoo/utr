package controllers

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"utr-api-v2/pubsub"
	"utr-api-v2/schemas"
	"utr-api-v2/utils"
)

func PubSubSocketController() fiber.Handler {
	return websocket.New(func(conn *websocket.Conn) {
		user := conn.Locals("user").(*schemas.UserPublicData)
		client := pubsub.NewClient(conn, user)

		defer func() {
			pubsub.UnregisterClient(&client)
		}()
		pubsub.RegisterClient(&client)
	})
}

func GetAvailableWebSocketSpaces(ctx *fiber.Ctx) error {
	return ctx.Status(fiber.StatusOK).
		JSON(utils.NewListResponseMessage(pubsub.GetRegisteredSpaceNames()))
}
