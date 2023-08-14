package utils

import (
	"time"
)

type BaseModel struct {
	ID        uint       `gorm:"primaryKey"`
	CreatedAt *time.Time `gorm:"not null;default:now()"`
	UpdatedAt *time.Time `gorm:"not null;default:now()"`
}
