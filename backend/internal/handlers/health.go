package handlers

import (
	"net/http"
	"runtime"
	"time"

	"github.com/gin-gonic/gin"
)

// HealthResponse represents the health check response
type HealthResponse struct {
	Status    string            `json:"status"`
	Timestamp time.Time         `json:"timestamp"`
	Version   string            `json:"version"`
	System    map[string]string `json:"system"`
}

// HealthCheck returns the health status of the application
func HealthCheck(c *gin.Context) {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)

	response := HealthResponse{
		Status:    "healthy",
		Timestamp: time.Now(),
		Version:   "1.0.0",
		System: map[string]string{
			"go_version":  runtime.Version(),
			"num_cpu":     string(rune(runtime.NumCPU())),
			"num_goroutine": string(rune(runtime.NumGoroutine())),
		},
	}

	c.JSON(http.StatusOK, response)
}

