import { NextRequest, NextResponse } from 'next/server';
import { evaluateComposition, analyzeComposition } from '@/lib/composition-evaluation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, topic } = body;

    if (!text || !topic) {
      return NextResponse.json(
        { success: false, error: 'Metin ve konu gerekli' },
        { status: 400 }
      );
    }

    const evaluation = evaluateComposition(text, topic);
    const analysis = analyzeComposition(text);

    return NextResponse.json({
      success: true,
      evaluation,
      analysis
    });
  } catch (error) {
    console.error('Composition evaluation error:', error);
    return NextResponse.json(
      { success: false, error: 'Değerlendirme yapılamadı' },
      { status: 500 }
    );
  }
}