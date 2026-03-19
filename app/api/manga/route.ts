import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Revalidate cached data every 60 seconds
export const revalidate = 60;

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, title, author, description, cover_image, banner_image, genres, status, rating, trending, fresh FROM manga ORDER BY created_at DESC'
    );
    const mappedRows = result.rows.map((m: any) => ({
      id: m.id,
      title: m.title,
      author: m.author,
      description: m.description,
      coverImage: m.cover_image,
      bannerImage: m.banner_image,
      genres: m.genres,
      status: m.status,
      rating: parseFloat(m.rating),
      trending: m.trending,
      fresh: m.fresh,
    }));
    return NextResponse.json(mappedRows, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (err) {
    console.error('GET /api/manga error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
