package pubsub

import (
	"strings"
	"utr-api-v2/ini"
	"utr-api-v2/models"
	"utr-api-v2/security"
	"utr-api-v2/utils"
)

func CreateWebSocketChannels() {
	const admin = security.AccessLevelAdmin

	// competition list
	RegisterChannel(ChannelNameCompetitionList, admin,
		func(IDs map[string]int) utils.ResponseMessage {
			var competitions []models.Competition
			err := ini.DB.Find(&competitions).Error
			if err != nil {
				return utils.NewErrorResponseMessage(err.Error())
			} else {
				return utils.NewListResponseMessage(competitions)
			}
		})

	// competition details
	RegisterChannel(ChannelNameCompetitionDetails, admin,
		func(IDs map[string]int) utils.ResponseMessage {
			id := IDs[strings.Split(ChannelNameCompetitionDetails, "/")[0]]

			var competition models.Competition
			err := ini.DB.
				Preload("Races").
				Preload("Races.SwimmingStyle").
				Where("id = ?", id).
				First(&competition).Error

			if err != nil {
				return utils.NewErrorResponseMessage(err.Error())

			} else {
				return utils.NewObjectResponseMessage(competition)
			}
		})

	// race details
	RegisterChannel(ChannelNameRaceDetails, admin,
		func(IDs map[string]int) utils.ResponseMessage {
			id := IDs[strings.Split(ChannelNameRaceDetails, "/")[0]]

			var race models.Race
			err := ini.DB.
				Joins("Competition").Joins("SwimmingStyle").Joins("Entries").
				Where("\"races\".\"id\" = ?", id).First(&race).
				Error

			if err != nil {
				return utils.NewErrorResponseMessage(err.Error())
			} else {
				return utils.NewObjectResponseMessage(race)
			}
		})

	// team list
	RegisterChannel(ChannelNameTeamList, admin,
		func(IDs map[string]int) utils.ResponseMessage {
			var teams []models.Team
			err := ini.DB.Find(&teams).Error
			if err != nil {
				return utils.NewErrorResponseMessage(err.Error())
			} else {
				return utils.NewListResponseMessage(teams)
			}
		})

	// team details
	RegisterChannel(ChannelNameTeamDetails, admin,
		func(IDs map[string]int) utils.ResponseMessage {
			id := IDs[strings.Split(ChannelNameTeamDetails, "/")[0]]

			var team models.Team
			err := ini.DB.
				Preload("Swimmers").Preload("Swimmers.Sex").
				First(&team, id).Error

			if err != nil {
				return utils.NewErrorResponseMessage(err.Error())
			} else {
				return utils.NewObjectResponseMessage(team)
			}
		})

	// swimmer details
	RegisterChannel(ChannelNameSwimmerDetails, admin,
		func(IDs map[string]int) utils.ResponseMessage {
			id := IDs[strings.Split(ChannelNameSwimmerDetails, "/")[0]]

			var swimmer models.Swimmer
			err := ini.DB.Joins("Sex").First(&swimmer, id).Error

			if err != nil {
				return utils.NewErrorResponseMessage(err.Error())
			} else {
				return utils.NewObjectResponseMessage(swimmer)
			}
		})
}
