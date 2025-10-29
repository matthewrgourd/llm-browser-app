#!/bin/bash

# Browser LLM Quick Start Script

echo "╔════════════════════════════════════════════════════════╗"
echo "║         Browser LLM - Quick Start Script              ║"
echo "║         Local AI Running in Your Browser               ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "${BLUE}[1/4]${NC} Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓${NC} Node.js $(node --version) found"

# Check if Go is installed
echo -e "${BLUE}[2/4]${NC} Checking Go installation..."
if ! command -v go &> /dev/null; then
    echo -e "${RED}❌ Go is not installed${NC}"
    echo "Please install Go 1.21+ from: https://golang.org/dl/"
    exit 1
fi
echo -e "${GREEN}✓${NC} Go $(go version | awk '{print $3}') found"

# Install dependencies
echo -e "${BLUE}[3/4]${NC} Installing dependencies..."

if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install
    cd ..
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${GREEN}✓${NC} Frontend dependencies already installed"
fi

echo "Downloading Go dependencies..."
cd backend && go mod download
cd ..
echo -e "${GREEN}✓${NC} Backend dependencies ready"

# Start servers
echo -e "${BLUE}[4/4]${NC} Starting servers..."
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  🚀 Starting Browser LLM Application${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${YELLOW}Frontend:${NC} http://localhost:3000"
echo -e "  ${YELLOW}Backend:${NC}  http://localhost:8080"
echo ""
echo -e "${YELLOW}📝 First time? It may take 1-2 minutes to download a model.${NC}"
echo -e "${YELLOW}📝 Models are cached locally for instant loading next time.${NC}"
echo ""
echo -e "${GREEN}Press Ctrl+C to stop both servers${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM

# Start backend in background
cd backend
go run cmd/server/main.go &
BACKEND_PID=$!
cd ..

# Give backend time to start
sleep 2

# Start frontend in foreground
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

