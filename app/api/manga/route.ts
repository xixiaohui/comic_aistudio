import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM manga ORDER BY created_at DESC');
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
      fresh: m.fresh
    }));
    return NextResponse.json(mappedRows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
