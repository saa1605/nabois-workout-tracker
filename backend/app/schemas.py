from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from .models import ExperienceLevel, GoalType

class UserBase(BaseModel):
    username: str
    email: Optional[str] = None
    experience_level: ExperienceLevel = ExperienceLevel.BEGINNER

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class GoalBase(BaseModel):
    type: GoalType
    target_value: float
    start_date: date
    end_date: date

class GoalCreate(GoalBase):
    pass

class Goal(GoalBase):
    id: int
    user_id: int
    
    class Config:
        orm_mode = True

class ExerciseLogBase(BaseModel):
    exercise_name: str
    sets: int
    reps: int
    weight: float

class ExerciseLogCreate(ExerciseLogBase):
    pass

class ExerciseLog(ExerciseLogBase):
    id: int
    
    class Config:
        orm_mode = True

class WorkoutBase(BaseModel):
    date: date
    notes: Optional[str] = None

class WorkoutCreate(WorkoutBase):
    exercises: List[ExerciseLogCreate]

class Workout(WorkoutBase):
    id: int
    user_id: int
    exercises: List[ExerciseLog]
    
    class Config:
        orm_mode = True
