package models

import (
	"github.com/jackc/pgx/v5/pgtype"
	"utr-api-v2/utils"
)

type Entry struct {
	utils.BaseModel
	SwimmerID  int              `json:"-" gorm:"uniqueIndex:entry_swimmer_race_index"`
	Swimmer    *Swimmer         `json:"swimmer"`
	RaceID     int              `json:"-" gorm:"not null;uniqueIndex:entry_swimmer_race_index"`
	Race       *Race            `json:"race"`
	Present    bool             `json:"present" gorm:"type:boolean;default:true;not null"`
	EntryTime  *pgtype.Interval `json:"entryTime" gorm:"type:interval"`
	TimeResult *pgtype.Interval `json:"timeResult" gorm:"type:interval;index"`
}
