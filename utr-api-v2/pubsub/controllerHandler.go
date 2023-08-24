package pubsub

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"strings"
)

type SocketController func(channel *Channel, client *Client)

func NewSocketHandler(controller SocketController) fiber.Handler {
	return websocket.New(func(conn *websocket.Conn) {
		// resolve channel
		path := conn.Locals("requestPath").(string)
		chName := strings.Replace(path, "/api/v2/", "", -1)
		channel := GetChannel(chName)

		// create client
		client := NewClient(conn)

		// handle register & unregister
		defer func() {
			channel.unregister(&client)
		}()
		channel.register(&client)

		// call controller function
		controller(channel, &client)
	}, websocket.Config{Filter: func(ctx *fiber.Ctx) bool {
		ctx.Locals("requestPath", ctx.Path())
		return true
	}})
}
