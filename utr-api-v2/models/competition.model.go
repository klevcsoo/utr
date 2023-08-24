package models

import (
	"gorm.io/datatypes"
	"utr-api-v2/utils"
)

type Competition struct {
	utils.BaseModel
	Name     string         `json:"name" gorm:"type:text;not null;index"`
	Location string         `json:"location" gorm:"type:text"`
	Date     datatypes.Date `json:"date" gorm:"type:date"`
	Open     bool           `json:"open" gorm:"type:boolean;default:false;not null;uniqueIndex:,where:open = true"`
	Races    *[]*Race       `json:"races" gorm:"foreignKey:CompetitionID"`
}
