'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { isDevAuthEnabled, signOutDevAuth } from '@/lib/auth/dev-auth';
import { MOCK_LEADERBOARD } from '@/lib/mock/data';
import { useAuthStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { LeaderboardEntry } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (isDevAuthEnabled()) {
      setLeaderboard(MOCK_LEADERBOARD);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    supabase
      .from('profiles')
      .select('*')
      .order('score', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) {
          setLeaderboard(
            data.map((profile, index) => ({
              ...profile,
              rank: index + 1,
            }))
          );
        }
        setLoading(false);
      });
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const userRank = leaderboard.findIndex((entry) => entry.id === user?.id) + 1 || 'N/A';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Link href="/">
            <Button variant="outline">Back Home</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Display Name</p>
            <p className="text-2xl font-bold text-gray-900">{profile?.display_name || 'Player'}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Current Score</p>
            <p className="text-2xl font-bold text-blue-600">{profile?.score || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Accuracy Rate</p>
            <p className="text-2xl font-bold text-green-600">{profile?.accuracy_rate?.toFixed(1) || 0}%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Your Rank</p>
            <p className="text-2xl font-bold text-purple-600">
              {typeof userRank === 'number' ? `#${userRank}` : userRank}
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Performance</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Predictions</span>
                  <span className="font-semibold text-gray-900">{profile?.total_predictions || 0}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Correct Predictions</span>
                  <span className="font-semibold text-green-600">{profile?.correct_predictions || 0}</span>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">{profile?.accuracy_rate?.toFixed(1) || 0}%</p>
                <p className="text-sm text-gray-600">Accuracy Rate</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/arena" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Play Arena
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  if (isDevAuthEnabled()) {
                    signOutDevAuth();
                    useAuthStore.getState().setUser(null);
                    useAuthStore.getState().setProfile(null);
                  } else {
                    const supabase = createClient();
                    supabase.auth.signOut();
                  }
                  router.push('/auth/login');
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Players</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Player</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Score</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr
                    key={entry.id}
                    className={`border-b hover:bg-gray-50 ${
                      entry.id === user?.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900">#{entry.rank}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-gray-900">{entry.display_name}</p>
                        <p className="text-xs text-gray-500">{entry.username}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-blue-600">{entry.score}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-green-600">
                        {entry.accuracy_rate?.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
