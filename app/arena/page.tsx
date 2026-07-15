'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { isDevAuthEnabled } from '@/lib/auth/dev-auth';
import { MOCK_CLAIMS } from '@/lib/mock/data';
import { useAuthStore, useArenaStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { Claim } from '@/lib/types';

export default function ArenaPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { currentClaimIndex, score, recordAnswer, incrementScore, reset } = useArenaStore();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (isDevAuthEnabled()) {
      setClaims(MOCK_CLAIMS);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    supabase
      .from('claims')
      .select('*')
      .eq('is_arena_training', true)
      .limit(20)
      .then(({ data }) => {
        if (data) {
          setClaims(data);
        }
        setLoading(false);
      });
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (claims.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No claims available</h1>
          <Button onClick={() => router.push('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const currentClaim = claims[currentClaimIndex];

  const handleSubmitAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === currentClaim.correct_answer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      incrementScore();
    }

    if (!isDevAuthEnabled() && user) {
      const supabase = createClient();
      supabase.from('user_predictions').insert({
        user_id: user.id,
        claim_id: currentClaim.id,
        user_prediction: answer,
        is_correct: correct,
      });
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowResult(false);

    if (currentClaimIndex < claims.length - 1) {
      // Move to next claim
      const nextIndex = currentClaimIndex + 1;
      useArenaStore.setState({ currentClaimIndex: nextIndex });
    } else {
      // Game over
      router.push(`/arena/results?score=${score}&total=${claims.length}`);
    }
  };

  const progress = ((currentClaimIndex + 1) / claims.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Arena Training</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm font-semibold text-gray-600">
              Score: <span className="text-blue-600">{score}</span>
            </div>
            <Button variant="outline" onClick={() => router.push('/')}>
              Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Question {currentClaimIndex + 1} of {claims.length}</span>
            <span className="text-sm font-semibold text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Claim */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentClaim.content}</h2>
            {currentClaim.source && (
              <p className="text-sm text-gray-600">Source: {currentClaim.source}</p>
            )}
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {['true', 'partially_true', 'false', 'unclear'].map((option) => (
              <button
                key={option}
                onClick={() => !showResult && handleSubmitAnswer(option)}
                disabled={showResult}
                className={`w-full p-4 rounded-lg border-2 text-left font-semibold transition ${
                  selectedAnswer === option
                    ? isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : showResult && option === currentClaim.correct_answer
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-blue-400 bg-white'
                } ${showResult ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="capitalize">{option.replace('_', ' ')}</span>
                  {showResult && (
                    <>
                      {option === currentClaim.correct_answer && (
                        <span className="text-green-600">✓</span>
                      )}
                      {selectedAnswer === option && !isCorrect && (
                        <span className="text-red-600">✗</span>
                      )}
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Result Message & Next Button */}
          {showResult && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className={`text-lg font-semibold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
              </p>
              {currentClaim.source && (
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold">Source:</span> {currentClaim.source}
                </p>
              )}
              <Button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700">
                {currentClaimIndex === claims.length - 1 ? 'See Results' : 'Next Question'}
              </Button>
            </div>
          )}

          {!showResult && (
            <Button
              onClick={() => handleSubmitAnswer(selectedAnswer || 'unclear')}
              disabled={!selectedAnswer}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              Submit Answer
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
