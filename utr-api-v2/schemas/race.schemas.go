package schemas

type CreateRaceRequest struct {
	Length        int    `json:"length,omitempty" validate:"required"`
	SwimmingStyle string `json:"swimming_style,omitempty" validate:"required"`
	RelayEnabled  bool   `json:"relayEnabled,omitempty" validate:"required"`
	Relay         int    `json:"relay,omitempty"`
}

type EditRaceRequest struct {
	Length        int    `json:"length,omitempty"`
	SwimmingStyle string `json:"swimming_style,omitempty"`
	RelayEnabled  bool   `json:"relayEnabled,omitempty"`
	Relay         int    `json:"relay,omitempty"`
}
