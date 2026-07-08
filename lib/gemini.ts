import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiAnalysisResponse } from './types';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function analyzeClaimWithGemini(claim: string): Promise<GeminiAnalysisResponse> {
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not set');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Analyze the following claim for misinformation. Determine if it's true, false, partially true, or unclear. Provide a confidence score (0-1), detailed reasoning, and cite any sources where possible.

Claim: "${claim}"

Respond in JSON format with these fields:
- prediction: 'true' | 'false' | 'partially_true' | 'unclear'
- confidence_score: number between 0 and 1
- reasoning: detailed explanation of your analysis
- sources: array of relevant sources or references (can be empty)`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Parse JSON response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse Gemini response');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    prediction: parsed.prediction || 'unclear',
    confidence_score: Math.min(Math.max(parsed.confidence_score || 0.5, 0), 1),
    reasoning: parsed.reasoning || '',
    sources: Array.isArray(parsed.sources) ? parsed.sources : [],
  };
}

export async function analyzeBatchClaims(claims: string[]): Promise<GeminiAnalysisResponse[]> {
  const results = await Promise.all(
    claims.map(claim => 
      analyzeClaimWithGemini(claim).catch(error => {
        console.error('Error analyzing claim:', error);
        return {
          prediction: 'unclear' as const,
          confidence_score: 0,
          reasoning: 'Error analyzing this claim',
          sources: [],
        };
      })
    )
  );
  return results;
}
