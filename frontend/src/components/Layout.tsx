import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Dumbbell, Trophy, LogOut, PlusCircle } from 'lucide-react';

const Layout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <Dumbbell className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">FitTrack</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
               <Link to="/leaderboard" className="text-gray-500 hover:text-gray-900">
                <Trophy className="h-6 w-6" />
              </Link>
              <button onClick={handleLogout} className="text-gray-500 hover:text-gray-900">
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      <div className="fixed bottom-6 right-6">
        <Link to="/log-workout" className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
             <PlusCircle className="h-8 w-8" />
        </Link>
      </div>
    </div>
  );
};

export default Layout;
