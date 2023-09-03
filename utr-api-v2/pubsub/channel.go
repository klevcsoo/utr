package pubsub

import (
	"github.com/gofiber/fiber/v2/log"
	"strconv"
	"strings"
	"utr-api-v2/utils"
)

type Channel struct {
	Name              string
	AccessLevelNeeded int
	handler           func(map[string]int) utils.ResponseMessage
}

var clients = make(map[string]Client)
var channels = make(map[string]Channel)

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

func RegisterChannel(
	name string, access int, handler func(IDs map[string]int) utils.ResponseMessage,
) {
	channel := Channel{
		Name:              name,
		AccessLevelNeeded: access,
		handler:           handler,
	}

	channels[channel.Name] = channel
}

func PublishUpdate(channelName string) {
	routeName, ids, err := deconstructChannelName(channelName)
	if err != nil {
		log.Warnf("failed to publish: invalid ID, %s", err.Error())
		return
	}

	channel, exists := channels[routeName]
	if !exists {
		log.Warnf("failed to publish: channel does not exist (%s)", routeName)
		return
	}

	message := channel.handler(ids)

	for _, client := range clients {
		if client.isSubscribed(channelName) {
			client.whisper(&message)
		}
	}

	log.Infof("Published update to channel : %s", routeName)
}

func GetRegisteredChannelNames() []string {
	var names []string
	for k := range channels {
		names = append(names, k)
	}
	return names
}

func deconstructChannelName(name string) (string, map[string]int, error) {
	slices := strings.Split(name, "/")
	ids := make(map[string]int)
	for i := 0; i < len(slices); i++ {
		if i%2 == 0 {
			ids[slices[i]] = -1
		} else if slices[i] == "" {
			ids[slices[i-1]] = -1
		} else {
			id, err := strconv.Atoi(slices[i])
			if err != nil {
				return "", nil, err
			}

			ids[slices[i-1]] = id
		}
	}

	route := name
	for k, v := range ids {
		oldPair := k + "/" + strconv.Itoa(v)
		newPair := k + "/?"
		route = strings.Replace(route, oldPair, newPair, -1)
	}

	return route, ids, nil
}

const (
	ChannelNameTeamList           = "team/"
	ChannelNameTeamDetails        = "team/?"
	ChannelNameSwimmerDetails     = "swimmer/"
	ChannelNameCompetitionList    = "competition/"
	ChannelNameCompetitionDetails = "competition/?"
	ChannelNameRaceDetails        = "race/?"
	ChannelNameEntryDetails       = "entry/?"
)
