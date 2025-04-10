package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"

	"Backend/config"
	"Backend/db"
	"Backend/router"
)

func main() {
	// Загружаем переменные из .env (например, PORT, DATABASE_URL)
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using system env vars")
	}

	// Загружаем конфигурацию
	cfg := config.LoadConfig()

	// Подключаемся к базе данных
	database, err := db.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("DB connection error: %v", err)
	}
	defer database.Close()

	// Настраиваем маршруты
	r := router.Setup(database)

	// Запускаем сервер
	log.Printf("Server is running on port %s", cfg.Port)
	log.Fatal(http.ListenAndServe(":"+cfg.Port, r))
}
