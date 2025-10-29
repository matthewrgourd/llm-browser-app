package config

import (
	"os"
	"strconv"
	"strings"
)

// Config holds the application configuration
type Config struct {
	Port            string
	Host            string
	Environment     string
	CORSOrigins     []string
	LogLevel        string
	StaticDir       string
	EnableProfiling bool
	TrustedProxies  []string
}

// Load reads configuration from environment variables with sensible defaults
func Load() *Config {
	return &Config{
		Port:            getEnv("PORT", "8080"),
		Host:            getEnv("HOST", "0.0.0.0"),
		Environment:     getEnv("ENVIRONMENT", "development"),
		CORSOrigins:     []string{getEnv("CORS_ORIGIN", "http://localhost:3000")},
		LogLevel:        getEnv("LOG_LEVEL", "info"),
		StaticDir:       getEnv("STATIC_DIR", "../frontend/dist"),
		EnableProfiling: getEnvBool("ENABLE_PROFILING", false),
		TrustedProxies:  getEnvSlice("TRUSTED_PROXIES", "127.0.0.1,::1"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		boolValue, err := strconv.ParseBool(value)
		if err != nil {
			return defaultValue
		}
		return boolValue
	}
	return defaultValue
}

// getEnvSlice reads a comma-separated env var and returns a slice of trimmed strings.
// If the env var is empty, it returns the provided defaultCSV split into values.
func getEnvSlice(key, defaultCSV string) []string {
	val := os.Getenv(key)
	if val == "" {
		val = defaultCSV
	}
	parts := strings.Split(val, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p != "" {
			out = append(out, p)
		}
	}
	return out
}
