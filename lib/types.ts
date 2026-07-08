// User profile type
export interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  score: number;
  accuracy_rate: number;
  total_predictions: number;
  correct_predictions: number;
  created_at: string;
  updated_at: string;
}

// Claim (headline/statement to verify)
export interface Claim {
  id: string;
  content: string;
  source: string | null;
  url: string | null;
  created_at: string;
  is_arena_training: boolean;
  correct_answer: string | null;
}

// AI verification result
export interface VerificationResult {
  id: string;
  claim_id: string;
  user_id: string | null;
  prediction: 'true' | 'false' | 'partially_true' | 'unclear';
  confidence_score: number;
  reasoning: string | null;
  sources: string[];
  is_correct: boolean | null;
  created_at: string;
}

// Community vote type
export type VoteType = 'helpful' | 'misleading' | 'unclear';

export interface CommunityVote {
  id: string;
  result_id: string;
  user_id: string;
  vote_type: VoteType;
  created_at: string;
}

// User prediction for Arena training
export interface UserPrediction {
  id: string;
  user_id: string;
  claim_id: string;
  user_prediction: 'true' | 'false' | 'partially_true' | 'unclear';
  is_correct: boolean | null;
  created_at: string;
}

// Gemini analysis response
export interface GeminiAnalysisResponse {
  prediction: 'true' | 'false' | 'partially_true' | 'unclear';
  confidence_score: number;
  reasoning: string;
  sources: string[];
}

// Leaderboard entry
export interface LeaderboardEntry extends Profile {
  rank: number;
}
