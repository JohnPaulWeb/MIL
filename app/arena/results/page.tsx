'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get('score') || '0');
  const total = parseInt(searchParams.get('total') || '0');
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const getGrade = (percentage: number): { grade: string; color: string; message: string } => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', message: 'Outstanding!' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600', message: 'Excellent!' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-600', message: 'Good job!' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-600', message: 'Keep practicing!' };
    return { grade: 'D', color: 'text-red-600', message: 'Try again!' };
  };

  const { grade, color, message } = getGrade(percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Game Over!</h1>

        <div className={`text-6xl font-bold ${color} mb-4`}>{grade}</div>

        <div className="mb-6">
          <p className="text-4xl font-bold text-gray-900 mb-2">
            {score}/{total}
          </p>
          <p className="text-2xl font-semibold text-gray-700 mb-4">{percentage}%</p>
          <p className="text-lg text-gray-600">{message}</p>
        </div>

        {/* Feedback */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-600">
            {percentage >= 80
              ? '🌟 You have a strong grasp on detecting misinformation!'
              : percentage >= 60
              ? '💡 Keep practicing to improve your accuracy!'
              : '🎯 Study more about common misinformation tactics and try again!'}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/arena" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Play Again</Button>
          </Link>
          <Link href="/dashboard" className="block">
            <Button variant="outline" className="w-full">
              View Dashboard
            </Button>
          </Link>
          <Link href="/" className="block">
            <Button variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
