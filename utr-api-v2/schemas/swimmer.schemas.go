package schemas

type CreateSwimmerRequest struct {
	Team        int    `json:"team,omitempty" validate:"required"`
	Name        string `json:"name,omitempty" validate:"required"`
	YearOfBirth uint   `json:"year_of_birth,omitempty" validate:"required"`
	Sex         string `json:"sex,omitempty" validate:"required"`
}

type EditSwimmerRequest struct {
	Team        int    `json:"team,omitempty"`
	Name        string `json:"name,omitempty"`
	YearOfBirth uint   `json:"year_of_birth,omitempty"`
	Sex         string `json:"sex,omitempty"`
}