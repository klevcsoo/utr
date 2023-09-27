package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"log"
	"utr-api-v2/controllers"
	"utr-api-v2/ini"
	"utr-api-v2/pubsub"
	"utr-api-v2/schemas"
	"utr-api-v2/security"
	"utr-api-v2/utils"
)

func init() {
	config, err := ini.LoadConfig(".")
	if err != nil {
		log.Fatalln("Loading environment variables failed: " + err.Error())
	}
	ini.ConnectDB(&config)

	pubsub.CreateWebSocketChannels()
}

func main() {
	app := fiber.New()
	api := fiber.New()

	app.Use(logger.New())
	api.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000,https://utr.hu",
		AllowHeaders:     "Origin,Content-Type,Accept,Access-Control-Allow-Origin",
		AllowMethods:     "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		AllowCredentials: true,
	}))
	app.Mount("/api/v2", api)

	registerRoutes(api)

	log.Fatal(app.Listen("localhost:8080"))
}

func registerRoutes(api *fiber.App) {
	// health endpoint
	api.Get("/health", func(ctx *fiber.Ctx) error {
		return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
			"status": "operational",
		})
	})

	// WebSocket-related endpoints
	api.Get("/pubsub/channels",
		security.AuthenticatedAccess,
		controllers.GetAvailableWebSocketChannels)
	api.Get("/pubsub/admin",
		security.AdminAccess,
		controllers.PubSubSocketController())

	// resolve ID to object name endpoint
	api.Get("/resolve/:type/:id",
		security.AuthenticatedAccess,
		controllers.GetResolvedObjectName)

	// authentication endpoints
	api.Post("/auth/login",
		controllers.LogUserIn)
	api.Post("/auth/logout",
		controllers.LogUserOut)
	api.Get("/auth/users/me",
		security.AuthenticatedAccess,
		controllers.GetMe)
	api.Get("/auth/users/",
		security.AdminAccess,
		controllers.GetUserList)
	api.Put("/auth/users/",
		security.AdminAccess,
		controllers.CreateUser)
	api.Get("/auth/users/:id",
		security.AdminAccess,
		controllers.GetUser)
	api.Delete("/auth/users/:id",
		security.AdminAccess,
		controllers.DeleteUser)
	api.Patch("/auth/users/:id/password",
		security.AdminAccess,
		controllers.ChangePassword)
	api.Patch("/auth/users/:id/access-level",
		security.AdminAccess,
		controllers.ChangeAccessLevel)
	api.Patch("/auth/users/:id/display-name",
		security.AdminAccess,
		controllers.ChangeDisplayName)

	// competition, race and entry endpoints
	api.Get("/competitions/",
		security.AdminAccess,
		controllers.GetCompetitionList)
	api.Put("/competitions/",
		security.AdminAccess,
		utils.RequestBodyValidation(schemas.CreateCompetitionRequest{}),
		controllers.CreateCompetition)
	api.Get("/competitions/:id",
		security.AdminAccess,
		controllers.GetCompetitionDetails)
	api.Patch("/competitions/:id",
		security.AdminAccess,
		utils.RequestBodyValidation(schemas.EditCompetitionRequest{}),
		controllers.EditCompetitionDetails)
	api.Delete("/competitions/:id",
		security.AdminAccess,
		controllers.DeleteCompetition)
	api.Put("/competitions/:id/races/",
		security.AdminAccess,
		utils.RequestBodyValidation(schemas.CreateRaceRequest{}),
		controllers.CreateRace)
	api.Get("/competitions/:cid/races/:rid",
		security.AdminAccess,
		controllers.GetRaceDetails)
	api.Patch("/competitions/:cid/races/:rid",
		security.AdminAccess,
		utils.RequestBodyValidation(schemas.EditRaceRequest{}),
		controllers.EditRaceDetails)
	api.Delete("/competitions/:cid/races/:rid",
		security.AdminAccess,
		controllers.DeleteRace)
	api.Put("/competitions/:cid/races/:rid/entries/",
		security.AdminAccess,
		utils.RequestBodyValidation(schemas.CreateEntryRequest{}),
		controllers.CreateEntry)
	api.Get("/competitions/:cid/races/:rid/entries/:eid",
		security.AdminAccess,
		controllers.GetEntryDetails)
	api.Patch("/competitions/:cid/races/:rid/entries/:eid",
		security.AdminAccess,
		utils.RequestBodyValidation(schemas.EditEntryRequest{}),
		controllers.EditEntryDetails)
	api.Delete("/competitions/:cid/races/:rid/entries/:eid",
		security.AdminAccess,
		controllers.DeleteEntry)

	// team and swimmer endpoints
	api.Get("/teams/",
		security.AdminAccess,
		controllers.GetTeamList)
	api.Put("/teams/",
		security.AdminAccess,
		utils.RequestBodyValidation(schemas.CreateTeamRequest{}),
		controllers.CreateTeam)
	api.Get("/teams/:id",
		security.AdminAccess,
		controllers.GetTeamDetails)
	api.Patch("/teams/:id",
		security.AdminAccess,
		utils.RequestBodyValidation(schemas.EditTeamRequest{}),
		controllers.EditTeamDetails)
	api.Delete("/teams/:id",
		security.AdminAccess,
		controllers.DeleteTeam)
	api.Put("/teams/:id/swimmers/",
		security.AdminAccess,
		utils.RequestBodyValidation(schemas.CreateSwimmerRequest{}),
		controllers.CreateSwimmer)
	api.Get("/teams/:tid/swimmers/:sid",
		security.AdminAccess,
		controllers.GetSwimmerDetails)
	api.Patch("/teams/:tid/swimmers/:sid",
		security.AdminAccess,
		utils.RequestBodyValidation(schemas.EditSwimmerRequest{}),
		controllers.EditSwimmerDetails)
	api.Delete("/teams/:tid/swimmers/:sid",
		security.AdminAccess,
		controllers.DeleteSwimmer)

	// support endpoints
	api.Get("/support/env",
		security.AdminAccess,
		controllers.GetEnvironmentVariables)

	// Not-Found endpoint
	api.All("*", controllers.NotFoundController)
}
