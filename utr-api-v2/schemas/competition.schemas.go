package schemas

import "gorm.io/datatypes"

type CreateCompetitionRequest struct {
	Name     string         `json:"name,omitempty" validate:"required"`
	Location string         `json:"location,omitempty"`
	Date     datatypes.Date `json:"date" validate:"required"`
}

type EditCompetitionRequest struct {
	Name     string         `json:"name,omitempty"`
	Location string         `json:"location,omitempty"`
	Date     datatypes.Date `json:"date"`
}
