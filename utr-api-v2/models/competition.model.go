package models

import (
	"time"
	"utr-api-v2/schemas"
	"utr-api-v2/utils"
)

type Competition struct {
	utils.BaseModel
	Name     string    `json:"name" gorm:"type:text;not null;index"`
	Location string    `json:"location" gorm:"type:text"`
	Date     time.Time `json:"date" gorm:"type:date"`
	Open     bool      `json:"open" gorm:"type:boolean;default:false;not null;uniqueIndex:,where:open = true"`
	Races    *[]*Race  `json:"races" gorm:"foreignKey:CompetitionID"`
}

func NewCompetition(request schemas.CreateCompetitionRequest) Competition {
	date, _ := time.Parse(time.DateOnly, *request.Date)

	return Competition{
		Name:     *request.Name,
		Location: *request.Location,
		Date:     date,
	}
}
