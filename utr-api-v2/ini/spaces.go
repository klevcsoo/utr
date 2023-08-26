package ini

import (
	"utr-api-v2/models"
	"utr-api-v2/pubsub"
	"utr-api-v2/security"
)

func CreateWebSocketSpaces() {
	const admin = security.AccessLevelAdmin

	// competition list
	pubsub.RegisterSpace("competitions/", admin,
		func(IDs map[string]int) pubsub.Message {
			var competitions []models.Competition
			err := DB.Find(&competitions).Error
			if err != nil {
				return pubsub.Message{
					Type:    pubsub.MessageTypeError,
					Content: err.Error(),
				}
			} else {
				return pubsub.Message{
					Type:    pubsub.MessageTypeList,
					Content: competitions,
				}
			}
		})

	// competition details
	pubsub.RegisterSpace("competitions/?", admin,
		func(IDs map[string]int) pubsub.Message {
			id := IDs["competitions"]

			var competition models.Competition
			err := DB.
				Preload("Races").
				Preload("Races.SwimmingStyle").
				Where("id = ?", id).
				First(&competition).Error

			if err != nil {
				return pubsub.Message{
					Type:    pubsub.MessageTypeError,
					Content: err.Error(),
				}
			} else {
				return pubsub.Message{
					Type:    pubsub.MessageTypeObject,
					Content: competition,
				}
			}
		})

	// race details
	pubsub.RegisterSpace("races/?", admin,
		func(IDs map[string]int) pubsub.Message {
			id := IDs["races"]

			var race models.Race
			err := DB.
				Joins("Competition").Joins("SwimmingStyle").Joins("Entries").
				Where("\"races\".\"id\" = ?", id).First(&race).
				Error

			if err != nil {
				return pubsub.Message{
					Type:    pubsub.MessageTypeError,
					Content: err.Error(),
				}
			} else {
				return pubsub.Message{
					Type:    pubsub.MessageTypeObject,
					Content: race,
				}
			}
		})

	// team list
	pubsub.RegisterSpace("teams/", admin,
		func(IDs map[string]int) pubsub.Message {
			var teams []models.Team
			err := DB.Find(&teams).Error
			if err != nil {
				return pubsub.Message{
					Type:    pubsub.MessageTypeError,
					Content: err.Error(),
				}
			} else {
				return pubsub.Message{
					Type:    pubsub.MessageTypeList,
					Content: teams,
				}
			}
		})

	// team details
	pubsub.RegisterSpace("teams/?", admin,
		func(IDs map[string]int) pubsub.Message {
			id := IDs["teams"]

			var team models.Team
			DB.Preload("Swimmers").Preload("Swimmers.Sex").First(&team, id)
			return pubsub.Message{
				Type:    pubsub.MessageTypeObject,
				Content: team,
			}
		})

	// swimmer details
	pubsub.RegisterSpace("swimmers/?", admin,
		func(IDs map[string]int) pubsub.Message {
			id := IDs["swimmers"]

			var swimmer models.Swimmer
			err := DB.Joins("Sex").First(&swimmer, id).Error

			if err != nil {
				return pubsub.Message{
					Type:    pubsub.MessageTypeError,
					Content: err.Error(),
				}
			} else {
				return pubsub.Message{
					Type:    pubsub.MessageTypeObject,
					Content: swimmer,
				}
			}
		})
}
