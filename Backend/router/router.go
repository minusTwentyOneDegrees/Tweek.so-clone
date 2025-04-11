package router

import (
	"database/sql"
	"net/http"

	"Backend/tasks"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func Setup(db *sql.DB) http.Handler {
	r := chi.NewRouter()

	// Общие middleware
	r.Use(middleware.Logger)    // Логгирует каждый запрос
	r.Use(middleware.Recoverer) // Защищает от паники
	r.Use(middleware.AllowContentType("application/json"))

	// Добавим корневой роут
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Tweek Clone API is running"))
	})

	// Подключаем маршруты фич-флагов
	r.Route("/flags", func(r chi.Router) {
		tasks.RegisterRoutes(r, db)
	})

	return r
}
