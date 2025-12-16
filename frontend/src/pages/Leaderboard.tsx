import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface LeaderboardEntry {
    username: string;
    experience_level: string;
    total_score: number;
    consistency_score: number;
    goal_score: number;
}

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/leaderboard/');
        setEntries(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard", error);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        <p className="mt-1 text-sm text-gray-500">Weekly Normalized Standings</p>
      </header>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
            {entries.map((entry, index) => (
                <li key={entry.username} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-indigo-400'}`}>
                                {index + 1}
                            </span>
                            <div className="ml-4">
                                <p className="text-lg font-medium text-indigo-600 truncate">{entry.username}</p>
                                <p className="text-sm text-gray-500 capitalize">{entry.experience_level}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                             <p className="text-2xl font-bold text-gray-900">{entry.total_score}</p>
                             <p className="text-xs text-gray-500">Points</p>
                        </div>
                    </div>
                     <div className="mt-2 flex justify-between text-sm text-gray-500">
                         <span>Consistency: {entry.consistency_score}</span>
                         <span>Goal Progress: {Math.round(entry.goal_score)}</span>
                     </div>
                </li>
            ))}
            {entries.length === 0 && (
                <li className="px-4 py-8 text-center text-gray-500">
                    No active players this week. Be the first!
                </li>
            )}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
