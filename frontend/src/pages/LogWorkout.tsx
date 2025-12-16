import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Plus, Trash } from 'lucide-react';

const LogWorkout: React.FC = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [exercises, setExercises] = useState([{ exercise_name: '', sets: 0, reps: 0, weight: 0 }]);

    const addExercise = () => {
        setExercises([...exercises, { exercise_name: '', sets: 0, reps: 0, weight: 0 }]);
    };

    const removeExercise = (index: number) => {
        const newExercises = [...exercises];
        newExercises.splice(index, 1);
        setExercises(newExercises);
    };

    const updateExercise = (index: number, field: string, value: string | number) => {
        const newExercises = [...exercises];
        newExercises[index] = { ...newExercises[index], [field]: value };
        setExercises(newExercises);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/workouts/', {
                date,
                notes,
                exercises
            });
            navigate('/');
        } catch (error) {
            console.error("Error logging workout", error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Log Workout</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input 
                        type="date" 
                        required
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea 
                        value={notes} 
                        onChange={(e) => setNotes(e.target.value)} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        rows={3}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Exercises</h3>
                        <button type="button" onClick={addExercise} className="text-indigo-600 flex items-center hover:text-indigo-800">
                            <Plus className="h-4 w-4 mr-1" /> Add Exercise
                        </button>
                    </div>
                    
                    {exercises.map((exercise, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-md space-y-4 relative">
                            <button type="button" onClick={() => removeExercise(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                                <Trash className="h-4 w-4" />
                            </button>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Exercise Name</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. Bench Press"
                                    value={exercise.exercise_name} 
                                    onChange={(e) => updateExercise(index, 'exercise_name', e.target.value)} 
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Sets</label>
                                    <input 
                                        type="number" 
                                        required
                                        min="1"
                                        value={exercise.sets} 
                                        onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))} 
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Reps</label>
                                    <input 
                                        type="number" 
                                        required
                                        min="1"
                                        value={exercise.reps} 
                                        onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))} 
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                                    <input 
                                        type="number" 
                                        required
                                        min="0"
                                        step="0.5"
                                        value={exercise.weight} 
                                        onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value))} 
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save Workout
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LogWorkout;
