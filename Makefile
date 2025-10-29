.PHONY: help install dev build clean backend frontend

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Installing backend dependencies..."
	cd backend && go mod download
	@echo "All dependencies installed!"

dev: ## Run both frontend and backend in development mode
	@echo "Starting development servers..."
	@echo "Frontend will be available at http://localhost:3000"
	@echo "Backend will be available at http://localhost:8080"
	@make -j2 dev-frontend dev-backend

dev-frontend: ## Run frontend development server
	cd frontend && npm run dev

dev-backend: ## Run backend development server
	cd backend && go run cmd/server/main.go

build: ## Build for production
	@echo "Building frontend..."
	cd frontend && npm run build
	@echo "Building backend..."
	cd backend && go build -o server cmd/server/main.go
	@echo "Build complete!"

clean: ## Clean build artifacts
	@echo "Cleaning..."
	rm -rf frontend/dist
	rm -rf frontend/node_modules
	rm -f backend/server
	rm -rf backend/vendor
	@echo "Clean complete!"

test-backend: ## Run backend tests
	cd backend && go test ./...

lint-frontend: ## Lint frontend code
	cd frontend && npm run lint

check: lint-frontend test-backend ## Run all checks

run-prod: build ## Run production build
	cd backend && ./server

