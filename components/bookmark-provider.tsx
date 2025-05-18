"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Bookmark, BookmarkInput, addBookmark, getUserBookmarks, removeBookmark, getBookmarkByMessageId, setupBookmarksTable } from "@/lib/bookmark-service";
import { useSupabase } from "@/lib/supabase-provider";

// Context type
interface BookmarkContextType {
  bookmarks: Bookmark[];
  loading: boolean;
  addBookmark: (data: BookmarkInput) => Promise<Bookmark | null>;
  removeBookmark: (id: string) => Promise<boolean>;
  isBookmarked: (messageId: string) => boolean;
  getBookmarkByMessageId: (messageId: string) => Bookmark | undefined;
  refreshBookmarks: () => Promise<void>;
}

// Create context
const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

// Provider component
export const BookmarkProvider = ({ children }: { children: React.ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const { supabase } = useSupabase();
  
  // Load bookmarks on mount and setup realtime updates
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        // Ensure bookmarks table exists
        await setupBookmarksTable();
        
        // Load initial bookmarks
        const bookmarks = await getUserBookmarks();
        setBookmarks(bookmarks);
        
        // Set up realtime subscription
        const channel = supabase
          .channel('bookmark-changes')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
          }, () => {
            refreshBookmarks();
          })
          .subscribe();
          
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Error in bookmark provider:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBookmarks();
  }, [supabase]);
  
  // Refresh bookmarks
  const refreshBookmarks = async () => {
    const bookmarks = await getUserBookmarks();
    setBookmarks(bookmarks);
  };
  
  // Add a bookmark and update state
  const handleAddBookmark = async (data: BookmarkInput) => {
    const bookmark = await addBookmark(data);
    if (bookmark) {
      setBookmarks((prev) => [bookmark, ...prev]);
    }
    return bookmark;
  };
  
  // Remove a bookmark and update state
  const handleRemoveBookmark = async (id: string) => {
    const success = await removeBookmark(id);
    if (success) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    }
    return success;
  };
  
  // Check if a message is bookmarked
  const isBookmarked = (messageId: string) => {
    return bookmarks.some((b) => b.message_id === messageId);
  };
  
  // Get bookmark by message ID
  const getBookmarkById = (messageId: string) => {
    return bookmarks.find((b) => b.message_id === messageId);
  };
  
  // Context value
  const value = {
    bookmarks,
    loading,
    addBookmark: handleAddBookmark,
    removeBookmark: handleRemoveBookmark,
    isBookmarked,
    getBookmarkByMessageId: getBookmarkById,
    refreshBookmarks,
  };
  
  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};

// Hook to use the bookmark context
export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}; 