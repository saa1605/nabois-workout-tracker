from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict
from datetime import datetime, timedelta
from .. import models, schemas
from ..database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

def calculate_score(user: models.User, db: Session):
    # Timeframe: Current Week
    today = datetime.now().date()
    start_of_week = today - timedelta(days=today.weekday())
    end_of_week = start_of_week + timedelta(days=6)
    
    # 1. Consistency Score
    workouts_this_week = db.query(models.Workout).filter(
        models.Workout.user_id == user.id,
        models.Workout.date >= start_of_week,
        models.Workout.date <= end_of_week
    ).count()
    
    consistency_score = min(workouts_this_week * 10, 50) # Cap at 50 points
    
    # 2. Goal Progress Score
    # For now, we'll take the first active goal. In future, avg across all active goals.
    active_goal = db.query(models.Goal).filter(
        models.Goal.user_id == user.id,
        models.Goal.end_date >= today
    ).first()
    
    goal_score = 0
    if active_goal:
        if active_goal.type == models.GoalType.FREQUENCY:
            # Target is usually "X times per week"
            # Normalize: If target is 4/week, and they did 2, score is 50.
            if active_goal.target_value > 0:
                goal_score = min((workouts_this_week / active_goal.target_value) * 100, 150) # Cap at 150%
        elif active_goal.type in [models.GoalType.VOLUME, models.GoalType.STRENGTH]:
            # Compare this week's total volume vs last week's
            current_vol = 0
            current_workouts = db.query(models.Workout).filter(
                models.Workout.user_id == user.id,
                models.Workout.date >= start_of_week
            ).all()
            for w in current_workouts:
                for e in w.exercises:
                    current_vol += e.sets * e.reps * e.weight
            
            last_week_start = start_of_week - timedelta(days=7)
            last_week_end = start_of_week - timedelta(days=1)
            last_vol = 0
            last_workouts = db.query(models.Workout).filter(
                models.Workout.user_id == user.id,
                models.Workout.date >= last_week_start,
                models.Workout.date <= last_week_end
            ).all()
            for w in last_workouts:
                for e in w.exercises:
                    last_vol += e.sets * e.reps * e.weight
            
            if last_vol > 0:
                improvement = (current_vol - last_vol) / last_vol
                # Base score 100 for maintaining, + points for improvement
                goal_score = 100 + (improvement * 100)
            else:
                goal_score = 100 # Baseline if no previous history
    else:
        # No goal set, default to just consistency-like metric or baseline
        goal_score = 50 

    # Weighted Average or Sum
    # Let's say Total Score = Consistency + Goal Score
    total_score = consistency_score + goal_score
    
    return {
        "username": user.username,
        "experience_level": user.experience_level,
        "consistency_score": consistency_score,
        "goal_score": goal_score,
        "total_score": round(total_score, 1)
    }

@router.get("/", response_model=List[Dict])
def get_leaderboard(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    leaderboard_data = []
    
    for user in users:
        score_data = calculate_score(user, db)
        leaderboard_data.append(score_data)
        
    # Sort by total score descending
    leaderboard_data.sort(key=lambda x: x["total_score"], reverse=True)
    
    return leaderboard_data
