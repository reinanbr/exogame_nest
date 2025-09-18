'use client';

import { useGame } from '@/contexts/GameContext';
import PlayerHeader from './PlayerHeader';

export default function Lobby() {
  const { game, player, isHost, startGame } = useGame();

  if (!game || !player) {
    return null;
  }

  return (
    <div>
      <PlayerHeader />
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center p-4 pt-20">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Sala de Espera</h1>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Código do Jogo</p>
              <p className="text-3xl font-bold text-purple-600 font-mono tracking-wider">{game.id}</p>
            </div>
            <p className="text-gray-600">Compartilhe o código com outros jogadores</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Jogadores ({game.players.length})
            </h2>
            <div className="space-y-2">
              {game.players.map((p) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    p.isHost ? 'bg-yellow-100 border-2 border-yellow-300' : 'bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      p.isHost ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <span className="font-medium text-gray-800">{p.name}</span>
                  </div>
                  {p.isHost && (
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                      HOST
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {isHost && (
            <div className="text-center">
              <button
                onClick={startGame}
                disabled={game.players.length < 2}
                className={`px-8 py-3 rounded-lg font-bold text-white transition duration-200 ${
                  game.players.length >= 2
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {game.players.length >= 2 ? 'Iniciar Jogo' : 'Aguardando mais jogadores...'}
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Mínimo de 2 jogadores para iniciar
              </p>
            </div>
          )}

          {!isHost && (
            <div className="text-center">
              <div className="animate-pulse">
                <div className="inline-flex items-center text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></div>
                  Aguardando o host iniciar o jogo...
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Como jogar:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Responda as perguntas o mais rápido possível</li>
              <li>• Pontos são dados por respostas corretas e velocidade</li>
              <li>• O jogador com mais pontos vence!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
