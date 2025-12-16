import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Workout {
    id: number;
    date: string;
    notes: string;
}

interface Goal {
    id: number;
    type: string;
    target_value: number;
}

const Dashboard: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workoutsRes, goalsRes, statsRes] = await Promise.all([
            api.get('/workouts/'),
            api.get('/goals/'),
            api.get('/workouts/stats/progressive_overload')
        ]);
        setWorkouts(workoutsRes.data);
        setGoals(goalsRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your progress.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Goals Card */}
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex justify-between items-center">
                Active Goals
                <Link to="/set-goal" className="text-indigo-600 text-sm hover:text-indigo-800">New Goal</Link>
            </h3>
            {goals.length === 0 ? (
                <p className="text-gray-500">No active goals. Set one to get started!</p>
            ) : (
                <div className="space-y-4">
                    {goals.map(goal => (
                        <div key={goal.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                            <p className="font-semibold text-gray-800 capitalize">{goal.type} Goal</p>
                            <p className="text-sm text-gray-500">Target: {goal.target_value}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Recent Workouts Card */}
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Workouts</h3>
            {workouts.length === 0 ? (
                <p className="text-gray-500">No workouts logged yet.</p>
            ) : (
                <div className="space-y-4 max-h-60 overflow-y-auto">
                    {workouts.map(workout => (
                        <div key={workout.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                            <div>
                                <p className="font-medium text-gray-800">{new Date(workout.date).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-500 truncate max-w-xs">{workout.notes}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Volume Progression</h3>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="volume" stroke="#4f46e5" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
