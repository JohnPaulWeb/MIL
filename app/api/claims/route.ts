import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const limit = req.nextUrl.searchParams.get('limit') || '10';

    // Get training claims
    const { data: claims, error } = await supabase
      .from('claims')
      .select('*')
      .eq('is_arena_training', true)
      .limit(parseInt(limit));

    if (error) {
      console.error('Error fetching claims:', error);
      return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 });
    }

    return NextResponse.json({ claims });
  } catch (error) {
    console.error('Error in GET /api/claims:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
