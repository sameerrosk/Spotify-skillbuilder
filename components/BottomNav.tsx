import React from 'react';
import { Home, Search, Library } from 'lucide-react';

const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-black/95 pt-2 pb-6 px-8 flex justify-between items-center border-t border-white/5 z-50">
      <NavItem icon={Home} label="Home" active />
      <NavItem icon={Search} label="Search" />
      <NavItem icon={Library} label="Your Library" />
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ElementType; label: string; active?: boolean }> = ({ icon: Icon, label, active }) => (
  <div className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
    <Icon size={24} strokeWidth={active ? 3 : 2} />
    <span className="text-[10px] font-medium">{label}</span>
  </div>
);

export default BottomNav;