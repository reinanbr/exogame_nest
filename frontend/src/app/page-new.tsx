'use client';

import { useGame } from '@/contexts/GameContext';
import HomePage from '@/components/HomePage';
import Lobby from '@/components/Lobby';
import QuestionView from '@/components/QuestionView';
import Leaderboard from '@/components/Leaderboard';

export default function Home() {
  const { game, currentQuestion, leaderboard } = useGame();

  // Não tem jogo ativo - mostrar tela inicial
  if (!game) {
    return <HomePage />;
  }

  // Jogo em espera - mostrar lobby
  if (game.status === 'waiting') {
    return <Lobby />;
  }

  // Jogo em andamento com pergunta atual - mostrar pergunta
  if (game.status === 'playing' && currentQuestion && leaderboard.length === 0) {
    return <QuestionView />;
  }

  // Mostrar resultados/leaderboard
  return <Leaderboard />;
}
