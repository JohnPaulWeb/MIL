import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const SAMPLE_CLAIMS = [
  {
    content: 'The Great Wall of China is visible from space with the naked eye',
    source: 'NASA Scientific Fact Check',
    is_arena_training: true,
    correct_answer: 'false',
  },
  {
    content: 'COVID-19 vaccines contain microchips for tracking',
    source: 'Health Organization Debunking',
    is_arena_training: true,
    correct_answer: 'false',
  },
  {
    content: 'The Earth orbits around the Sun',
    source: 'NASA',
    is_arena_training: true,
    correct_answer: 'true',
  },
  {
    content: '5G networks were designed to spread diseases',
    source: 'Fact Checker Database',
    is_arena_training: true,
    correct_answer: 'false',
  },
  {
    content: 'Honey never spoils and can last thousands of years',
    source: 'Archaeological Discovery',
    is_arena_training: true,
    correct_answer: 'true',
  },
  {
    content: 'The moon landing in 1969 was faked',
    source: 'NASA Historical Records',
    is_arena_training: true,
    correct_answer: 'false',
  },
  {
    content: 'Albert Einstein invented the light bulb',
    source: 'History Database',
    is_arena_training: true,
    correct_answer: 'false',
  },
  {
    content: 'Water boils at 100 degrees Celsius at sea level',
    source: 'Physics Textbook',
    is_arena_training: true,
    correct_answer: 'true',
  },
  {
    content: 'Carrots improve your eyesight significantly',
    source: 'Nutritional Science Review',
    is_arena_training: true,
    correct_answer: 'partially_true',
  },
  {
    content: 'Sugar makes children hyperactive',
    source: 'Pediatric Research Study',
    is_arena_training: true,
    correct_answer: 'false',
  },
  {
    content: 'The human brain uses 100% of its capacity',
    source: 'Neuroscience Research',
    is_arena_training: true,
    correct_answer: 'false',
  },
  {
    content: 'Most of the ocean remains unexplored',
    source: 'Marine Biology Institute',
    is_arena_training: true,
    correct_answer: 'true',
  },
  {
    content: 'Goldfish have a 3-second memory',
    source: 'Animal Behavior Study',
    is_arena_training: true,
    correct_answer: 'false',
  },
  {
    content: 'You should wait 30 minutes after eating before swimming',
    source: 'Health and Safety Guidelines',
    is_arena_training: true,
    correct_answer: 'partially_true',
  },
  {
    content: 'Bananas are berries but strawberries are not',
    source: 'Botanical Classification',
    is_arena_training: true,
    correct_answer: 'true',
  },
];

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check if claims already exist
    const { data: existingClaims } = await supabase
      .from('claims')
      .select('id')
      .eq('is_arena_training', true)
      .limit(1);

    if (existingClaims && existingClaims.length > 0) {
      return NextResponse.json({
        message: 'Claims already seeded',
        count: existingClaims.length,
      });
    }

    // Insert sample claims
    const { data, error } = await supabase
      .from('claims')
      .insert(SAMPLE_CLAIMS)
      .select();

    if (error) {
      console.error('Error seeding claims:', error);
      return NextResponse.json({ error: 'Failed to seed claims' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Claims seeded successfully',
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
