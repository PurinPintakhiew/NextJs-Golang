package routes

import (
	"github.com/PurinPintakhiew/NextJs-Golang/controllers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func Route() {
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://127.0.0.1:3000",
		AllowCredentials: true,
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"message": "This request does not exist."})
	})

	app.Post("/api/register", controllers.Register)
	app.Post("/api/login", controllers.Login)

	app.Get("/api/users", controllers.AuthMiddleware, controllers.Users)

	app.Listen((":8080"))
}
