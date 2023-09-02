package utils

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
)

var validate = validator.New()

type StructValidationErrorResponse struct {
	Field string `json:"field"`
	Tag   string `json:"tag"`
	Value string `json:"value,omitempty"`
}

func ValidateStruct[T any](payload *T) []*StructValidationErrorResponse {
	var errorResponses []*StructValidationErrorResponse
	err := validate.Struct(payload)
	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			var element StructValidationErrorResponse
			element.Field = err.StructNamespace()
			element.Tag = err.Tag()
			element.Value = err.Param()
			errorResponses = append(errorResponses, &element)
		}
	}
	return errorResponses
}

func RequestBodyValidation[T interface{}](_ T) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		// parse request body
		var payload T
		if err := ctx.BodyParser(&payload); err != nil {
			return ctx.Status(fiber.StatusBadRequest).
				JSON(NewErrorResponseMessage(err.Error()))
		}
		errors := ValidateStruct(&payload)
		if errors != nil {
			return ctx.Status(fiber.StatusBadRequest).
				JSON(NewErrorResponseMessage("failed to validate request body"))
		}

		ctx.Locals("payload", payload)
		log.Infof("Request body validated: %s", payload)

		return ctx.Next()
	}
}
