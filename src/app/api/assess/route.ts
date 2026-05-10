import { NextRequest, NextResponse } from 'next/server';
import { scoreAssessment } from '@/lib/gemini';
import type { AssessmentAnswers } from '@/types';

/**
 * POST /api/assess
 *
 * Body: { answers: AssessmentAnswers }
 * Returns: ScoringResult JSON
 *
 * The GEMINI_API_KEY never leaves the server.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const answers = body?.answers as AssessmentAnswers | undefined;

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body. Expected { answers: AssessmentAnswers }' },
        { status: 400 }
      );
    }

    const result = await scoreAssessment(answers);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[/api/assess] Error:', err);
    return NextResponse.json(
      { error: 'Failed to score assessment. Please try again.' },
      { status: 500 }
    );
  }
}
