package models

type Start struct {
	HeatID  int    `json:"-" gorm:"not null;primaryKey;index;index:starting_list_heat_entry_index;index:starting_list_heat_lane_index"`
	Heat    *Heat  `json:"heat"`
	EntryID int    `json:"-" gorm:"not null;primaryKey;index:starting_list_heat_entry_index;uniqueIndex"`
	Entry   *Entry `json:"entry"`
	Lane    int    `json:"lane" gorm:"integer;not null;index:starting_list_heat_lane_index"`
}

func (Start) TableName() string {
	return "starting_list"
}
