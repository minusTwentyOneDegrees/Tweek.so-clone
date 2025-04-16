package middleware

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

// Logger — логирует путь, метод, статус и время обработки запроса
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next() // вызываем следующий обработчик

		duration := time.Since(start)
		status := c.Writer.Status()
		method := c.Request.Method
		path := c.Request.URL.Path

		log.Printf("%s %s | %d | %v", method, path, status, duration)
	}
}
