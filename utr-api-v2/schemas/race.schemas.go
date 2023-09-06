package schemas

type CreateRaceRequest struct {
	Length        *int    `json:"length,omitempty" validate:"required"`
	SwimmingStyle *string `json:"swimmingStyle,omitempty" validate:"required"`
	Relay         *int    `json:"relay,omitempty"`
}

type EditRaceRequest struct {
	Length        *int    `json:"length,omitempty"`
	SwimmingStyle *string `json:"swimmingStyle,omitempty"`
	Relay         *int    `json:"relay,omitempty"`
}
