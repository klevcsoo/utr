package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"log"
	"utr-api-v2/controllers"
	"utr-api-v2/ini"
	"utr-api-v2/pubsub"
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

	app.Mount("/api/v2", api)
	app.Use(logger.New())
	api.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowMethods:     "GET, POST, PUT",
		AllowCredentials: true,
	}))

	registerRoutes(api)

	log.Fatal(app.Listen("localhost:8080"))
}

func registerRoutes(api *fiber.App) {
	api.Get("/health", func(ctx *fiber.Ctx) error {
		return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
			"status": "operational",
		})
	})

	api.Get("/pubsub/admin", security.AdminAccess, controllers.PubSubSocketController())

	api.Post("/auth/login",
		controllers.LogUserIn)
	api.Post("/auth/logout",
		controllers.LogUserOut)
	api.Get("/auth/users/me",
		security.AuthenticatedAccess, controllers.GetMe)
	api.Get("/auth/users/",
		security.AdminAccess, controllers.GetUserList)
	api.Put("/auth/users/",
		security.AdminAccess, controllers.CreateUser)
	api.Get("/auth/users/:id",
		security.AdminAccess, controllers.GetUser)
	api.Delete("/auth/users/:id",
		security.AdminAccess, controllers.DeleteUser)
	api.Patch("/auth/users/:id/password",
		security.AdminAccess, controllers.ChangePassword)
	api.Patch("/auth/users/:id/access-level",
		security.AdminAccess, controllers.ChangeAccessLevel)
	api.Patch("/auth/users/:id/display-name",
		security.AdminAccess, controllers.ChangeDisplayName)

	api.All("*", func(ctx *fiber.Ctx) error {
		return ctx.SendStatus(fiber.StatusNotFound)
	})
}
