package schemas

type CreateCompetitionRequest struct {
	Name     string `json:"name,omitempty" validate:"required"`
	Location string `json:"location,omitempty"`
	Date     string `json:"date,omitempty" validate:"required"`
}

type EditCompetitionRequest struct {
	Name     string `json:"name,omitempty"`
	Location string `json:"location,omitempty"`
	Date     string `json:"date,omitempty"`
}
