import { clsx, type ClassValue } from 'clsx';
import { formatDistanceToNowStrict } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(creationDate: Date) {
  return formatDistanceToNowStrict(creationDate, {
    addSuffix: true,
  });
}

export function calculateTotalVotes(upvotes: number, downvotes: number) {
  return upvotes - downvotes;
}

export const SORT_OPTIONS = [
  { label: 'New', value: 'new' },
  { label: 'Trending (Day)', value: 'trending_day' },
  { label: 'Trending (Week)', value: 'trending_week' },
  { label: 'Top', value: 'top' },
];
