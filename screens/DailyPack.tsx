import React, { useState, useEffect } from 'react';
import { DailyAudioPack, AudioItem } from '../types';
import { Header, PrimaryButton } from '../components/Shared';
import { Play, Pause, SkipForward, SkipBack, CheckCircle2, Music, Mic } from 'lucide-react';

interface DailyPackProps {
  pack: DailyAudioPack;
  onComplete: () => void;
  dayCount: number;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const DailyPack: React.FC<DailyPackProps> = ({ pack, onComplete, dayCount }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const currentTrack = pack.audioItems[currentTrackIndex];

  // Simulating playback
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= currentTrack.durationSec) {
            // Auto advance
            if (currentTrackIndex < pack.audioItems.length - 1) {
              setCurrentTrackIndex(idx => idx + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return prev;
            }
          }
          return prev + 1;
        });
      }, 1000); // 1 sec real time = 1 sec audio time for demo
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrackIndex, pack.audioItems.length, currentTrack.durationSec]);

  // Reset progress when track changes manually
  useEffect(() => {
    setProgress(0);
    setIsPlaying(true);
  }, [currentTrackIndex]);

  const handleTrackClick = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skip = (seconds: number) => {
    setProgress(prev => Math.min(Math.max(0, prev + seconds), currentTrack.durationSec));
  };

  const progressPercent = (progress / currentTrack.durationSec) * 100;

  return (
    <div className="min-h-screen bg-spotify-base pb-32">
       <Header title={`Day ${dayCount}`} subtitle="Your Daily Audio Pack" />

      {/* Player Section */}
      <div className="sticky top-[88px] z-20 px-4 mb-8">
        <div className="bg-gradient-to-br from-gray-800 to-black rounded-2xl p-6 shadow-2xl border border-white/5">
            <div className="flex flex-col items-center mb-6">
                <div className="w-48 h-48 bg-gray-700 rounded-lg mb-4 shadow-lg flex items-center justify-center text-6xl shadow-black/50">
                    {currentTrack.type === 'Song' ? '🎵' : '🎙️'}
                </div>
                <h2 className="text-xl font-bold text-center text-white mb-1 line-clamp-1">{currentTrack.title}</h2>
                <p className="text-spotify-subtext text-center">{currentTrack.artist}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-600 rounded-full mb-2 cursor-pointer relative group">
                <div 
                    className="h-full bg-spotify-primary rounded-full transition-all duration-300 relative" 
                    style={{ width: `${progressPercent}%` }}
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md"></div>
                </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mb-6 font-mono">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(currentTrack.durationSec)}</span>
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-8">
                <button onClick={() => skip(-15)} className="text-gray-400 hover:text-white transition"><SkipBack size={28} /></button>
                <button 
                    onClick={togglePlay} 
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-lg shadow-white/10"
                >
                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>
                <button onClick={() => skip(15)} className="text-gray-400 hover:text-white transition"><SkipForward size={28} /></button>
            </div>
        </div>
      </div>

      {/* Track List */}
      <div className="px-4 space-y-2">
        <h3 className="text-white font-bold mb-4 px-1">Up Next</h3>
        {pack.audioItems.map((item, index) => {
            const isActive = index === currentTrackIndex;
            return (
                <div 
                    key={item.id} 
                    onClick={() => handleTrackClick(index)}
                    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
                >
                    <div className="text-gray-400 w-4 text-center text-sm">
                        {isActive && isPlaying ? (
                            <div className="flex gap-0.5 h-3 items-end justify-center">
                                <div className="w-0.5 bg-spotify-primary animate-[bounce_1s_infinite] h-2"></div>
                                <div className="w-0.5 bg-spotify-primary animate-[bounce_1.2s_infinite] h-3"></div>
                                <div className="w-0.5 bg-spotify-primary animate-[bounce_0.8s_infinite] h-1"></div>
                            </div>
                        ) : (
                            <span>{index + 1}</span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className={`font-medium truncate ${isActive ? 'text-spotify-primary' : 'text-white'}`}>{item.title}</h4>
                        <p className="text-sm text-spotify-subtext truncate">{item.artist}</p>
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                        {formatTime(item.durationSec)}
                    </div>
                </div>
            )
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent">
        <PrimaryButton fullWidth onClick={onComplete}>
            <span className="flex items-center justify-center gap-2">
                Mark as Complete <CheckCircle2 size={20} />
            </span>
        </PrimaryButton>
      </div>
    </div>
  );
};

export default DailyPack;