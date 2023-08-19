package ini

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
	"utr-api-v2/models"
)

var DB *gorm.DB

func ConnectDB(config *Config) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Europe/Budapest",
		config.DBHost, config.DBUser, config.DBPass, config.DBName, config.DBPort,
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Connection to database failed: \n", err.Error())
	}

	DB.Exec(`create extension if not exists "uuid-ossp"`)
	DB.Logger = logger.Default.LogMode(logger.Info)

	runMigrations()

	log.Println("Database connection successful.")
}

func runMigrations() {
	log.Println("Running migration...")

	err := DB.AutoMigrate(
		&models.User{},
		&models.Competition{},
		&models.Entry{},
		&models.Heat{},
		&models.Race{},
		&models.Sex{},
		&models.Start{},
		&models.Swimmer{},
		&models.SwimmingStyle{},
		&models.Team{},
	)

	if err != nil {
		log.Fatal("Migration failed: ", err.Error())
	} else {
		log.Print("Migration done")
	}
}
