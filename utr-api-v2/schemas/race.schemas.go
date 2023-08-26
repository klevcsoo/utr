package schemas

type CreateRaceRequest struct {
	Competition   int    `json:"competition,omitempty" validate:"required"`
	Length        int    `json:"length,omitempty" validate:"required"`
	SwimmingStyle string `json:"swimming_style,omitempty" validate:"required"`
	Relay         int    `json:"relay,omitempty"`
}

type EditRaceRequest struct {
	Length        int    `json:"length,omitempty" validate:"required"`
	SwimmingStyle string `json:"swimming_style,omitempty" validate:"required"`
	Relay         int    `json:"relay,omitempty"`
}
