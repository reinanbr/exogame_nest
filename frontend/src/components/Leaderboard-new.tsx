'use client';

import { useGame } from '@/contexts/GameContext';
import PlayerHeader from './PlayerHeader';

export default function Leaderboard() {
  const { leaderboard, isHost, nextQuestion, game, currentQuestion } = useGame();

  const isGameFinished = game?.status === 'finished';

  const handlePrint = () => {
    // Criar uma nova janela com apenas o conteúdo do leaderboard
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>ExoGame - Resultado Final</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              background: white;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #8B5CF6;
              padding-bottom: 20px;
            }
            .game-info {
              text-align: center;
              margin-bottom: 30px;
              font-size: 14px;
              color: #666;
            }
            .trophy {
              font-size: 48px;
              margin-bottom: 10px;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              color: #8B5CF6;
              margin-bottom: 10px;
            }
            .subtitle {
              font-size: 16px;
              color: #666;
            }
            .leaderboard {
              max-width: 600px;
              margin: 0 auto;
            }
            .player-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 15px 20px;
              margin-bottom: 10px;
              border-radius: 8px;
              border: 1px solid #ddd;
            }
            .winner {
              background: linear-gradient(135deg, #FEF3C7, #FDE68A);
              border-color: #F59E0B;
              font-weight: bold;
            }
            .medal {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 15px;
              background: white;
              font-size: 18px;
            }
            .player-info {
              display: flex;
              align-items: center;
              flex: 1;
            }
            .player-name {
              font-size: 18px;
              font-weight: 600;
            }
            .host-badge {
              margin-left: 10px;
              background: #DBEAFE;
              color: #1E40AF;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: bold;
            }
            .score {
              font-size: 20px;
              font-weight: bold;
              color: #8B5CF6;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #999;
            }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="trophy">🏆</div>
            <div class="title">ExoGame - Resultado Final</div>
            <div class="subtitle">Jogo de Perguntas e Respostas</div>
          </div>
          
          <div class="game-info">
            <p><strong>Código do Jogo:</strong> ${game?.id || 'N/A'}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
            <p><strong>Total de Jogadores:</strong> ${leaderboard.length}</p>
          </div>

          <div class="leaderboard">
            ${leaderboard.map((player, index) => {
              const isWinner = index === 0;
              const medalEmojis = ['🥇', '🥈', '🥉'];
              
              return `
                <div class="player-row ${isWinner ? 'winner' : ''}">
                  <div class="player-info">
                    <div class="medal">
                      ${index < 3 ? medalEmojis[index] : index + 1}
                    </div>
                    <div>
                      <span class="player-name">${player.name}</span>
                      ${player.isHost ? '<span class="host-badge">HOST</span>' : ''}
                    </div>
                  </div>
                  <div class="score">${player.score.toLocaleString()} pts</div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="footer">
            <p>Gerado pelo ExoGame em ${new Date().toLocaleString('pt-BR')}</p>
            <p>Obrigado por jogar! 🎮</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Aguardar o carregamento e imprimir
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div>
      <PlayerHeader />
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center p-4 pt-20">
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
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handlePrint}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg transition duration-200 flex items-center"
                >
                  🖨️ Imprimir Resultado
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
                >
                  Jogar Novamente
                </button>
              </div>
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
    </div>
  );
}
