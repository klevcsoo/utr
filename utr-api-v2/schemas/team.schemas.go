package schemas

type CreateTeamRequest struct {
	Name     string `json:"name,omitempty" validate:"required"`
	Location string `json:"location,omitempty" validate:"required"`
}

type EditTeamRequest struct {
	Name     string `json:"name,omitempty"`
	Location string `json:"location,omitempty"`
}
