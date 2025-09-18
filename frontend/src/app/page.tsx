'use client';

import { useGame } from '@/contexts/GameContext';
import HomePage from '@/components/HomePage';
import Lobby from '@/components/Lobby';
import QuestionView from '@/components/QuestionView';
import Leaderboard from '@/components/Leaderboard';

export default function Home() {
  const { game, currentQuestion, showingResults } = useGame();

  // Não tem jogo ativo - mostrar tela inicial
  if (!game) {
    return <HomePage />;
  }

  // Jogo em espera - mostrar lobby
  if (game.status === 'waiting') {
    return <Lobby />;
  }

  // Jogo finalizado - sempre mostrar leaderboard final
  if (game.status === 'finished') {
    return <Leaderboard />;
  }

  // Jogo em andamento
  if (game.status === 'playing') {
    // Se está mostrando resultados = mostrar leaderboard
    if (showingResults) {
      return <Leaderboard />;
    }
    // Se tem pergunta atual = mostrar pergunta
    if (currentQuestion) {
      return <QuestionView />;
    }
  }

  // Fallback - mostrar lobby
  return <Lobby />;
}
