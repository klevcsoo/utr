package pubsub

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2/log"
)

type Channel struct {
	connections *[]*websocket.Conn
}

func (channel *Channel) Whisper(message *Message, conn *websocket.Conn) {
	if err := conn.WriteJSON(message); err != nil {
		log.Warnf("Failed to write message: %s", err.Error())
	}
}

func (channel *Channel) Broadcast(message *Message) {
	for _, conn := range *channel.connections {
		channel.Whisper(message, conn)
	}
}

func (channel *Channel) Register(conn *websocket.Conn) {
	*channel.connections = append(*channel.connections, conn)
}

func (channel *Channel) Unregister(conn *websocket.Conn) {
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

var channels = make(map[string]*Channel)

func GetChannel(name string) *Channel {
	channel := channels[name]
	if channel == nil {
		channels[name] = &Channel{connections: &[]*websocket.Conn{}}
	}

	return channels[name]
}
