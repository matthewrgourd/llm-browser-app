package middleware

import (
	"time"

	"browser-llm-backend/internal/logger"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// LoggingMiddleware logs HTTP requests
func LoggingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		startTime := time.Now()

		// Process request
		c.Next()

		// Calculate latency
		latency := time.Since(startTime)

		// Get logger
		log := logger.GetLogger()

		// Log request details
		log.WithFields(logrus.Fields{
			"status":     c.Writer.Status(),
			"method":     c.Request.Method,
			"path":       c.Request.URL.Path,
			"ip":         c.ClientIP(),
			"latency":    latency.Milliseconds(),
			"user_agent": c.Request.UserAgent(),
		}).Info("HTTP Request")
	}
}

