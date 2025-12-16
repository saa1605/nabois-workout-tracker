#!/bin/bash

# Get the directory of the script to ensure we run from project root
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Function to handle cleanup on exit
cleanup() {
    echo -e "\nStopping servers..."
    # Kill all child processes (background jobs) in the same process group
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM EXIT

echo "---------------------------------------"
echo "Starting Workout Tracker App"
echo "---------------------------------------"

# 1. Start Backend
echo "[1/2] Starting Backend (FastAPI)..."
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo "Error: Virtual environment not found. Please run set up instructions in README."
    exit 1
fi

# Run uvicorn in background
uvicorn app.main:app --reload --app-dir backend --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Wait a moment for backend to initialize
sleep 2

# 2. Start Frontend
echo "[2/2] Starting Frontend (Vite)..."
cd frontend
npm run dev

# Keep script running if frontend exits early but we want to keep backend (unlikely with npm run dev)
wait $BACKEND_PID
