export interface Manga {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  bannerImage: string;
  genres: string[];
  status: 'Ongoing' | 'Completed';
  rating: number;
  chapters?: Chapter[];
  trending?: boolean;
  fresh?: boolean;
}

export interface Chapter {
  id: string;
  mangaId?: string;
  number: number;
  title: string;
  pages?: string[];
  releaseDate: string;
}

export interface Page {
  id: string | number;
  chapterId: string;
  pageNumber: number;
  imagePath: string;
}
