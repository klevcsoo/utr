package models

import (
	"github.com/jackc/pgx/v5/pgtype"
	"utr-api-v2/utils"
)

type Competition struct {
	utils.BaseModel
	Name     string       `json:"name" gorm:"type:text;not null;index"`
	Location string       `json:"location" gorm:"type:text"`
	Date     *pgtype.Date `json:"date" gorm:"type:date"`
	Open     bool         `json:"open" gorm:"type:boolean;default:false;not null;uniqueIndex:,where:open = true"`
}

type CompetitionWithRaces struct {
	Competition
	Races *[]*Race `json:"races" gorm:"foreignKey:CompetitionID"`
}

func (Competition) TableName() string {
	return "competitions"
}

func (CompetitionWithRaces) TableName() string {
	return "competitions"
}
