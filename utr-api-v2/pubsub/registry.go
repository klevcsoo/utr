package pubsub

import (
	"errors"
	"fmt"
)

var clients = make(map[string]*Client)
var channelHandlers map[string]func() *Message

func RegisterClient(client *Client) {
	clients[client.ID.String()] = client
	client.listen()
}

func UnregisterClient(client *Client) {
	id := client.ID.String()

	if _, exists := clients[id]; exists {
		delete(clients, id)
	}
}

func DoesChannelExist(channel string) bool {
	_, exists := channelHandlers[channel]
	return exists
}

func CreateChannel(channel string, handler func() *Message) {
	channelHandlers[channel] = handler
}

func getChannelUpdateMessage(channel string) (*Message, error) {
	handler, exists := channelHandlers[channel]
	if !exists {
		msg := fmt.Sprintf("Handler for channel \"%s\" does not exist", channel)
		return nil, errors.New(msg)
	}

	return handler(), nil
}
