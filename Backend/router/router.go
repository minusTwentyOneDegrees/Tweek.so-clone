package router

import (
	"Backend/auth"
	config "Backend/conf"
	middleware "Backend/mware"
	"Backend/tasks"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, taskHandler *tasks.Handler, cfg config.Config) {
	// Middleware
	r.Use(middleware.Logger())
	r.Use(middleware.CORS())

	// Auth handler
	authHandler := auth.NewHandler([]byte(cfg.JWTSecret))

	// Public routes
	r.POST("/register", authHandler.Register)
	r.POST("/login", authHandler.Login)

	// Защищённые роуты
	api := r.Group("/api")
	api.Use(middleware.JWTAuthMiddleware(cfg))
	{
		tasks.RegisterRoutes(api, taskHandler)
	}
}
