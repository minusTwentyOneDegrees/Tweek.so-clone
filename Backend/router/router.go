package router

import (
	"Backend/auth"
	config "Backend/conf"
	middleware "Backend/mware"
	"Backend/tasks"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, taskHandler *tasks.Handler, authHandler *auth.Handler, cfg config.Config) {

	// открытые роуты
	r.POST("/register", authHandler.Register)
	r.POST("/login", authHandler.Login)

	// Защищённые роуты
	api := r.Group("/api")
	api.Use(middleware.JWTAuthMiddleware(cfg))
	{
		tasks.RegisterRoutes(api, taskHandler)
	}
}
