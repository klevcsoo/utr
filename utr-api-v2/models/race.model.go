package models

import (
	"utr-api-v2/schemas"
	"utr-api-v2/utils"
)

type Race struct {
	utils.BaseModel
	CompetitionID   int            `json:"-" gorm:"not null"`
	Competition     *Competition   `json:"competition"`
	Length          int            `json:"length" gorm:"type:smallint;not null"`
	SwimmingStyleID string         `json:"-" gorm:"not null"`
	SwimmingStyle   *SwimmingStyle `json:"swimmingStyle"`
	Relay           int            `json:"relay" gorm:"type:smallint"`
	Entries         *[]*Entry      `json:"entries" gorm:"foreignKey:RaceID"`
}

func NewRace(competitionID int, request schemas.CreateRaceRequest) Race {
	race := Race{
		CompetitionID:   competitionID,
		Length:          request.Length,
		SwimmingStyleID: request.SwimmingStyle,
	}

	if request.RelayEnabled {
		race.Relay = request.Relay
	}

	return race
}
