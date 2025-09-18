'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import AvatarSelector from './AvatarSelector';

export default function HomePage() {
  const [hostName, setHostName] = useState('');
  const [gameId, setGameId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🐻');
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  
  const { createGame, joinGame, isConnected } = useGame();

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (hostName.trim()) {
      createGame(hostName.trim(), selectedAvatar);
    }
  };

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameId.trim() && playerName.trim()) {
      joinGame(gameId.trim().toUpperCase(), playerName.trim(), selectedAvatar);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Conectando ao servidor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">ExoGame</h1>
          <p className="text-gray-600">Quiz em tempo real estilo Kahoot</p>
        </div>

        {mode === 'menu' && (
          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              Criar Jogo
            </button>
            <button
              onClick={() => setMode('join')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              Entrar em Jogo
            </button>
          </div>
        )}

        {mode === 'create' && (
          <form onSubmit={handleCreateGame} className="space-y-4">
            <div>
              <label htmlFor="hostName" className="block text-sm font-medium text-gray-700 mb-1">
                Seu Nome
              </label>
              <input
                type="text"
                id="hostName"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Digite seu nome"
                required
              />
            </div>
            
            <AvatarSelector 
              selectedAvatar={selectedAvatar}
              onAvatarSelect={setSelectedAvatar}
            />
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setMode('menu')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded transition duration-200"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                Criar
              </button>
            </div>
          </form>
        )}

        {mode === 'join' && (
          <form onSubmit={handleJoinGame} className="space-y-4">
            <div>
              <label htmlFor="gameId" className="block text-sm font-medium text-gray-700 mb-1">
                Código do Jogo
              </label>
              <input
                type="text"
                id="gameId"
                value={gameId}
                onChange={(e) => setGameId(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="CÓDIGO"
                maxLength={6}
                required
              />
            </div>
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
                Seu Nome
              </label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite seu nome"
                required
              />
            </div>
            
            <AvatarSelector 
              selectedAvatar={selectedAvatar}
              onAvatarSelect={setSelectedAvatar}
            />
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setMode('menu')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded transition duration-200"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                Entrar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
