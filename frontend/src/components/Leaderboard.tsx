'use client';

import { useGame } from '@/contexts/GameContext';

export default function Leaderboard() {
  const { leaderboard, isHost, nextQuestion, game, currentQuestion } = useGame();

  const isGameFinished = game?.status === 'finished';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isGameFinished ? '🏆 Resultado Final' : '📊 Placar Atual'}
          </h1>
          {currentQuestion && (
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Pergunta:</p>
              <p className="font-semibold text-gray-800">{currentQuestion.text}</p>
              {currentQuestion.correctAnswer !== undefined && (
                <p className="text-sm text-green-600 mt-2">
                  ✅ Resposta correta: {String.fromCharCode(65 + currentQuestion.correctAnswer)} - {currentQuestion.options[currentQuestion.correctAnswer]}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3 mb-8">
          {leaderboard.map((player, index) => {
            const isWinner = index === 0 && isGameFinished;
            const medalEmojis = ['🥇', '🥈', '🥉'];
            
            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  isWinner
                    ? 'bg-gradient-to-r from-yellow-200 to-yellow-300 border-2 border-yellow-400'
                    : index < 3
                    ? 'bg-gray-100 border border-gray-300'
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 ${
                    index < 3 ? 'bg-white' : 'bg-gray-300'
                  }`}>
                    {index < 3 ? (
                      <span className="text-lg">{medalEmojis[index]}</span>
                    ) : (
                      <span className="font-bold text-gray-600">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold ${isWinner ? 'text-yellow-800' : 'text-gray-800'}`}>
                      {player.name}
                      {player.isHost && (
                        <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                          HOST
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${isWinner ? 'text-yellow-800' : 'text-purple-600'}`}>
                    {player.score.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">pontos</p>
                </div>
              </div>
            );
          })}
        </div>

        {isHost && !isGameFinished && (
          <div className="text-center">
            <button
              onClick={nextQuestion}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
            >
              Próxima Pergunta
            </button>
          </div>
        )}

        {isGameFinished && (
          <div className="text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              🎉 Jogo finalizado! Obrigado por jogar!
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
            >
              Jogar Novamente
            </button>
          </div>
        )}

        {!isHost && !isGameFinished && (
          <div className="text-center">
            <div className="animate-pulse">
              <div className="inline-flex items-center text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></div>
                Aguardando próxima pergunta...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
