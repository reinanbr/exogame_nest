'use client';

import { useGame } from '@/contexts/GameContext';

export default function PlayerHeader() {
  const { player, game } = useGame();

  if (!player || !game) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-2xl mr-3">{player.avatar || '🐻'}</div>
          <div className={`w-3 h-3 rounded-full mr-3 ${
            player.isHost ? 'bg-yellow-500' : 'bg-green-500'
          }`}></div>
          <span className="font-semibold text-gray-800 text-lg">{player.name}</span>
          <span className="ml-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            {player.score.toLocaleString()} pts
          </span>
          {player.isHost && (
            <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
              HOST
            </span>
          )}
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-600">Código da Sala</p>
          <p className="font-bold text-purple-600 font-mono text-lg">{game.id}</p>
        </div>
      </div>
    </div>
  );
}
