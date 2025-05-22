import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';

// Types
export interface Bookmark {
  id: string;
  user_id: string;
  message_id: string;
  message_text: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  topic_id: string;
  topic_name: string;
  created_at: string;
  expires_at: string;
}

export interface BookmarkInput {
  message_id: string;
  message_text: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  topic_id: string;
  topic_name: string;
}

// Helper to calculate expiration time (24 hours from now)
const getExpirationTime = () => {
  const date = new Date();
  date.setHours(date.getHours() + 24);
  return date.toISOString();
};

// Add a bookmark
export const addBookmark = async (bookmarkData: BookmarkInput): Promise<Bookmark | null> => {
  const supabase = createClientComponentClient();
  
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      toast.error('You need to be logged in to bookmark messages');
      return null;
    }
    
    const userId = session.session.user.id;
    
    // Check if bookmark already exists
    const { data: existingBookmarks } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('message_id', bookmarkData.message_id)
      .single();
    
    if (existingBookmarks) {
      toast.info('Message is already bookmarked');
      return null;
    }
    
    // Calculate expiration time (24 hours from now)
    const expires_at = getExpirationTime();
    
    // Insert the bookmark
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: userId,
        ...bookmarkData,
        expires_at
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('Error adding bookmark:', error);
      toast.error('Failed to bookmark message');
      return null;
    }
    
    toast.success('Message bookmarked');
    return data as Bookmark;
  } catch (error) {
    console.error('Error in addBookmark:', error);
    toast.error('An error occurred while bookmarking');
    return null;
  }
};

// Remove a bookmark
export const removeBookmark = async (bookmarkId: string): Promise<boolean> => {
  const supabase = createClientComponentClient();
  
  try {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', bookmarkId);
    
    if (error) {
      console.error('Error removing bookmark:', error);
      toast.error('Failed to remove bookmark');
      return false;
    }
    
    toast.success('Bookmark removed');
    return true;
  } catch (error) {
    console.error('Error in removeBookmark:', error);
    toast.error('An error occurred while removing bookmark');
    return false;
  }
};

// Get all bookmarks for the current user
export const getUserBookmarks = async (): Promise<Bookmark[]> => {
  const supabase = createClientComponentClient();
  
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      return [];
    }
    
    const userId = session.session.user.id;
    
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching bookmarks:', error);
      toast.error('Failed to load bookmarks');
      return [];
    }
    
    return data as Bookmark[];
  } catch (error) {
    console.error('Error in getUserBookmarks:', error);
    toast.error('An error occurred while loading bookmarks');
    return [];
  }
};

// Get bookmark by message ID
export const getBookmarkByMessageId = async (messageId: string): Promise<Bookmark | null> => {
  const supabase = createClientComponentClient();
  
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      return null;
    }
    
    const userId = session.session.user.id;
    
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .eq('message_id', messageId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No matching record found - this is fine, just return null
        return null;
      }
      console.error('Error fetching bookmark:', error);
      return null;
    }
    
    return data as Bookmark;
  } catch (error) {
    console.error('Error in getBookmarkByMessageId:', error);
    return null;
  }
};

// Create React Context for bookmark state
export const setupBookmarksTable = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/setup-bookmarks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to setup bookmarks table');
    }
    
    return true;
  } catch (error) {
    console.error('Error setting up bookmarks table:', error);
    return false;
  }
}; 