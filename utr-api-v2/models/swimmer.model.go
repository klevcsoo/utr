package models

import (
	"utr-api-v2/schemas"
	"utr-api-v2/utils"
)

type Swimmer struct {
	utils.BaseModel
	Name        string `json:"name" gorm:"type:text;not null;index"`
	TeamID      int    `json:"-" gorm:"not null"`
	SexID       string `json:"-"`
	Sex         *Sex   `json:"sex"`
	YearOfBirth uint   `json:"yearOfBirth" gorm:"type:integer;not null"`
}

func NewSwimmer(teamID int, request schemas.CreateSwimmerRequest) Swimmer {
	return Swimmer{
		TeamID:      teamID,
		Name:        request.Name,
		YearOfBirth: request.YearOfBirth,
		SexID:       request.Sex,
	}
}
