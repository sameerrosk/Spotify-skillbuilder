import React from 'react';
import { Bell, Clock, Settings, Zap, GraduationCap, Play, Globe } from 'lucide-react';

interface SpotifyHomeProps {
  onLaunchSkillBuilder: () => void;
}

const SpotifyHome: React.FC<SpotifyHomeProps> = ({ onLaunchSkillBuilder }) => {
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-gradient-to-b from-[#4a1c1c] via-[#121212] to-[#121212] min-h-screen text-white pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 pt-12 sticky top-0 bg-[#4a1c1c]/95 backdrop-blur-sm z-20">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center font-bold text-black text-xs">A</div>
            <span className="font-bold text-xs bg-white/10 px-3 py-1 rounded-full text-spotify-primary border border-white/5">Premium</span>
        </div>
        <div className="flex gap-4 text-white">
            <Bell size={22} />
            <Clock size={22} />
            <Settings size={22} />
        </div>
      </div>

      {/* Chips */}
      <div className="flex gap-2 px-4 mb-6 mt-2 overflow-x-auto no-scrollbar">
        <Chip label="All" active />
        <Chip label="Music" />
        <Chip label="Podcasts" />
        <Chip 
          label="SkillBuilder" 
          icon={<Zap size={12} fill="currentColor" />}
          highlight 
          onClick={onLaunchSkillBuilder} 
        />
      </div>

      {/* Recent Grid */}
      <div className="px-4 mb-8">
        <h2 className="text-2xl font-bold mb-4 tracking-tight">{getTimeGreeting()}</h2>
        <div className="grid grid-cols-2 gap-2">
            <RecentCard title="Liked Songs" image={<div className="bg-gradient-to-br from-indigo-700 to-white text-white p-2">💜</div>} />
            <RecentCard 
                title="SkillBuilder" 
                image={<div className="bg-spotify-primary p-3"><Zap size={20} fill="black" className="text-black" /></div>}
                highlight 
                onClick={onLaunchSkillBuilder}
            />
            {/* Reduced options as requested */}
            <RecentCard title="On Repeat" image={<div className="bg-green-700 p-2 text-xl">🔄</div>} />
            <RecentCard title="Focus Flow" image={<div className="bg-blue-900 p-2 text-xl">🧠</div>} />
        </div>
      </div>

      {/* Sections */}
      <Section title="Your Learning Journey">
        <MixCard 
            title="Continue English" 
            desc="Day 7 • Vocabulary & Listening" 
            color="bg-gradient-to-br from-spotify-primary to-green-900" 
            icon={<GraduationCap size={40} className="text-black" />}
            onClick={onLaunchSkillBuilder}
        />
        <MixCard title="Productivity 101" desc="Deep work techniques" color="bg-gradient-to-br from-orange-500 to-red-900" icon={<Zap size={40} />} />
        <MixCard title="Music Theory" desc="Understanding scales" color="bg-gradient-to-br from-purple-500 to-blue-900" icon={<Play size={40} />} />
      </Section>
      
      {/* New Explore Music Section */}
      <Section title="Explore Music">
         <MixCard title="Indian Songs" desc="Bollywood & Desi Hits" color="bg-gradient-to-br from-orange-600 to-orange-900" icon={<span className="text-4xl">🇮🇳</span>} />
         <MixCard title="English Songs" desc="Global Top 50" color="bg-gradient-to-br from-blue-600 to-blue-900" icon={<span className="text-4xl">🇺🇸</span>} />
         <MixCard title="French Songs" desc="Chansons Françaises" color="bg-gradient-to-br from-indigo-500 to-indigo-900" icon={<span className="text-4xl">🇫🇷</span>} />
         <MixCard title="Spanish Hits" desc="Reggaeton & Pop" color="bg-gradient-to-br from-red-500 to-red-900" icon={<span className="text-4xl">🇪🇸</span>} />
      </Section>
      
       <Section title="Your Top Mixes">
        <MixCard title="Pop Mix" desc="Dua Lipa, The Weeknd, Ariana Grande" color="bg-green-700" icon={<span className="text-4xl">🎤</span>} />
        <MixCard title="Chill Mix" desc="Ed Sheeran, Hozier, Coldplay" color="bg-blue-700" icon={<span className="text-4xl">🧊</span>} />
      </Section>
    </div>
  );
};

const Chip = ({ label, active, highlight, onClick, icon }: any) => (
    <button 
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5
        ${active ? 'bg-[#1DB954] text-black font-bold' : highlight ? 'bg-white text-black font-bold' : 'bg-white/10 text-white hover:bg-white/20'}
        `}
    >
        {icon}
        {label}
    </button>
)

const RecentCard = ({ title, image, highlight, onClick }: any) => (
    <button onClick={onClick} className={`flex items-center gap-2 pr-2 rounded-md bg-white/10 hover:bg-white/20 transition overflow-hidden group h-14 text-left ${highlight ? 'relative overflow-hidden' : ''}`}>
        {highlight && <div className="absolute inset-0 bg-spotify-primary/10 animate-pulse pointer-events-none"></div>}
        <div className={`h-full w-14 flex items-center justify-center overflow-hidden shrink-0`}>
            {image}
        </div>
        <span className={`font-bold text-xs line-clamp-2 flex-1 ${highlight ? 'text-spotify-primary' : 'text-white'}`}>{title}</span>
        {highlight && <div className="w-2 h-2 rounded-full bg-spotify-primary mr-2 shadow-[0_0_8px_rgba(29,185,84,0.8)]" />}
    </button>
)

const Section = ({ title, children }: any) => (
    <div className="mb-8">
        <h2 className="text-2xl font-bold px-4 mb-4 tracking-tight">{title}</h2>
        <div className="flex gap-4 overflow-x-auto px-4 pb-4 no-scrollbar">
            {children}
        </div>
    </div>
)

const MixCard = ({ title, desc, color, onClick, icon }: any) => (
    <button onClick={onClick} className="min-w-[150px] w-[150px] flex flex-col items-start text-left group">
        <div className={`w-full h-[150px] ${color} mb-3 shadow-lg flex items-center justify-center relative rounded-md transition hover:scale-105 hover:shadow-xl`}>
            {icon}
        </div>
        <h3 className="font-bold text-white text-sm truncate w-full mb-1">{title}</h3>
        <p className="text-[#a7a7a7] text-xs line-clamp-2 leading-relaxed">{desc}</p>
    </button>
)

export default SpotifyHome;