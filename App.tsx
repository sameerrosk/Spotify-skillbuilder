import React, { useState } from 'react';
import { User, UserProgress, Goal } from './types';
import { CURRENT_USER, INITIAL_PROGRESS, GOALS, MOCK_PACK, MOCK_LESSON, MOCK_QUIZ } from './constants';
import GoalSelection from './screens/GoalSelection';
import ProgressScreen from './screens/ProgressScreen';
import DailyPack from './screens/DailyPack';
import LessonSheet from './screens/LessonSheet';
import AssistantDrawer from './components/AssistantDrawer';
import SpotifyHome from './screens/SpotifyHome';
import BottomNav from './components/BottomNav';

type SkillBuilderScreen = 'GOAL_SELECTION' | 'PROGRESS' | 'DAILY_PACK' | 'LESSON_SHEET';

// SkillBuilder Application Flow Component
interface SkillBuilderFlowProps {
  onExit: () => void;
}

const SkillBuilderFlow: React.FC<SkillBuilderFlowProps> = ({ onExit }) => {
  const [screen, setScreen] = useState<SkillBuilderScreen>('GOAL_SELECTION');
  const [user, setUser] = useState<User>(CURRENT_USER);
  const [progress, setProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [currentGoalId, setCurrentGoalId] = useState<string | null>(null);
  
  // Assistant State
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const handleGoalSelect = (goalId: string) => {
    setCurrentGoalId(goalId);
    setUser(prev => ({ ...prev, currentGoalId: goalId }));
    setScreen('PROGRESS');
  };

  const handleStartDailyPack = () => {
    setScreen('DAILY_PACK');
  };

  const handlePackComplete = () => {
    setProgress(prev => ({
        ...prev,
        daysCompleted: prev.daysCompleted + 1,
        percentComplete: Math.min(1, prev.percentComplete + 0.05),
        currentStreak: prev.currentStreak + 1
    }));
    setScreen('LESSON_SHEET');
  };

  const handleFinishLesson = () => {
    setScreen('PROGRESS');
  };

  const handleChangeGoal = () => {
      setScreen('GOAL_SELECTION');
      setCurrentGoalId(null);
  }

  const currentGoal = GOALS.find(g => g.id === currentGoalId);

  const getContext = () => {
    return {
        screen,
        goalTitle: currentGoal?.title,
        dayNumber: progress.daysCompleted + 1,
        topics: currentGoalId === 'goal_english' ? "Vocabulary, Persistence, Professionalism" : "General"
    };
  };

  const renderScreen = () => {
    switch (screen) {
      case 'GOAL_SELECTION':
        return <GoalSelection goals={GOALS} onSelectGoal={handleGoalSelect} onExit={onExit} />;
      
      case 'PROGRESS':
        if (!currentGoal) return null;
        return (
          <ProgressScreen 
            user={user} 
            progress={progress} 
            currentGoal={currentGoal} 
            onContinue={handleStartDailyPack}
            onChangeGoal={handleChangeGoal}
            onExit={onExit}
          />
        );
      
      case 'DAILY_PACK':
        return (
          <DailyPack 
            pack={MOCK_PACK} 
            onComplete={handlePackComplete}
            dayCount={progress.daysCompleted + 1}
          />
        );
      
      case 'LESSON_SHEET':
        return (
          <LessonSheet 
            data={MOCK_LESSON} 
            quiz={MOCK_QUIZ} 
            dayCount={progress.daysCompleted + 1}
            onFinish={handleFinishLesson}
          />
        );
      
      default:
        return <GoalSelection goals={GOALS} onSelectGoal={handleGoalSelect} onExit={onExit} />;
    }
  };

  return (
    <div className="bg-spotify-base min-h-screen text-white font-sans selection:bg-spotify-primary selection:text-black animate-in fade-in slide-in-from-bottom-4 duration-300">
        {renderScreen()}
        <AssistantDrawer 
            isOpen={isAssistantOpen} 
            onOpen={() => setIsAssistantOpen(true)}
            onClose={() => setIsAssistantOpen(false)}
            context={getContext()}
        />
    </div>
  );
};

// Main App Orchestrator
const App: React.FC = () => {
  const [inSkillBuilder, setInSkillBuilder] = useState(false);

  return (
    <div className="bg-black min-h-screen text-white font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden">
      {inSkillBuilder ? (
        <SkillBuilderFlow onExit={() => setInSkillBuilder(false)} />
      ) : (
        <>
          <SpotifyHome onLaunchSkillBuilder={() => setInSkillBuilder(true)} />
          <BottomNav />
        </>
      )}
    </div>
  );
};

export default App;