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

	registerRoutes(app)

	log.Fatal(app.Listen(":8080"))
}

func registerRoutes(app *fiber.App) {
	app.Route("/auth", func(router fiber.Router) {
		router.Post("/login", controllers.AuthLogUserIn)
		router.Post("/logout", controllers.AuthLogUserOut)

		router.Route("/users", func(router fiber.Router) {
			router.Get("/", security.AdminAccess, controllers.AuthGetAllUsers)
			router.Put("/", security.AdminAccess, controllers.AuthCreateNewUser)

			router.Get("/:id", security.AdminAccess, controllers.AuthGetUser)
			router.Delete("/:id", security.AdminAccess, controllers.AuthDeleteUser)

			router.Patch("/:id/password", security.AdminAccess,
				controllers.AuthChangeUserPassword)
			router.Patch("/:id/access-level", security.AdminAccess,
				controllers.AuthChangeUserAccessLevel)
			router.Patch("/:id/display-name", security.AdminAccess,
				controllers.AuthChangeUserDisplayName)
		})
	})

	app.Get("/health", func(ctx *fiber.Ctx) error {
		return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
			"status": "operational",
		})
	})

	app.All("*", func(ctx *fiber.Ctx) error {
		return ctx.SendStatus(fiber.StatusNotFound)
	})
}
