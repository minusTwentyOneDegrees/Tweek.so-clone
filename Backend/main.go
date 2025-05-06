package main

import (
	"log"

	config "Backend/conf"
	"Backend/db"
	middleware "Backend/mware"
	"Backend/router"
	"Backend/tasks"

	auth "Backend/auth"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Ошибка при загрузке конфига: %v", err)
	}

	database, err := db.Init(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Ошибка подключения к БД: %v", err)
	}
	defer database.Close()
	// настройка цепочки работы с запросом handler - service - database
	taskRepo := tasks.NewRepository(database)
	taskService := tasks.NewService(taskRepo)
	taskHandler := tasks.NewHandler(taskService)

	// настройка цепочки защищенной работы с пользователями (логин и регистрация)
	authRepo := auth.NewPostgresUserRepo(database)
	authHandler := auth.NewHandler([]byte(cfg.JWTSecret), authRepo)

	// по факту старт маршрута бэкенда
	r := gin.Default()
	// чтобы tasks/ и tasks разными были в маршрутах
	r.RedirectTrailingSlash = false

	// cors заголовки для всех маршрутов
	r.Use(middleware.CORS())

	// установка маршрутов
	router.SetupRoutes(r, taskHandler, authHandler, cfg)

	// старт сервера
	log.Printf("Сервер запущен на порту %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Ошибка запуска сервера: %v", err)
	}
}
