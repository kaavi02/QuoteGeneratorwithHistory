import { NextResponse } from 'next/server';
import { getAllFavorites, addFavorite, removeFavorite } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const favorites = getAllFavorites();
    return NextResponse.json({ success: true, favorites });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Could not load favorites' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { quote, author, category } = body;

    if (!quote || typeof quote !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Quote text is required' },
        { status: 400 }
      );
    }

    const savedRecord = addFavorite({
      quote,
      author: author || 'Unknown',
      category: category || 'General'
    });

    const currentFavorites = getAllFavorites();

    return NextResponse.json({
      success: true,
      favorite: savedRecord,
      favorites: currentFavorites
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Could not save favorite' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    let quoteId = searchParams.get('id');

    if (!quoteId) {
      const body = await request.json().catch(() => ({}));
      quoteId = body.id;
    }

    if (!quoteId) {
      return NextResponse.json(
        { success: false, message: 'Favorite ID is required' },
        { status: 400 }
      );
    }

    const removed = removeFavorite(quoteId);
    const currentFavorites = getAllFavorites();

    return NextResponse.json({
      success: removed,
      favorites: currentFavorites
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Could not delete favorite' },
      { status: 500 }
    );
  }
}
