// Client-side localStorage utilities for likes and favorites

export function getLikes(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  const likes = localStorage.getItem('memopedia_likes');
  return likes ? JSON.parse(likes) : {};
}

export function saveLike(memeId: string, liked: boolean): void {
  if (typeof window === 'undefined') return;
  const likes = getLikes();
  if (liked) {
    likes[memeId] = true;
  } else {
    delete likes[memeId];
  }
  localStorage.setItem('memopedia_likes', JSON.stringify(likes));
}

export function isLiked(memeId: string): boolean {
  return !!getLikes()[memeId];
}

export function getFavorites(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  const favorites = localStorage.getItem('memopedia_favorites');
  return favorites ? JSON.parse(favorites) : {};
}

export function saveFavorite(memeId: string, favorited: boolean): void {
  if (typeof window === 'undefined') return;
  const favorites = getFavorites();
  if (favorited) {
    favorites[memeId] = true;
  } else {
    delete favorites[memeId];
  }
  localStorage.setItem('memopedia_favorites', JSON.stringify(favorites));
}

export function isFavorited(memeId: string): boolean {
  return !!getFavorites()[memeId];
}
