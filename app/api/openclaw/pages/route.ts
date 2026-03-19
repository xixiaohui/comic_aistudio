import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  const body = await request.json();
  const { chapter_id, pages } = body;
  try {
    await pool.query('DELETE FROM pages WHERE chapter_id = $1', [chapter_id]);
    
    const insertQueries = pages.map((p: any) => {
      return pool.query(
        'INSERT INTO pages (chapter_id, page_number, image_path) VALUES ($1, $2, $3)',
        [chapter_id, p.page_number, p.image_path]
      );
    });
    
    await Promise.all(insertQueries);
    return NextResponse.json({ success: true, count: pages.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to save pages' }, { status: 500 });
  }
}
