package models

import "utr-api-v2/utils"

type Heat struct {
	utils.BaseModel
	RaceID  int    `json:"-"  gorm:"not null"`
	Race    *Race  `json:"race"`
	EntryID int    `json:"-" gorm:"not null"`
	Entry   *Entry `json:"entry"`
}

type HeatWithStarts struct {
	Heat
	Starts *[]*Start `json:"starts" gorm:"foreignKey:HeatID"`
}

func (Heat) TableName() string {
	return "heats"
}

func (HeatWithStarts) TableName() string {
	return "heats"
}
