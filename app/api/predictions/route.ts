import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { claimId, userPrediction } = await req.json();

    if (!claimId || !userPrediction) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the claim to check correct answer
    const { data: claim, error: claimError } = await supabase
      .from('claims')
      .select('correct_answer')
      .eq('id', claimId)
      .single();

    if (claimError || !claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    const isCorrect = userPrediction.toLowerCase() === claim.correct_answer.toLowerCase();

    // Insert or update prediction
    const { data: prediction, error: predictionError } = await supabase
      .from('user_predictions')
      .upsert({
        user_id: user.id,
        claim_id: claimId,
        user_prediction: userPrediction,
        is_correct: isCorrect,
      }, {
        onConflict: 'user_id,claim_id',
      })
      .select()
      .single();

    if (predictionError) {
      return NextResponse.json({ error: 'Failed to save prediction' }, { status: 500 });
    }

    // Update user profile score
    if (isCorrect) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('correct_predictions, total_predictions')
        .eq('id', user.id)
        .single();

      if (profile) {
        const newCorrect = (profile.correct_predictions || 0) + 1;
        const newTotal = (profile.total_predictions || 0) + 1;
        const accuracy = (newCorrect / newTotal) * 100;

        await supabase
          .from('profiles')
          .update({
            correct_predictions: newCorrect,
            total_predictions: newTotal,
            accuracy_rate: accuracy,
            score: (profile?.score || 0) + 10,
          })
          .eq('id', user.id);
      }
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_predictions')
        .eq('id', user.id)
        .single();

      if (profile) {
        const newTotal = (profile.total_predictions || 0) + 1;
        await supabase
          .from('profiles')
          .update({
            total_predictions: newTotal,
          })
          .eq('id', user.id);
      }
    }

    return NextResponse.json({ prediction, isCorrect });
  } catch (error) {
    console.error('Error in POST /api/predictions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: predictions, error } = await supabase
      .from('user_predictions')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch predictions' }, { status: 500 });
    }

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error('Error in GET /api/predictions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
