package pubsub

import (
	"github.com/gofiber/fiber/v2/log"
	"strconv"
	"strings"
	"utr-api-v2/utils"
)

type Space struct {
	Name              string
	AccessLevelNeeded int
	handler           func(map[string]int) utils.ResponseMessage
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
	name string, access int, handler func(IDs map[string]int) utils.ResponseMessage,
) {
	space := Space{
		Name:              name,
		AccessLevelNeeded: access,
		handler:           handler,
	}

	spaces[space.Name] = space
}

func PublishUpdate(spaceName string) {
	routeName, ids, err := deconstructSpaceName(spaceName)
	if err != nil {
		log.Warnf("failed to publish: invalid ID, %s", err.Error())
		return
	}

	space, exists := spaces[routeName]
	if !exists {
		log.Warnf("failed to publish: Space does not exist (%s)", routeName)
		return
	}

	message := space.handler(ids)

	for _, client := range clients {
		if client.isSubscribed(spaceName) {
			client.whisper(&message)
		}
	}

	log.Infof("Published update to Space : %s", routeName)
}

func GetRegisteredSpaceNames() []string {
	var names []string
	for k := range spaces {
		names = append(names, k)
	}
	return names
}

func deconstructSpaceName(name string) (string, map[string]int, error) {
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

	spaceRoute := name
	for k, v := range ids {
		oldPair := k + "/" + strconv.Itoa(v)
		newPair := k + "/?"
		spaceRoute = strings.Replace(spaceRoute, oldPair, newPair, -1)
	}

	return spaceRoute, ids, nil
}

const (
	SpaceNameTeamList           = "team/"
	SpaceNameTeamDetails        = "team/?"
	SpaceNameSwimmerDetails     = "swimmer/"
	SpaceNameCompetitionList    = "competition/"
	SpaceNameCompetitionDetails = "competition/?"
	SpaceNameRaceDetails        = "race/?"
)
