package pubsub

import (
	"github.com/gofiber/fiber/v2/log"
	"strconv"
	"strings"
)

type Space struct {
	Name              string
	AccessLevelNeeded int
	handler           func(map[string]int) Message
}

var clients = make(map[string]Client)
var spaces = make(map[string]Space)

func RegisterClient(client *Client) {
	clients[client.ID.String()] = *client
	client.listen()
}

func UnregisterClient(client *Client) {
	id := client.ID.String()
	if _, exists := clients[id]; exists {
		delete(clients, id)
	}
}

func RegisterSpace(
	name string, access int, handler func(IDs map[string]int) Message,
) {
	space := Space{
		Name:              name,
		AccessLevelNeeded: access,
		handler:           handler,
	}

	spaces[space.Name] = space
}

func PublishUpdate(spaceName string) {
	slices := strings.Split(spaceName, "/")
	ids := make(map[string]int)
	for i := 0; i < len(slices); i++ {
		if i%2 == 0 {
			ids[slices[i]] = -1
		} else {
			id, err := strconv.Atoi(slices[i])
			if err != nil {
				log.Warnf("Failed to publish: invalid ID, %s", err.Error())
				return
			}

			ids[slices[i-1]] = id
		}
	}

	routeName := spaceName
	for k, v := range ids {
		routeName = strings.Replace(routeName, k+"/"+string(rune(v)), k+"/?", -1)
	}

	space, exists := spaces[routeName]
	if !exists {
		log.Warnf("Failed to publish: channel does not exist (%s)", routeName)
	}

	message := space.handler(ids)

	for _, client := range clients {
		if client.isSubscribed(spaceName) {
			client.Whisper(&message)
		}
	}
}
