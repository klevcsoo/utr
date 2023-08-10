package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"log"
	"utr-api-v2/controllers"
	"utr-api-v2/ini"
	"utr-api-v2/security"
)

func init() {
	config, err := ini.LoadConfig(".")
	if err != nil {
		log.Fatalln("Loading environment variables failed: " + err.Error())
	}
	ini.ConnectDB(&config)
}

func main() {
	app := fiber.New()
	api := fiber.New()

	app.Mount("/api", api)
	app.Use(logger.New())
	api.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowMethods:     "GET, POST, PUT",
		AllowCredentials: true,
	}))

	api.Route("/auth", func(router fiber.Router) {
		router.Put("/users/", security.AdminAccess, controllers.CreateNewUser)
		router.Post("/login", controllers.LogUserIn)
		router.Post("/logout", controllers.LogUserOut)
	})

	api.Get("/health", func(ctx *fiber.Ctx) error {
		return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
			"status": "operational",
		})
	})

	api.All("*", func(ctx *fiber.Ctx) error {
		return ctx.SendStatus(fiber.StatusNotFound)
	})

	log.Fatal(app.Listen(":8080"))
}
