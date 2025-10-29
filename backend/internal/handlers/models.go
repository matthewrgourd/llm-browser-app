package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// ModelInfo represents metadata about available models
type ModelInfo struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Size        string   `json:"size"`
	Parameters  string   `json:"parameters"`
	Quantization string  `json:"quantization"`
	Tags        []string `json:"tags"`
}

// GetModels returns a list of available LLM models
func GetModels(c *gin.Context) {
	models := []ModelInfo{
		{
			ID:          "Llama-3.2-1B-Instruct-q4f16_1-MLC",
			Name:        "Llama 3.2 1B Instruct",
			Description: "Small, fast model ideal for quick responses",
			Size:        "650 MB",
			Parameters:  "1B",
			Quantization: "q4f16_1",
			Tags:        []string{"fast", "lightweight", "recommended"},
		},
		{
			ID:          "Llama-3.2-3B-Instruct-q4f16_1-MLC",
			Name:        "Llama 3.2 3B Instruct",
			Description: "Balanced performance and quality",
			Size:        "1.8 GB",
			Parameters:  "3B",
			Quantization: "q4f16_1",
			Tags:        []string{"balanced", "popular"},
		},
		{
			ID:          "Phi-3.5-mini-instruct-q4f16_1-MLC",
			Name:        "Phi 3.5 Mini Instruct",
			Description: "Microsoft's efficient small model",
			Size:        "2.3 GB",
			Parameters:  "3.8B",
			Quantization: "q4f16_1",
			Tags:        []string{"efficient", "microsoft"},
		},
		{
			ID:          "Qwen2.5-7B-Instruct-q4f16_1-MLC",
			Name:        "Qwen 2.5 7B Instruct",
			Description: "High quality responses, requires more resources",
			Size:        "4.2 GB",
			Parameters:  "7B",
			Quantization: "q4f16_1",
			Tags:        []string{"high-quality", "advanced"},
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"models": models,
		"count":  len(models),
	})
}

