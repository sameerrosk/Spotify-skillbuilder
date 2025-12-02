import React from 'react';
import { LucideIcon } from 'lucide-react';

export const Header: React.FC<{ title: string; subtitle?: string; onBack?: () => void; BackIcon?: LucideIcon }> = ({ title, subtitle, onBack, BackIcon }) => (
  <div className="mb-6 pt-4 px-4 sticky top-0 bg-spotify-base/95 backdrop-blur-md z-10 pb-4 border-b border-white/10">
    <div className="flex items-center gap-3">
        {onBack && BackIcon && (
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <BackIcon size={24} className="text-white" />
            </button>
        )}
        <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
            {subtitle && <p className="text-spotify-subtext text-sm">{subtitle}</p>}
        </div>
    </div>
  </div>
);

export const PrimaryButton: React.FC<{ 
  onClick: () => void; 
  children: React.ReactNode; 
  fullWidth?: boolean;
  disabled?: boolean;
}> = ({ onClick, children, fullWidth = false, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      bg-spotify-primary hover:bg-spotify-highlight text-black font-bold py-4 px-8 rounded-full 
      transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
      ${fullWidth ? 'w-full' : ''} shadow-lg shadow-spotify-primary/20
    `}
  >
    {children}
  </button>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-spotify-surface rounded-lg p-4 hover:bg-[#3E3E3E] transition-colors cursor-pointer ${className}`}
  >
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'bg-blue-600' }) => (
    <span className={`${color} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
        {children}
    </span>
);
