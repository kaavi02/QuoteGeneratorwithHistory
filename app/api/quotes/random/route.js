import { NextResponse } from 'next/server';
import { fetchExternalQuote } from '@/lib/quotes';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const quote = await fetchExternalQuote();
    return NextResponse.json({ success: true, quote });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch quote' },
      { status: 500 }
    );
  }
}
