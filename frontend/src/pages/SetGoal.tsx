import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SetGoal: React.FC = () => {
    const navigate = useNavigate();
    const [type, setType] = useState('frequency');
    const [targetValue, setTargetValue] = useState(0);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    // Default end date 30 days from now
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 30);
    const [endDate, setEndDate] = useState(defaultEndDate.toISOString().split('T')[0]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/goals/', {
                type,
                target_value: targetValue,
                start_date: startDate,
                end_date: endDate
            });
            navigate('/');
        } catch (error) {
            console.error("Error setting goal", error);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Set New Goal</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Goal Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                    >
                        <option value="frequency">Frequency (Workouts/week)</option>
                        <option value="volume">Volume (Total kg lifted)</option>
                        <option value="strength">Strength (1RM Increase - Not Impl)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Target Value</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                            type="number"
                            required
                            min="1"
                            value={targetValue}
                            onChange={(e) => setTargetValue(parseFloat(e.target.value))}
                            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">
                                {type === 'frequency' ? '/week' : 'kg'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            required
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            required
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Create Goal
                </button>
            </form>
        </div>
    );
};

export default SetGoal;
