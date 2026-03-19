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
  chapters: Chapter[];
  trending?: boolean;
  fresh?: boolean;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  pages: string[];
  releaseDate: string;
}
