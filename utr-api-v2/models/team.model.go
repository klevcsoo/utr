package models

import "utr-api-v2/utils"

type Team struct {
	utils.BaseModel
	Name string `json:"name" gorm:"type:text;not null;uniqueIndex"`
	City string `json:"city" gorm:"type:text"`
}

type TeamWithSwimmers struct {
	Team
	Swimmers *[]*Swimmer `json:"swimmers" gorm:"foreignKey:TeamID"`
}

func (Team) TableName() string {
	return "teams"
}

func (TeamWithSwimmers) TableName() string {
	return "teams"
}
