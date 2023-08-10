package security

import "github.com/gofiber/fiber/v2"

const (
	AccessLevelSpeaker = 1 << iota
	AccessLevelIdorogzito
	AccessLevelAllitobiro
	AccessLevelAdmin
)

func AdminAccess(ctx *fiber.Ctx) error {
	return deserializeUser(ctx, AccessLevelAdmin)
}

func AllitobiroAccess(ctx *fiber.Ctx) error {
	return deserializeUser(ctx, AccessLevelAllitobiro)
}

func IdorogzitoAccess(ctx *fiber.Ctx) error {
	return deserializeUser(ctx, AccessLevelIdorogzito)
}

func SpeakerAccess(ctx *fiber.Ctx) error {
	return deserializeUser(ctx, AccessLevelSpeaker)
}
