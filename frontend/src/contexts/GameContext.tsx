'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Game, Player, Question, GameContextType, AnswerStats } from '@/types/game.types';

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [showingResults, setShowingResults] = useState(false);
  const [answerStats, setAnswerStats] = useState<AnswerStats | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Conectado ao servidor');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Desconectado do servidor');
    });

    newSocket.on('gameCreated', (data: { game: Game; playerId: string }) => {
      setGame(data.game);
      const hostPlayer = data.game.players.find(p => p.id === data.playerId);
      if (hostPlayer) {
        setPlayer(hostPlayer);
      }
    });

    newSocket.on('gameJoined', (data: { game: Game; player: Player }) => {
      setGame(data.game);
      setPlayer(data.player);
    });

    newSocket.on('playerJoined', (data: { player: Player; game: Game }) => {
      setGame(data.game);
    });

    newSocket.on('gameStarted', (data: { game: Game; currentQuestion: Question }) => {
      setGame(data.game);
      setCurrentQuestion(data.currentQuestion);
      setLeaderboard([]); // Limpar leaderboard ao iniciar
      setShowingResults(false);
      setAnswerStats(null); // Resetar estatísticas
    });

    newSocket.on('nextQuestion', (data: { game: Game; currentQuestion: Question }) => {
      console.log('Nova pergunta recebida:', data);
      setGame(data.game);
      setCurrentQuestion(data.currentQuestion);
      setLeaderboard([]); // Limpar leaderboard para nova pergunta
      setShowingResults(false);
      setAnswerStats(null); // Resetar estatísticas para nova pergunta
    });

    newSocket.on('answerStatsUpdated', (data: { stats: AnswerStats; questionId: string }) => {
      console.log('Estatísticas de respostas atualizadas:', data);
      setAnswerStats(data.stats);
    });

    newSocket.on('questionResults', (data: { question: Question; leaderboard: Player[] }) => {
      console.log('Resultados recebidos:', data);
      setCurrentQuestion(data.question);
      setLeaderboard(data.leaderboard);
      setShowingResults(true);
    });

    newSocket.on('gameFinished', (data: { game: Game; leaderboard: Player[] }) => {
      setGame(data.game);
      setLeaderboard(data.leaderboard);
      setCurrentQuestion(null);
    });

    newSocket.on('answerSubmitted', () => {
      console.log('Resposta enviada com sucesso');
    });

    newSocket.on('error', (data: { message: string; type?: string }) => {
      console.error('Erro:', data.message);
      
      if (data.type === 'ROOM_NOT_FOUND') {
        alert('⚠️ Sala não encontrada!\n\nO código da sala informado não existe ou a partida já foi iniciada. Verifique o código e tente novamente.');
      } else {
        alert(data.message);
      }
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const createGame = useCallback((hostName: string, avatar?: string) => {
    if (socket) {
      socket.emit('createGame', { hostName, avatar });
    }
  }, [socket]);

  const joinGame = useCallback((gameId: string, playerName: string, avatar?: string) => {
    if (socket) {
      socket.emit('joinGame', { gameId, playerName, avatar });
    }
  }, [socket]);

  const startGame = useCallback(() => {
    if (socket && game) {
      socket.emit('startGame', { gameId: game.id });
    }
  }, [socket, game]);

  const nextQuestion = useCallback(() => {
    if (socket && game) {
      socket.emit('nextQuestion', { gameId: game.id });
    }
  }, [socket, game]);

  const submitAnswer = useCallback((questionId: string, answer: number) => {
    if (socket) {
      socket.emit('submitAnswer', { questionId, answer });
    }
  }, [socket]);

  const showResults = useCallback(() => {
    if (socket && game) {
      socket.emit('showResults', { gameId: game.id });
    }
  }, [socket, game]);

  const isHost = player?.isHost || false;

  const value: GameContextType = {
    game,
    player,
    currentQuestion,
    isConnected,
    isHost,
    leaderboard,
    showingResults,
    answerStats,
    createGame,
    joinGame,
    startGame,
    nextQuestion,
    submitAnswer,
    showResults,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
