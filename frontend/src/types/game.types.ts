export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer?: number;
  timeLimit: number;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
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
  
  // Actions
  createGame: (hostName: string) => void;
  joinGame: (gameId: string, playerName: string) => void;
  startGame: () => void;
  nextQuestion: () => void;
  submitAnswer: (questionId: string, answer: number) => void;
  showResults: () => void;
}
