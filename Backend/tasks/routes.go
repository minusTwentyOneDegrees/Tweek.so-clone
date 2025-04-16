package tasks

import (
	"github.com/gin-gonic/gin"
)

// RegisterRoutes регистрирует маршруты задач
func RegisterRoutes(rg *gin.RouterGroup, h *Handler) {
	tasks := rg.Group("/tasks")
	{
		tasks.GET("/:id", h.GetTaskByID)   // Получить все задачи по ID
		tasks.POST("/", h.CreateTask)      // Создать задачу
		tasks.PUT("/:id", h.UpdateTask)    // Обновить задачу
		tasks.DELETE("/:id", h.DeleteTask) // Удалить задачу
	}
}
