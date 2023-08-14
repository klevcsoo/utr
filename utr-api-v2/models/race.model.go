package models

import "utr-api-v2/utils"

type Race struct {
	utils.BaseModel
	CompetitionID   int            `json:"-" gorm:"not null"`
	Competition     *Competition   `json:"competition"`
	Length          int            `json:"length" gorm:"type:smallint;not null"`
	SwimmingStyleID int            `json:"-" gorm:"not null"`
	SwimmingStyle   *SwimmingStyle `json:"swimmingStyle"`
	Relay           int            `json:"relay" gorm:"type:smallint"`
}