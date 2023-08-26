package pubsub

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2/log"
	"github.com/google/uuid"
	"net/url"
	"strings"
	"utr-api-v2/schemas"
	"utr-api-v2/security"
)

type Client struct {
	ID            uuid.UUID
	User          *schemas.UserPublicData
	Connection    *websocket.Conn
	subscriptions map[string]struct{}
}

func NewClient(conn *websocket.Conn, user *schemas.UserPublicData) Client {
	return Client{
		ID:            uuid.New(),
		User:          user,
		Connection:    conn,
		subscriptions: make(map[string]struct{}),
	}
}

func (client *Client) listen() {
	for {
		// read message from the client
		_, msg, err := client.Connection.ReadMessage()
		if err != nil {
			if strings.Contains(err.Error(), "close 1000") {
				log.Infof("Websocket connection for client %s closed", client.ID.String())
			} else {
				client.WhisperError("Failed to read message: " + err.Error())
			}

			break
		}

		log.Infof("Received WebSocket message: %s", msg)

		// parse client message
		payload, err := url.ParseQuery(string(msg))
		if err != nil {
			client.WhisperError("Failed to parse client message: " + err.Error())
			continue
		}

		if !payload.Has("command") {
			continue
		}

		// handle subscription commands
		switch payload.Get("command") {
		case "subscribe":
			if payload.Has("channel") {
				client.subscribe(payload.Get("channel"))
			}

		case "unsubscribe":
			if payload.Has("channel") {
				client.unsubscribe(payload.Get("channel"))
			}
		default:
			client.WhisperError("Unknown command: " + payload.Get("command"))
		}
	}
}

func (client *Client) subscribe(channel string) {
	// clients can only subscribe to channels with registered handlers
	if !DoesChannelExist(channel) {
		client.WhisperError("Channel does not exist")
		return
	}

	// non-admin users can only subscribe to the "live" channel
	if channel != "live" && client.User.AccessLevel < security.AccessLevelAdmin {
		client.WhisperError("Permission denied")
		return
	}

	// add channel to subscriptions
	if _, exists := client.subscriptions[channel]; !exists {
		client.subscriptions[channel] = struct{}{}
		client.Whisper(&Message{
			Type:    MessageTypeText,
			Content: "Subscription added: " + channel,
		})
	}
}

func (client *Client) unsubscribe(channel string) {
	// remove channel from subscriptions
	if _, exists := client.subscriptions[channel]; exists {
		delete(client.subscriptions, channel)
		client.Whisper(&Message{
			Type:    MessageTypeText,
			Content: "Subscription removed: " + channel,
		})
	}
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
