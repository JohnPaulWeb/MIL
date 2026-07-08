import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const limit = req.nextUrl.searchParams.get('limit') || '20';

    const { data: leaderboard, error } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url, score, accuracy_rate, total_predictions')
      .order('score', { ascending: false })
      .limit(parseInt(limit));

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Error in GET /api/leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
