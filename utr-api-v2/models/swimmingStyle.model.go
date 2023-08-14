package models

type SwimmingStyle struct {
	ID string `json:"id" gorm:"type:text;not null;primaryKey"`
}
