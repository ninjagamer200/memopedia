export interface Meme {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  type: 'image' | 'video';
  source: string;
  subreddit?: string;
  postLink?: string;
}

export interface MemeResponse {
  memes: Meme[];
  totalCount: number;
}

export interface LikeData {
  [memeId: string]: boolean;
}

export interface FavoriteData {
  [memeId: string]: boolean;
}
