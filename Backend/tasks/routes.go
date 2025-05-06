package tasks

import (
	"github.com/gin-gonic/gin"
)

//регистрирует маршруты задач
func RegisterRoutes(rg *gin.RouterGroup, h *Handler) {
	tasks := rg.Group("/tasks")
	{
		tasks.GET("", h.GetAllTasks)
		tasks.POST("", h.CreateTask)
		tasks.PUT("/:id", h.UpdateTask)
		tasks.DELETE("/:id", h.DeleteTask)
	}
}
