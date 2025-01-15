export interface Progress {
  userId: string;
  type: ProgressType;
  referenceId: string;
  data: LessonProgress | GameProgress | ExamProgress;
}

export enum ProgressType {
  LESSON = 'lesson',
  GAME = 'game',
  EXAM = 'exam',
}

export interface LessonProgress {
  currentPage: number;
  totalPages: number;
  timeSpent: number;
  lastAccessed: Date;
}

export interface GameProgress {
  level: number;
  points: number;
  achievements: string[];
  bestScore: number;
}

export interface ExamProgress {
  answers: {
    questionId: string;
    selectedOption: string;
    isCorrect: boolean;
  }[];
  timeSpent: number;
  attempts: number;
}