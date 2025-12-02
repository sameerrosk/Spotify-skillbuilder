import { Goal, DailyAudioPack, LessonSheet, Quiz, User, UserProgress } from './types';

export const CURRENT_USER: User = {
  id: "usr_91011",
  email: "student_alpha@mail.com",
  firstName: "Saneer",
  currentGoalId: null, // Starts null, selected by user
  joinDate: "2025-12-01"
};

export const INITIAL_PROGRESS: UserProgress = {
  userId: "usr_91011",
  daysCompleted: 6,
  currentStreak: 3,
  percentComplete: 0.2 // 20%
};

export const GOALS: Goal[] = [
  {
    id: "goal_english",
    title: "Improve English",
    description: "Master professional vocabulary and clear communication.",
    icon: "🗣️"
  },
  {
    id: "goal_focus",
    title: "Deep Focus",
    description: "Train your attention span with productivity techniques.",
    icon: "🧠"
  },
  {
    id: "goal_music",
    title: "Music Theory",
    description: "Understand the building blocks of your favorite songs.",
    icon: "🎵"
  }
];

export const MOCK_PACK: DailyAudioPack = {
  id: "pack_001_eng",
  goalId: "goal_english",
  dayNumber: 7,
  audioItems: [
    {
      id: "audio_p1",
      type: "Podcast",
      title: "The Daily: Decoded",
      artist: "NYT",
      durationSec: 600,
      url: "spotify:podcast:xyz",
      clipStartSec: 300,
      clipEndSec: 420
    },
    {
      id: "audio_s1",
      type: "Song",
      title: "Work Song",
      artist: "Hozier",
      durationSec: 240,
      url: "spotify:track:xyz1"
    },
    {
      id: "audio_s2",
      type: "Song",
      title: "Vienna",
      artist: "Billy Joel",
      durationSec: 235,
      url: "spotify:track:xyz2"
    }
  ],
  lessonSheetId: "ls_001_eng"
};

export const MOCK_LESSON: LessonSheet = {
  id: "ls_001_eng",
  aiSummary: "Today's session focused on resilience and steady progress. 'Vienna' reminds us to slow down, while 'Work Song' explores dedication. The podcast clip discussed the etymology of 'Perseverance'.",
  vocabulary: [
    { word: "Perseverance", definition: "Persistence in doing something despite difficulty or delay in achieving success." },
    { word: "Ambiguous", definition: "Open to more than one interpretation; having a double meaning." },
    { word: "Meticulous", definition: "Showing great attention to detail; very careful and precise." }
  ],
  quizId: "quiz_001_eng"
};

export const MOCK_QUIZ: Quiz = {
  id: "quiz_001_eng",
  packId: "pack_001_eng",
  questions: [
    {
      q: "Based on the podcast, what is a synonym for 'Perseverance'?",
      options: ["Apathy", "Determination", "Hesitation"],
      correctIndex: 1
    },
    {
      q: "Which song encourages taking your time?",
      options: ["Work Song", "Vienna", "The Daily"],
      correctIndex: 1
    },
    {
      q: "What does 'Meticulous' mean?",
      options: ["Careless", "Fast", "Precise"],
      correctIndex: 2
    }
  ]
};