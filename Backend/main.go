package main

import (
	"log"

	"github.com/gin-gonic/gin"

	config "Backend/conf"
	"Backend/db"
	"Backend/router"
	"Backend/tasks"
)

func main() {
	// 1. Загружаем конфиг
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Ошибка при загрузке конфига: %v", err)
	}

	// 2. Подключаем БД
	database, err := db.Init(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Ошибка подключения к БД: %v", err)
	}
	defer database.Close()

	// 3. Инициализируем бизнес-логику задач
	repo := tasks.NewRepository(database)
	service := tasks.NewService(repo)
	handler := tasks.NewHandler(service)

	// 4. Создаём роутер
	r := gin.Default()

	// 5. Настраиваем роуты
	router.SetupRoutes(r, handler, cfg)

	// 6. Запускаем сервер
	log.Printf("Сервер запущен на порту %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Ошибка запуска сервера: %v", err)
	}
}
