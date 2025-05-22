"use client";

import { useState } from 'react';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import { useBookmarks } from './bookmark-provider';
import { BookmarkInput } from '@/lib/bookmark-service';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  messageData: BookmarkInput;
  className?: string;
}

export function BookmarkButton({ messageData, className }: BookmarkButtonProps) {
  const { isBookmarked, addBookmark, removeBookmark, getBookmarkByMessageId } = useBookmarks();
  const [isLoading, setIsLoading] = useState(false);
  
  const bookmarked = isBookmarked(messageData.message_id);
  const bookmark = getBookmarkByMessageId(messageData.message_id);
  
  const handleToggleBookmark = async () => {
    setIsLoading(true);
    try {
      if (bookmarked && bookmark) {
        await removeBookmark(bookmark.id);
      } else {
        await addBookmark(messageData);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none h-9 w-9",
        bookmarked ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground hover:text-foreground",
        className
      )}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark message"}
    >
      <BookmarkIcon className={cn("h-4 w-4", bookmarked ? "fill-current" : "")} />
    </button>
  );
} 