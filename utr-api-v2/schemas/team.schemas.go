package schemas

type CreateTeamRequest struct {
	Name string `json:"name,omitempty" validate:"required"`
	City string `json:"city,omitempty" validate:"required"`
}

type EditTeamRequest struct {
	Name string `json:"name,omitempty"`
	City string `json:"city,omitempty"`
}
