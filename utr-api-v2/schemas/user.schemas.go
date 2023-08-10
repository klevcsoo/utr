package schemas

import (
	"github.com/google/uuid"
	"time"
)

type NewUserRequest struct {
	Username    string `json:"username" validate:"required"`
	DisplayName string `json:"displayName" validate:"required"`
	Password    string `json:"password" validate:"required,min=8"`
	AccessLevel int    `json:"accessLevel" validate:"required"`
}

type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type UserPublicData struct {
	ID          uuid.UUID `json:"id,omitempty"`
	Username    string    `json:"name,omitempty"`
	DisplayName string    `json:"displayName"`
	AccessLevel int       `json:"accessLevel"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
