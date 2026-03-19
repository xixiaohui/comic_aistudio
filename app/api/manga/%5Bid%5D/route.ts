import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const mangaResult = await pool.query('SELECT * FROM manga WHERE id = $1', [id]);
    if (mangaResult.rows.length === 0) {
      return NextResponse.json({ error: 'Manga not found' }, { status: 404 });
    }

    const chaptersResult = await pool.query(
      'SELECT * FROM chapters WHERE manga_id = $1 ORDER BY number ASC',
      [id]
    );

    const manga = mangaResult.rows[0];
    const mappedManga = {
      id: manga.id,
      title: manga.title,
      author: manga.author,
      description: manga.description,
      coverImage: manga.cover_image,
      bannerImage: manga.banner_image,
      genres: manga.genres,
      status: manga.status,
      rating: parseFloat(manga.rating),
      trending: manga.trending,
      fresh: manga.fresh,
      chapters: chaptersResult.rows.map((c: any) => ({
        id: c.id,
        mangaId: c.manga_id,
        number: c.number,
        title: c.title,
        releaseDate: c.release_date
      }))
    };

    return NextResponse.json(mappedManga);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
