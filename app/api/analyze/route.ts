import { NextRequest, NextResponse } from 'next/server';
import { analyzeClaimWithGemini } from '@/lib/gemini';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { claim, claimId } = await request.json();

    if (!claim) {
      return NextResponse.json({ error: 'Claim is required' }, { status: 400 });
    }

    // Analyze with Gemini
    const analysis = await analyzeClaimWithGemini(claim);

    // Get current user from Supabase
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Store result in database
    const { data: result, error } = await supabase
      .from('verification_results')
      .insert({
        claim_id: claimId || null,
        user_id: user.id,
        prediction: analysis.prediction,
        confidence_score: analysis.confidence_score,
        reasoning: analysis.reasoning,
        sources: analysis.sources,
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing result:', error);
      return NextResponse.json(
        { error: 'Failed to store result' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      result: {
        id: result.id,
        ...analysis,
      },
    });
  } catch (error) {
    console.error('Error analyzing claim:', error);
    return NextResponse.json(
      { error: 'Failed to analyze claim' },
      { status: 500 }
    );
  }
}
