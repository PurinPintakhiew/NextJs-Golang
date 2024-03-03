package controllers

import (
	"strings"
	"time"

	"github.com/PurinPintakhiew/NextJs-Golang/configs"
	"github.com/PurinPintakhiew/NextJs-Golang/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

const SecretKey = "123456789"

// generate token
// generate token
func GenerateToken(user models.Users) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = user.Id

	// Convert the expiration time to a Unix timestamp
	expirationTime := time.Now().Add(time.Hour * 24).Unix()
	claims["exp"] = expirationTime

	tokenString, err := token.SignedString([]byte(SecretKey))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// auth middleware
func AuthMiddleware(c *fiber.Ctx) error {
	authorizationHeader := c.Get("Authorization")

	parts := strings.Split(authorizationHeader, " ")
	if len(parts) != 2 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid Authorization header format"})
	}

	token := parts[1]

	if token == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Token is not found", "token": token})
	}

	claims := jwt.MapClaims{}
	_, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Token validation failed", "error": err.Error()})
	}

	return c.Next()
}

// register
func Register(c *fiber.Ctx) error {
	var data models.RegistrationData

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.Users
	existingUser := configs.DB.Where("email = ?", data.Email).First(&user)

	if existingUser.RowsAffected > 0 {
		return c.Status(409).JSON(fiber.Map{"status": false, "message": "Email already in use"})
	}

	hashPassword, _ := bcrypt.GenerateFromPassword([]byte(data.Password), 15)

	newUser := models.Users{
		UserName: data.UserName,
		Email:    data.Email,
		Password: hashPassword,
	}

	configs.DB.Create(&newUser)

	token, err := GenerateToken(newUser)
	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"status":      true,
		"accessToken": token,
	})

}

// login
func Login(c *fiber.Ctx) error {
	var data models.LoginData

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.Users
	if err := configs.DB.Where("email = ?", data.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Invalid credentials"})
	}

	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(data.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Invalid credentials"})
	}

	token, err := GenerateToken(user)
	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"status":      true,
		"accessToken": token,
	})
}
