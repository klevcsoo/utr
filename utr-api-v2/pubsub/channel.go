package pubsub

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2/log"
	"net/url"
)

type Channel struct {
	connections *[]*websocket.Conn
}

func (channel *Channel) Broadcast(message *Message) {
	for _, conn := range *channel.connections {
		Whisper(conn, message)
	}
}

func (channel *Channel) register(conn *websocket.Conn) {
	*channel.connections = append(*channel.connections, conn)
}

func (channel *Channel) unregister(conn *websocket.Conn) {
	for i, c := range *channel.connections {
		if c == conn {
			*channel.connections = append(
				(*channel.connections)[:i],
				(*channel.connections)[i+1:]...,
			)
		}
	}

	if err := conn.Close(); err != nil {
		log.Warnf("Failed to close connection: %s", err.Error())
	}
}

func Whisper(conn *websocket.Conn, message *Message) {
	if err := conn.WriteJSON(message); err != nil {
		log.Warnf("Failed to whisper message: %s", err.Error())
	}
}

func OnClientMessage(conn *websocket.Conn, callback func(payload url.Values)) {
	sendError := func(err error) {
		Whisper(conn, &Message{
			Type:    MessageTypeError,
			Content: err.Error(),
		})
	}

	for {
		// read message from the client
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Warnf("Failed to read message: %s", err.Error())
			sendError(err)
			break
		}
		log.Infof("Received WebSocket message: %s", msg)

		// parse client message
		payload, err := url.ParseQuery(string(msg))
		if err != nil {
			log.Warnf("Failed to parse client message: %s", err.Error())
			sendError(err)
			continue
		}

		callback(payload)
	}
}

var channels = make(map[string]*Channel)

func GetChannel(name string) *Channel {
	channel := channels[name]
	if channel == nil {
		channels[name] = &Channel{
			connections: &[]*websocket.Conn{},
		}
	}

	return channels[name]
}
