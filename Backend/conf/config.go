package config

import (
	"errors"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseURL string
	JWTSecret   string
}

func LoadConfig() (Config, error) {
	// Загружаем переменные окружения из .env файла
	err := godotenv.Load()
	if err != nil {
		return Config{}, errors.New("error loading .env file")
	}

	port := getEnv("PORT", "8080")
	if port == "" {
		return Config{}, errors.New("PORT is required but not set")
	}

	databaseURL := getEnv("DATABASE_URL", "postgres://postgres:1234@localhost:5432/postgres?sslmode=disable")
	if databaseURL == "" {
		return Config{}, errors.New("DATABASE_URL is required but not set")
	}

	jwtSecret := getEnv("JWT_SECRET", "")
	if jwtSecret == "" {
		return Config{}, errors.New("JWT_SECRET is required but not set")
	}

	return Config{
		Port:        port,
		DatabaseURL: databaseURL,
		JWTSecret:   jwtSecret,
	}, nil
}

func getEnv(key, defaultValue string) string {
	val := os.Getenv(key)
	if val == "" {
		return defaultValue
	}
	return val
}
