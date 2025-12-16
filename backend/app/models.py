from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date, Float, Enum
from sqlalchemy.orm import relationship
import enum
from .database import Base

class ExperienceLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class GoalType(str, enum.Enum):
    FREQUENCY = "frequency"
    STRENGTH = "strength"
    VOLUME = "volume"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    experience_level = Column(Enum(ExperienceLevel), default=ExperienceLevel.BEGINNER)
    
    goals = relationship("Goal", back_populates="owner")
    workouts = relationship("Workout", back_populates="owner")

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(Enum(GoalType))
    target_value = Column(Float)
    start_date = Column(Date)
    end_date = Column(Date)
    
    owner = relationship("User", back_populates="goals")

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date)
    notes = Column(String)

    owner = relationship("User", back_populates="workouts")
    exercises = relationship("ExerciseLog", back_populates="workout")

class ExerciseLog(Base):
    __tablename__ = "exercise_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    workout_id = Column(Integer, ForeignKey("workouts.id"))
    exercise_name = Column(String)
    sets = Column(Integer)
    reps = Column(Integer)
    weight = Column(Float)
    
    workout = relationship("Workout", back_populates="exercises")
