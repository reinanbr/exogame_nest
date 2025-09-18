export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer?: number;
  correctAnswerContext?: string;
  timeLimit: number;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
  avatar: string;
}

export interface AnswerStats {
  total: number;
  answered: number;
  pending: number;
}

export interface Game {
  id: string;
  hostId: string;
  players: Player[];
  questions: Question[];
  currentQuestionIndex: number;
  status: 'waiting' | 'playing' | 'finished';
  currentQuestionStartTime?: Date;
}

export interface GameContextType {
  game: Game | null;
  player: Player | null;
  currentQuestion: Question | null;
  isConnected: boolean;
  isHost: boolean;
  leaderboard: Player[];
  showingResults: boolean;
  answerStats: AnswerStats | null;
  
  // Actions
  createGame: (hostName: string, avatar?: string) => void;
  joinGame: (gameId: string, playerName: string, avatar?: string) => void;
  startGame: () => void;
  nextQuestion: () => void;
  submitAnswer: (questionId: string, answer: number) => void;
  showResults: () => void;
}
