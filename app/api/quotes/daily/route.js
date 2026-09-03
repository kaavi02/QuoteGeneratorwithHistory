import { NextResponse } from 'next/server';
import { fetchDailyQuote } from '@/lib/quotes';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const quote = await fetchDailyQuote();
    return NextResponse.json({ success: true, quote });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch daily quote' },
      { status: 500 }
    );
  }
}
