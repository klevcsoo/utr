package main

import (
	"github.com/gofiber/contrib/websocket"
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

	api.Post("/auth/login", controllers.AuthLogUserIn)
	api.Post("/auth/logout", controllers.AuthLogUserOut)
	api.Get("/auth/users/", security.AdminAccess, controllers.AuthGetAllUsers)
	api.Put("/auth/users/", security.AdminAccess, controllers.AuthCreateNewUser)
	api.Get("/auth/users/:id", security.AdminAccess, controllers.AuthGetUser)
	api.Delete("/auth/users/:id", security.AdminAccess, controllers.AuthDeleteUser)
	api.Patch("/auth/users/:id/password", security.AdminAccess, controllers.AuthChangeUserPassword)
	api.Patch("/auth/users/:id/access-level", security.AdminAccess, controllers.AuthChangeUserAccessLevel)
	api.Patch("/auth/users/:id/display-name", security.AdminAccess, controllers.AuthChangeUserDisplayName)

	api.Get("/teams/", security.AdminAccess, websocket.New(controllers.AllTeamsSocket))
	api.Get("/teams/:id", security.AdminAccess, websocket.New(controllers.TeamDetailsSocket))

	api.All("*", func(ctx *fiber.Ctx) error {
		return ctx.SendStatus(fiber.StatusNotFound)
	})
}
