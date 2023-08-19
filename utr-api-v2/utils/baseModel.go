package utils

import (
	"time"
)

type BaseModel struct {
	ID        uint       `gorm:"primaryKey" json:"id,omitempty"`
	CreatedAt *time.Time `gorm:"not null;default:now()" json:"createdAt,omitempty"`
	UpdatedAt *time.Time `gorm:"not null;default:now()" json:"updatedAt,omitempty"`
}
