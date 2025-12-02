import React from 'react';
import { User, UserProgress, Goal } from '../types';
import { Header } from '../components/Shared';
import { Trophy, Flame, Calendar, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ProgressScreenProps {
  user: User;
  progress: UserProgress;
  currentGoal: Goal;
  onContinue: () => void;
  onChangeGoal: () => void;
  onExit?: () => void;
}

const ProgressScreen: React.FC<ProgressScreenProps> = ({ user, progress, currentGoal, onContinue, onChangeGoal, onExit }) => {
  
  const data = [
    { name: 'Completed', value: progress.percentComplete * 100 },
    { name: 'Remaining', value: 100 - (progress.percentComplete * 100) },
  ];
  const COLORS = ['#1DB954', '#282828'];

  return (
    <div className="min-h-screen bg-spotify-base pb-24">
      <Header 
        title={`Hello ${user.firstName}`} 
        subtitle="Your Journey Progress"
        onBack={onExit}
        BackIcon={onExit ? X : undefined}
      />
      
      {/* Hacky back button to change goal */}
      <div className="absolute top-5 right-4 z-20">
        <button onClick={onChangeGoal} className="text-xs font-bold text-spotify-subtext hover:text-white uppercase tracking-wider">Change Goal</button>
      </div>

      <div className="px-4 space-y-6">
        
        {/* Goal Indicator */}
        <div className="bg-gradient-to-r from-green-900/40 to-spotify-base border border-green-500/20 rounded-xl p-4 flex items-center gap-4">
            <div className="text-4xl">{currentGoal.icon}</div>
            <div>
                <p className="text-xs text-green-400 uppercase font-bold tracking-widest mb-1">Current Focus</p>
                <h2 className="text-xl font-bold text-white">{currentGoal.title}</h2>
            </div>
        </div>

        {/* Circular Progress */}
        <div className="bg-spotify-surface rounded-xl p-6 flex flex-col items-center justify-center border border-white/5 relative">
            <h3 className="text-gray-400 text-sm font-medium mb-4 absolute top-6 left-6">Overall Progress</h3>
            <div className="h-48 w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="text-3xl font-bold text-white">{(progress.percentComplete * 100).toFixed(0)}%</span>
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-spotify-surface p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-2">
                <Flame className="text-orange-500" size={32} />
                <span className="text-2xl font-bold text-white">{progress.currentStreak}</span>
                <span className="text-xs text-gray-400 uppercase">Day Streak</span>
            </div>
            <div className="bg-spotify-surface p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-2">
                <Calendar className="text-blue-500" size={32} />
                <span className="text-2xl font-bold text-white">{progress.daysCompleted}</span>
                <span className="text-xs text-gray-400 uppercase">Days Done</span>
            </div>
        </div>

        {/* Continue Action */}
        <div className="pt-4">
            <button 
                onClick={onContinue}
                className="w-full bg-white text-black font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-white/10"
            >
                Start Day {progress.daysCompleted + 1} Pack <Trophy size={20} className="text-yellow-600" />
            </button>
        </div>

      </div>
    </div>
  );
};

export default ProgressScreen;