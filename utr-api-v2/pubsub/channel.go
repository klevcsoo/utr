package pubsub

import (
	"github.com/gofiber/fiber/v2/log"
)

type Channel struct {
	clients []*Client
}

func (channel *Channel) Broadcast(message *Message) {
	for _, client := range channel.clients {
		client.Whisper(message)
	}
}

func (channel *Channel) register(client *Client) {
	channel.clients = append(channel.clients, client)
}

func (channel *Channel) unregister(client *Client) {
	for i, c := range channel.clients {
		if c == client {
			channel.clients = append(
				(channel.clients)[:i],
				(channel.clients)[i+1:]...,
			)
		}
	}

	if err := client.Connection.Close(); err != nil {
		log.Warnf("Failed to close connection: %s", err.Error())
	}
}

var channels = make(map[string]*Channel)

func GetChannel(name string) *Channel {
	channel := channels[name]
	if channel == nil {
		channels[name] = &Channel{
			clients: make([]*Client, 0),
		}
	}

	return channels[name]
}

func PublishUpdateOnChannel(channel string) {
	message, err := getChannelUpdateMessage(channel)
	if err != nil {
		log.Warnf("Failed to publish on channel: %s", err.Error())
		return
	}

	for _, client := range clients {
		if _, subscribed := client.subscriptions[channel]; subscribed {
			client.Whisper(message)
		}
	}
}
