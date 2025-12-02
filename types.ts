export interface User {
  id: string;
  email: string;
  firstName: string;
  currentGoalId: string | null;
  joinDate: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface AudioItem {
  id: string;
  type: 'Song' | 'Podcast';
  title: string;
  artist: string;
  durationSec: number;
  url: string;
  clipStartSec?: number;
  clipEndSec?: number;
}

export interface DailyAudioPack {
  id: string;
  goalId: string;
  dayNumber: number;
  audioItems: AudioItem[];
  lessonSheetId: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  packId: string;
  questions: QuizQuestion[];
}

export interface LessonSheet {
  id: string;
  aiSummary: string;
  vocabulary: { word: string; definition: string }[];
  quizId: string;
}

export interface UserProgress {
  userId: string;
  daysCompleted: number;
  currentStreak: number;
  percentComplete: number;
}

// Assistant Types
export interface AssistantResponse {
  intentDetected: string;
  confidence: number;
  uncertaintyExplanation?: string;
  stepByStepFlow?: {
    id: string;
    title: string;
    description: string;
    expectedScreen: string;
  }[];
  checklist?: {
    id: string;
    label: string;
    hints: string[];
  }[];
  suggestedActions?: {
    label: string;
    actionType: string;
    payload: any;
  }[];
  followUpQuestions?: string[];
}