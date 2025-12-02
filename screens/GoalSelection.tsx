import React from 'react';
import { Goal } from '../types';
import { Card, Header } from '../components/Shared';
import { ChevronRight, X } from 'lucide-react';

interface GoalSelectionProps {
  goals: Goal[];
  onSelectGoal: (goalId: string) => void;
  onExit?: () => void;
}

const GoalSelection: React.FC<GoalSelectionProps> = ({ goals, onSelectGoal, onExit }) => {
  return (
    <div className="min-h-screen bg-spotify-base pb-24">
      <Header 
        title="What do you want to master?" 
        subtitle="Choose a path to start your daily audio journey." 
        onBack={onExit}
        BackIcon={onExit ? X : undefined}
      />
      
      <div className="px-4 grid gap-4">
        {goals.map((goal) => (
          <Card key={goal.id} onClick={() => onSelectGoal(goal.id)} className="flex items-center gap-4 group">
            <div className="text-4xl bg-white/5 p-4 rounded-full">{goal.icon}</div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-1 group-hover:text-spotify-primary transition-colors">{goal.title}</h3>
              <p className="text-spotify-subtext text-sm leading-snug">{goal.description}</p>
            </div>
            <ChevronRight className="text-spotify-subtext group-hover:text-white transition-colors" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GoalSelection;