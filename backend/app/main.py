from fastapi import FastAPI
from . import models
from .database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Workout Tracker & Leaderboard")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Workout Tracker API"}

from .routers import auth, goals, workouts, leaderboard
app.include_router(auth.router)
app.include_router(goals.router)
app.include_router(workouts.router)
app.include_router(leaderboard.router)
