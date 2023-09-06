package schemas

type CreateEntryRequest struct {
	Swimmer   *int `json:"swimmer,omitempty" validate:"required"`
	EntryTime *int `json:"entryTime,omitempty"`
}

type EditEntryRequest struct {
	EntryTime  *int  `json:"entryTime,omitempty"`
	TimeResult *int  `json:"timeResult,omitempty"`
	Present    *bool `json:"present,omitempty"`
}
