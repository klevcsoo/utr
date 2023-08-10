package models

import (
	"github.com/google/uuid"
	"time"
	"utr-api-v2/schemas"
)

type User struct {
	ID          *uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primary_key"`
	Username    string     `gorm:"type:varchar(100);not null;uniqueIndex"`
	Password    string     `gorm:"type:varchar(100);not null"`
	AccessLevel int        `gorm:"not null;default:1"`
	CreatedAt   *time.Time `gorm:"not null;default:now()"`
	UpdatedAt   *time.Time `gorm:"not null;default:now()"`
}

func FilterUserRecord(user *User) schemas.UserPublicData {
	return schemas.UserPublicData{
		ID:          *user.ID,
		Username:    user.Username,
		AccessLevel: user.AccessLevel,
		CreatedAt:   *user.CreatedAt,
		UpdatedAt:   *user.UpdatedAt,
	}
}
