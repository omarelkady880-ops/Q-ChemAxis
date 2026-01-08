import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { User, LogOut, Award, HardDrive, Crown, TrendingUp } from 'lucide-react';

const UserDashboard = () => {
  const { user, logout } = useUser();
  const [stats, setStats] = useState({
    memoryUsage: 0,
    quizzesTaken: 0,
    avgScore: 0,
    bestScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real user stats from backend
    const fetchStats = async () => {
      if (!user || !user.id) return;

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/admin/users/${user.id}/stats`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.stats) {
            setStats({
              memoryUsage: data.stats.memoryUsage || 0,
              quizzesTaken: data.stats.quizzesTaken || 0,
              avgScore: data.stats.avgScore || 0,
              bestScore: data.stats.bestScore || 0
            });
          }
        } else {
          console.error('Failed to fetch user stats:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const handleLogout = async () => {
    await logout();
  };

  if (!user) return null;

  // Determine plan type based on user level or other criteria
  const planType = user.level === 'Advanced' ? 'Pro' : 'Free';
  const isPro = planType === 'Pro';

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-cyan-400/30 p-4 mb-4">
      {/* User Info Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-cyan-300 font-semibold text-lg">{user.username}</h3>
            <p className="text-cyan-400/70 text-xs">{user.email}</p>
          </div>
        </div>
        {isPro && (
          <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/50 rounded-full px-3 py-1">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-xs font-semibold">PRO</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Level */}
        <div className="bg-slate-700/50 rounded-lg p-3 border border-cyan-400/20">
          <div className="flex items-center space-x-2 mb-1">
            <Award className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300/70 text-xs">Level</span>
          </div>
          <p className="text-cyan-300 font-semibold">{user.level || 'Beginner'}</p>
        </div>

        {/* Plan */}
        <div className="bg-slate-700/50 rounded-lg p-3 border border-cyan-400/20">
          <div className="flex items-center space-x-2 mb-1">
            <Crown className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300/70 text-xs">Plan</span>
          </div>
          <p className="text-cyan-300 font-semibold">{planType}</p>
        </div>

        {/* Memory Usage */}
        <div className="bg-slate-700/50 rounded-lg p-3 border border-cyan-400/20">
          <div className="flex items-center space-x-2 mb-1">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300/70 text-xs">Memory</span>
          </div>
          {loading ? (
            <p className="text-cyan-300/50 text-sm">Loading...</p>
          ) : (
            <>
              <p className="text-cyan-300 font-semibold">{stats.memoryUsage} MB</p>
              <div className="w-full bg-slate-600 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 rounded-full"
                  style={{ width: `${Math.min((stats.memoryUsage / 100) * 100, 100)}%` }}
                ></div>
              </div>
            </>
          )}
        </div>

        {/* Quizzes Taken */}
        <div className="bg-slate-700/50 rounded-lg p-3 border border-cyan-400/20">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300/70 text-xs">Quizzes</span>
          </div>
          {loading ? (
            <p className="text-cyan-300/50 text-sm">Loading...</p>
          ) : (
            <>
              <p className="text-cyan-300 font-semibold">{stats.quizzesTaken}</p>
              {stats.quizzesTaken > 0 && (
                <p className="text-cyan-300/70 text-xs mt-1">
                  Avg: {stats.avgScore}% | Best: {stats.bestScore}%
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/50 rounded-lg py-2.5 transition-all"
      >
        <LogOut className="w-4 h-4" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
};

export default UserDashboard;
