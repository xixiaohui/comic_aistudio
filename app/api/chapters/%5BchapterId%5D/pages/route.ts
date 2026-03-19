import { NextRequest,NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  context : { params: Promise<{}> }
) {
  const { chapterId } = await context.params as { chapterId: string };
  try {
    const result = await pool.query(
      'SELECT * FROM pages WHERE chapter_id = $1 ORDER BY page_number ASC',
      [chapterId]
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
