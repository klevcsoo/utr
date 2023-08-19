package pubsub

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"strings"
)

type SocketController func(channel *Channel, conn *websocket.Conn)

func NewSocketHandler(controller SocketController) fiber.Handler {
	return websocket.New(func(conn *websocket.Conn) {
		// resolve channel
		path := conn.Locals("requestPath").(string)
		chName := strings.Replace(path, "/api/v2/", "", -1)
		channel := GetChannel(chName)

		// handle register & unregister
		defer func() {
			channel.unregister(conn)
		}()
		channel.register(conn)

		// call controller function
		controller(channel, conn)
	}, websocket.Config{Filter: func(ctx *fiber.Ctx) bool {
		ctx.Locals("requestPath", ctx.Path())
		return true
	}})
}
