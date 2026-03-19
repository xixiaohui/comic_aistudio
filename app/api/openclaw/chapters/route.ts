import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  const body = await request.json();
  const { id, manga_id, number, title, release_date } = body;
  try {
    const query = `
      INSERT INTO chapters (id, manga_id, number, title, release_date)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO UPDATE SET
        number = EXCLUDED.number,
        title = EXCLUDED.title,
        release_date = EXCLUDED.release_date
      RETURNING *;
    `;
    const values = [id, manga_id, number, title, release_date];
    const result = await pool.query(query, values);
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to save chapter' }, { status: 500 });
  }
}
