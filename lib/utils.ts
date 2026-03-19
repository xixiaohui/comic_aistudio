import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS class names safely.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalize image paths: pass through http/data URLs as-is,
 * ensure local paths start with '/'.
 */
export function getImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  if (path.startsWith('/images/')) return path;
  return path.startsWith('/') ? path : `/images/${path}`;
}

/**
 * Format a date string to a relative label like "2D AGO", "TODAY", etc.
 */
export function formatRelativeDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'TODAY';
  if (diffDays === 1) return 'YESTERDAY';
  if (diffDays < 7) return `${diffDays}D AGO`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}W AGO`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
}
