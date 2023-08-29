package pubsub

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2/log"
	"github.com/google/uuid"
	"net/url"
	"strings"
	"utr-api-v2/schemas"
	"utr-api-v2/utils"
)

type Client struct {
	ID            uuid.UUID
	User          *schemas.UserPublicData
	Connection    *websocket.Conn
	subscriptions map[string]struct{}
}

func (client *Client) listen() {
	for {
		// read message from the client
		_, msg, err := client.Connection.ReadMessage()
		if err != nil {
			if strings.Contains(err.Error(), "close 1000") {
				log.Infof("Websocket connection for client %s closed", client.ID.String())
			} else {
				client.whisperError("Failed to read message: " + err.Error())
			}

			break
		}

		log.Infof("Received WebSocket message: %s", msg)

		// parse client message
		payload, err := url.ParseQuery(string(msg))
		if err != nil {
			client.whisperError("Failed to parse client message: " + err.Error())
			continue
		}

		if !payload.Has("command") {
			client.whisperError("Missing command")
			continue
		}

		// handle subscription commands
		switch payload.Get("command") {
		case "subscribe":
			if payload.Has("space") {
				client.subscribe(payload.Get("space"))
			} else {
				client.whisperError("Missing Space")
			}

		case "unsubscribe":
			if payload.Has("space") {
				client.unsubscribe(payload.Get("space"))
			} else {
				client.whisperError("Missing Space")
			}
		default:
			client.whisperError("Unknown command: " + payload.Get("command"))
		}
	}
}

func (client *Client) subscribe(spaceName string) {
	spaceRoute, ids, err := deconstructSpaceName(spaceName)
	if err != nil {
		log.Warnf("Failed to deconstruct space name: %s", err.Error())
	}

	// clients can only subscribe to spaces with registered handlers
	space, exists := spaces[spaceRoute]
	if !exists {
		client.whisperError("Space does not exist")
		return
	}

	// non-admin users can only subscribe to the "live" spaceName
	if space.AccessLevelNeeded > client.User.AccessLevel {
		client.whisperError("Permission denied")
		return
	}

	// add spaceName to subscriptions
	if _, exists := client.subscriptions[spaceName]; !exists {
		message := space.handler(ids)

		client.subscriptions[spaceName] = struct{}{}
		client.whisper(&message)
	}
}

func (client *Client) unsubscribe(space string) {
	// remove Space from subscriptions
	if _, exists := client.subscriptions[space]; exists {
		delete(client.subscriptions, space)
		msg := utils.NewTextResponseMessage("Subscription removed: " + space)
		client.whisper(&msg)
	}
}

func (client *Client) isSubscribed(spaceName string) bool {
	_, exists := client.subscriptions[spaceName]
	return exists
}

func (client *Client) whisper(message *utils.ResponseMessage) {
	if err := client.Connection.WriteJSON(message); err != nil {
		log.Warnf("Failed to whisper message: %s", err.Error())
	}
}

func (client *Client) whisperError(errorMessage string) {
	log.Warn(errorMessage)
	client.whisper(&utils.ResponseMessage{
		Type:    utils.ResponseMessageTypeError,
		Content: errorMessage,
	})
}

func NewClient(conn *websocket.Conn, user *schemas.UserPublicData) Client {
	return Client{
		ID:            uuid.New(),
		User:          user,
		Connection:    conn,
		subscriptions: make(map[string]struct{}),
	}
}
