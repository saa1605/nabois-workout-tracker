# Workout Tracker & Leaderboard

A Progressive Web App (PWA) for tracking workouts and competing on a leaderboard with friends.

## Tech Stack
- **Backend**: FastAPI (Python), SQLite
- **Frontend**: React (Vite), TailwindCSS, PWA

## Prerequisites
- Python 3.8+
- Node.js & npm

## Setup & Installation

### 1. Backend
The backend handles the API, database, and authentication.

```bash
# Navigate to the project root
cd nabois-workout-tracker

# Create a virtual environment (if not already created)
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt
```

### 2. Frontend
The frontend is a React application.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
```

## Running the Application

You will need two terminal windows running simultaneously.

### Terminal 1: Start Backend Server
```bash
# Ensure you are in the project root and venv is activated
source venv/bin/activate

# Start the FastAPI server
# This runs on http://127.0.0.1:8000
uvicorn app.main:app --reload --app-dir backend
```

### Terminal 2: Start Frontend Server
```bash
# Navigate to frontend
cd frontend

# Start the development server
# This runs on http://localhost:5173
npm run dev
```

## Usage
1. Open your browser and go to the URL shown in the frontend terminal (usually `http://localhost:5173`).
2. **Sign Up**: Create a new account.
3. **Set a Goal**: Go to the Dashboard and create a new fitness goal.
4. **Log Workouts**: Use the "+" button to log your exercises.
5. **Leaderboard**: Check your normalized score against others.

## APIs
- Documentation is available at `http://127.0.0.1:8000/docs` when the backend is running.
