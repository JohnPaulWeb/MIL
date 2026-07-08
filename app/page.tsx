'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function Page() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Misinformation Detector</h1>
          <p className="text-gray-600 mb-8">
            Train your critical thinking skills and detect misinformation in real-time across the web.
          </p>
          <div className="space-y-3">
            <Link href="/auth/sign-up" className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Link>
            <Link href="/auth/login" className="block">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Misinformation Detector</h1>
          <div className="text-sm text-gray-600">
            Welcome, <span className="font-semibold">{user?.email}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Arena Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <div className="text-blue-600 text-4xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Arena</h2>
            <p className="text-gray-600 mb-6">
              Test your skills in our training game. Predict whether headlines are true or false and
              learn to spot misinformation patterns.
            </p>
            <Link href="/arena">
              <Button className="bg-blue-600 hover:bg-blue-700 w-full">Play Now</Button>
            </Link>
          </div>

          {/* Dashboard Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <div className="text-green-600 text-4xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Dashboard</h2>
            <p className="text-gray-600 mb-6">
              View your progress, accuracy statistics, and compete on the leaderboard. Track your
              improvement over time.
            </p>
            <Link href="/dashboard">
              <Button className="bg-green-600 hover:bg-green-700 w-full">View Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Stats Preview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
            <p className="text-gray-600">Training Claims</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
            <p className="text-gray-600">Active Players</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
            <p className="text-gray-600">Average Accuracy</p>
          </div>
        </div>
      </main>
    </div>
  );
}
