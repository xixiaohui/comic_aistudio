import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  const body = await request.json();
  const { id, title, author, description, cover_image, banner_image, genres, status, rating, trending, fresh } = body;
  try {
    const query = `
      INSERT INTO manga (id, title, author, description, cover_image, banner_image, genres, status, rating, trending, fresh)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        author = EXCLUDED.author,
        description = EXCLUDED.description,
        cover_image = EXCLUDED.cover_image,
        banner_image = EXCLUDED.banner_image,
        genres = EXCLUDED.genres,
        status = EXCLUDED.status,
        rating = EXCLUDED.rating,
        trending = EXCLUDED.trending,
        fresh = EXCLUDED.fresh
      RETURNING *;
    `;
    const values = [id, title, author, description, cover_image, banner_image, genres, status, rating, trending, fresh];
    const result = await pool.query(query, values);
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to save manga' }, { status: 500 });
  }
}
