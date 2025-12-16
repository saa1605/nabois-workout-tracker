from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from .. import models, schemas
from ..database import get_db
from .auth import get_current_user
from sqlalchemy import func

router = APIRouter(prefix="/workouts", tags=["workouts"])

@router.post("/", response_model=schemas.Workout)
def create_workout(workout: schemas.WorkoutCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_workout = models.Workout(date=workout.date, notes=workout.notes, user_id=current_user.id)
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    
    for exercise in workout.exercises:
        db_exercise = models.ExerciseLog(**exercise.dict(), workout_id=db_workout.id)
        db.add(db_exercise)
    
    db.commit()
    db.refresh(db_workout)
    return db_workout

@router.get("/", response_model=List[schemas.Workout])
def read_workouts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    workouts = db.query(models.Workout).filter(models.Workout.user_id == current_user.id).order_by(models.Workout.date.desc()).offset(skip).limit(limit).all()
    return workouts

@router.get("/stats/progressive_overload")
def get_progressive_overload_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Calculate weekly volume
    # This is a simplified example. In a real app, you'd aggregate by week.
    workouts = db.query(models.Workout).filter(models.Workout.user_id == current_user.id).order_by(models.Workout.date).all()
    
    weekly_stats = {}
    
    for workout in workouts:
        # Simplistic week identifier: ISO year + week number
        week_id = workout.date.strftime("%Y-%W")
        if week_id not in weekly_stats:
            weekly_stats[week_id] = {"volume": 0, "workouts": 0}
        
        weekly_stats[week_id]["workouts"] += 1
        for exercise in workout.exercises:
            weekly_stats[week_id]["volume"] += exercise.sets * exercise.reps * exercise.weight

    return [{"week": k, **v} for k, v in weekly_stats.items()]
