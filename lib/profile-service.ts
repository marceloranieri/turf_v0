import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';

// Types
export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  created_at: string;
  updated_at: string;
  followers?: { count: number };
  following?: { count: number };
  posts?: { count: number };
}

// Get profile by username
export const getProfileByUsername = async (username: string): Promise<Profile | null> => {
  const supabase = createClientComponentClient();
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        followers:follower_relations(count),
        following:following_relations(count),
        posts:posts(count)
      `)
      .eq('username', username)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('Error in getProfileByUsername:', error);
    return null;
  }
};

// Get profile by ID
export const getProfileById = async (id: string): Promise<Profile | null> => {
  const supabase = createClientComponentClient();
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        followers:follower_relations(count),
        following:following_relations(count),
        posts:posts(count)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('Error in getProfileById:', error);
    return null;
  }
};

// Update profile
export const updateProfile = async (profile: Partial<Profile>): Promise<Profile | null> => {
  const supabase = createClientComponentClient();
  
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      toast.error('You need to be logged in to update your profile');
      return null;
    }
    
    const userId = session.session.user.id;
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return null;
    }
    
    toast.success('Profile updated successfully');
    return data as Profile;
  } catch (error) {
    console.error('Error in updateProfile:', error);
    toast.error('An error occurred while updating profile');
    return null;
  }
};

// Upload profile image (avatar or banner)
export const uploadProfileImage = async (
  file: File,
  type: 'avatar' | 'banner'
): Promise<Profile | null> => {
  const supabase = createClientComponentClient();
  
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      toast.error('You need to be logged in to upload images');
      return null;
    }
    
    const userId = session.session.user.id;
    
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const bucketName = type === 'avatar' ? 'avatars' : 'banners';
    
    // Upload the file
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(fileName, file, { upsert: true });
    
    if (error) {
      console.error(`Error uploading ${type}:`, error);
      toast.error(`Failed to upload ${type}`);
      return null;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(fileName);
    
    // Update the profile with the new image URL
    const field = type === 'avatar' ? 'avatar_url' : 'banner_url';
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update({ [field]: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    
    if (updateError) {
      console.error(`Error updating profile with ${type}:`, updateError);
      toast.error(`Failed to update profile with ${type}`);
      return null;
    }
    
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`);
    return profile as Profile;
  } catch (error) {
    console.error(`Error in uploadProfileImage:`, error);
    toast.error(`An error occurred while uploading ${type}`);
    return null;
  }
};

// Get optimized image URL
export const getOptimizedImageUrl = (url: string | null, width: number, height: number): string => {
  if (!url) return '';
  
  // If using Supabase Storage, you can use their built-in transformations
  const baseUrl = url.split('?')[0];
  return `${baseUrl}?width=${width}&height=${height}&resize=fill`;
}; 