package models

import (
	"time"
	"utr-api-v2/schemas"
	"utr-api-v2/utils"
)

type Entry struct {
	utils.BaseModel
	SwimmerID  int           `json:"-" gorm:"uniqueIndex:entry_swimmer_race_index"`
	Swimmer    *Swimmer      `json:"swimmer"`
	RaceID     int           `json:"-" gorm:"not null;uniqueIndex:entry_swimmer_race_index"`
	Race       *Race         `json:"race"`
	Present    bool          `json:"present" gorm:"type:boolean;default:true;not null"`
	EntryTime  time.Duration `json:"entryTime" gorm:"type:bigint"`
	TimeResult time.Duration `json:"timeResult" gorm:"type:bigint;index"`
}

func NewEntry(raceID int, request schemas.CreateEntryRequest) Entry {
	return Entry{
		RaceID:    raceID,
		SwimmerID: request.Swimmer,
		EntryTime: time.Duration(request.EntryTime),
		Present:   true,
	}
}
