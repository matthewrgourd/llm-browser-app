package main

import (
	"browser-llm-backend/internal/config"
	"browser-llm-backend/internal/handlers"
	"browser-llm-backend/internal/logger"
	"browser-llm-backend/internal/middleware"
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Initialize logger
	logger.Init(cfg.LogLevel)
	log := logger.GetLogger()

	log.Info("Starting Browser LLM Backend Server")

	// Set Gin mode
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Create Gin router
	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(middleware.LoggingMiddleware())

	// Configure CORS
	corsConfig := cors.Config{
		AllowOrigins:     cfg.CORSOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}
	router.Use(cors.New(corsConfig))

	// API routes
	api := router.Group("/api")
	{
		api.GET("/health", handlers.HealthCheck)
		api.GET("/models", handlers.GetModels)
	}

	// Serve static files in production
	if cfg.Environment == "production" {
		router.Static("/assets", cfg.StaticDir+"/assets")
		router.StaticFile("/", cfg.StaticDir+"/index.html")
		router.NoRoute(func(c *gin.Context) {
			c.File(cfg.StaticDir + "/index.html")
		})
	}

	// Start server
	addr := fmt.Sprintf("%s:%s", cfg.Host, cfg.Port)
	log.WithField("address", addr).Info("Server starting")

	if err := router.Run(addr); err != nil {
		log.WithError(err).Fatal("Failed to start server")
	}
}

