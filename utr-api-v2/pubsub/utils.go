package pubsub

import (
	"github.com/gofiber/fiber/v2/log"
	"net/url"
)

func ParseClientMessage(message []byte) *url.Values {
	payload, err := url.ParseQuery(string(message))
	if err != nil {
		log.Warnf("Failed to parse client message: %s", err.Error())
	}

	return &payload
}
