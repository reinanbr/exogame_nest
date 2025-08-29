export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number; // em segundos
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

export interface PlayerAnswer {
  playerId: string;
  questionId: string;
  answer: number;
  answeredAt: Date;
}
