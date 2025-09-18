'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import PlayerHeader from './PlayerHeader';

export default function QuestionView() {
  const { currentQuestion, submitAnswer, isHost, showResults, game } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (currentQuestion && game?.currentQuestionStartTime) {
      setHasAnswered(false);
      setSelectedAnswer(null);
      setTimeLeft(currentQuestion.timeLimit);

      const startTime = new Date(game.currentQuestionStartTime).getTime();
      const timer = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        const remaining = Math.max(0, currentQuestion.timeLimit - elapsed);
        
        setTimeLeft(remaining);
        
        if (remaining === 0) {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestion, game?.currentQuestionStartTime]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (hasAnswered || timeLeft === 0 || !currentQuestion) return;
    
    setSelectedAnswer(answerIndex);
    setHasAnswered(true);
    submitAnswer(currentQuestion.id, answerIndex);
  };

  if (!currentQuestion) {
    return null;
  }

  const progressPercentage = (timeLeft / currentQuestion.timeLimit) * 100;

  return (
    <div>
      <PlayerHeader />
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 flex flex-col justify-center p-4 pt-20">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-4xl mx-auto">
          {/* Timer */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Tempo restante</span>
              <span className="text-2xl font-bold text-purple-600">{timeLeft}s</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${
                  timeLeft > 5 ? 'bg-green-500' : timeLeft > 2 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {currentQuestion.text}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentQuestion.options.map((option, index) => {
              const colors = [
                'from-red-400 to-red-600',
                'from-blue-400 to-blue-600',
                'from-yellow-400 to-yellow-600',
                'from-green-400 to-green-600',
              ];

              const isSelected = selectedAnswer === index;
              const isDisabled = hasAnswered || timeLeft === 0;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isDisabled}
                  className={`p-6 rounded-lg text-white font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
                    isSelected
                      ? `bg-gradient-to-r ${colors[index]} ring-4 ring-white ring-opacity-50 scale-105`
                      : `bg-gradient-to-r ${colors[index]} hover:shadow-lg`
                  } ${
                    isDisabled && !isSelected ? 'opacity-50 cursor-not-allowed transform-none' : ''
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <span className="mr-3 text-2xl font-black">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Status */}
          <div className="text-center">
            {hasAnswered && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                ✅ Resposta enviada! Aguardando outros jogadores...
              </div>
            )}
            
            {timeLeft === 0 && !hasAnswered && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                ⏰ Tempo esgotado!
              </div>
            )}

            {isHost && (
              <button
                onClick={showResults}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
              >
                Mostrar Resultados
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
