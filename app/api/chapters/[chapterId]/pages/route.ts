import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ chapterId: string }> }
) {
  const { chapterId } = await context.params;
  try {
    const result = await pool.query(
      'SELECT * FROM pages WHERE chapter_id = $1 ORDER BY page_number ASC',
      [chapterId]
    );
    const mappedPages = result.rows.map((p: any) => ({
      id: p.id,
      chapterId: p.chapter_id,
      pageNumber: p.page_number,
      imagePath: p.image_path
    }));
    return NextResponse.json(mappedPages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
