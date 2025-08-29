'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Game, Player, Question, GameContextType } from '@/types/game.types';

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);

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
    });

    newSocket.on('nextQuestion', (data: { game: Game; currentQuestion: Question }) => {
      setGame(data.game);
      setCurrentQuestion(data.currentQuestion);
    });

    newSocket.on('questionResults', (data: { question: Question; leaderboard: Player[] }) => {
      setCurrentQuestion(data.question);
      setLeaderboard(data.leaderboard);
    });

    newSocket.on('gameFinished', (data: { game: Game; leaderboard: Player[] }) => {
      setGame(data.game);
      setLeaderboard(data.leaderboard);
      setCurrentQuestion(null);
    });

    newSocket.on('answerSubmitted', () => {
      console.log('Resposta enviada com sucesso');
    });

    newSocket.on('error', (data: { message: string }) => {
      console.error('Erro:', data.message);
      alert(data.message);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const createGame = useCallback((hostName: string) => {
    if (socket) {
      socket.emit('createGame', { hostName });
    }
  }, [socket]);

  const joinGame = useCallback((gameId: string, playerName: string) => {
    if (socket) {
      socket.emit('joinGame', { gameId, playerName });
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
