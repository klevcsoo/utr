package pubsub

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2/log"
	"net/url"
)

type Client struct {
	Connection *websocket.Conn
}

func (client *Client) Whisper(message *Message) {
	if err := client.Connection.WriteJSON(message); err != nil {
		log.Warnf("Failed to whisper message: %s", err.Error())
	}
}

func (client *Client) WhisperError(errorMessage string) {
	log.Warn(errorMessage)
	client.Whisper(&Message{
		Type:    MessageTypeError,
		Content: errorMessage,
	})
}

func (client *Client) OnMessage(callback func(payload url.Values)) {
	for {
		// read message from the client
		_, msg, err := client.Connection.ReadMessage()
		if err != nil {
			client.WhisperError("Failed to read message: " + err.Error())
			break
		}

		log.Infof("Received WebSocket message: %s", msg)

		// parse client message
		payload, err := url.ParseQuery(string(msg))
		if err != nil {
			client.WhisperError("Failed to parse client message: " + err.Error())
			continue
		}

		callback(payload)
	}
}

func NewClient(conn *websocket.Conn) Client {
	return Client{Connection: conn}
}
