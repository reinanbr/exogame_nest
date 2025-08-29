import { Injectable } from '@nestjs/common';
import { Game, Player, Question, PlayerAnswer } from '../interfaces/game.interface';
import { QuestionService } from '../question/question.service';
import { PlayerService } from '../player/player.service';

@Injectable()
export class GameService {
  private games: Map<string, Game> = new Map();
  private playerAnswers: Map<string, PlayerAnswer[]> = new Map();

  constructor(
    private questionService: QuestionService,
    private playerService: PlayerService,
  ) {}

  createGame(hostId: string, hostName: string): Game {
    const gameId = this.generateGameId();
    const host = this.playerService.createPlayer(hostId, hostName, true);
    const questions = this.questionService.getRandomQuestions(5);

    const game: Game = {
      id: gameId,
      hostId,
      players: [host],
      questions,
      currentQuestionIndex: -1,
      status: 'waiting',
    };

    this.games.set(gameId, game);
    this.playerAnswers.set(gameId, []);
    return game;
  }

  joinGame(gameId: string, playerId: string, playerName: string): { game: Game; player: Player } | null {
    const game = this.games.get(gameId);
    if (!game || game.status !== 'waiting') {
      return null;
    }

    const player = this.playerService.createPlayer(playerId, playerName);
    game.players.push(player);
    this.games.set(gameId, game);

    return { game, player };
  }

  startGame(gameId: string, hostId: string): Game | null {
    const game = this.games.get(gameId);
    if (!game || game.hostId !== hostId || game.status !== 'waiting') {
      return null;
    }

    game.status = 'playing';
    game.currentQuestionIndex = 0;
    game.currentQuestionStartTime = new Date();
    this.games.set(gameId, game);

    return game;
  }

  nextQuestion(gameId: string, hostId: string): Game | null {
    const game = this.games.get(gameId);
    if (!game || game.hostId !== hostId || game.status !== 'playing') {
      return null;
    }

    game.currentQuestionIndex++;
    if (game.currentQuestionIndex >= game.questions.length) {
      game.status = 'finished';
    } else {
      game.currentQuestionStartTime = new Date();
    }

    this.games.set(gameId, game);
    return game;
  }

  submitAnswer(gameId: string, playerId: string, questionId: string, answer: number): boolean {
    const game = this.games.get(gameId);
    if (!game || game.status !== 'playing') {
      return false;
    }

    const currentQuestion = game.questions[game.currentQuestionIndex];
    if (!currentQuestion || currentQuestion.id !== questionId) {
      return false;
    }

    const playerAnswer: PlayerAnswer = {
      playerId,
      questionId,
      answer,
      answeredAt: new Date(),
    };

    const gameAnswers = this.playerAnswers.get(gameId) || [];
    
    // Verifica se o jogador já respondeu esta pergunta
    const existingAnswerIndex = gameAnswers.findIndex(
      a => a.playerId === playerId && a.questionId === questionId
    );

    if (existingAnswerIndex >= 0) {
      return false; // Já respondeu
    }

    gameAnswers.push(playerAnswer);
    this.playerAnswers.set(gameId, gameAnswers);

    // Calcula pontuação se a resposta estiver correta
    if (answer === currentQuestion.correctAnswer) {
      const timeTaken = (new Date().getTime() - game.currentQuestionStartTime!.getTime()) / 1000;
      const timeBonus = Math.max(0, currentQuestion.timeLimit - timeTaken);
      const points = Math.round(1000 + (timeBonus * 10));
      this.playerService.updatePlayerScore(playerId, points);
    }

    return true;
  }

  getGame(gameId: string): Game | undefined {
    return this.games.get(gameId);
  }

  getGameAnswers(gameId: string): PlayerAnswer[] {
    return this.playerAnswers.get(gameId) || [];
  }

  getCurrentQuestion(gameId: string): Question | null {
    const game = this.games.get(gameId);
    if (!game || game.currentQuestionIndex < 0 || game.currentQuestionIndex >= game.questions.length) {
      return null;
    }
    return game.questions[game.currentQuestionIndex];
  }

  getLeaderboard(gameId: string): Player[] {
    const game = this.games.get(gameId);
    if (!game) {
      return [];
    }
    return [...game.players].sort((a, b) => b.score - a.score);
  }

  private generateGameId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
