"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Profile } from "@/lib/profile-service";

// Create a default value for the context
const defaultProfileContext = {
  profile: null,
  loading: true,
  refreshProfile: async () => {},
};

// Create the context with the default value
const ProfileContext = createContext(defaultProfileContext);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  
  // Fetch profile data
  const fetchProfile = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          followers:follower_relations(count),
          following:following_relations(count),
          posts:posts(count)
        `)
        .eq('id', session.session.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProfile();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('profile-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: profile ? `id=eq.${profile.id}` : undefined,
      }, (payload) => {
        setProfile(payload.new as Profile);
      })
      .subscribe();
    
    // Set up auth state change subscription
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });
    
    return () => {
      supabase.removeChannel(channel);
      authListener?.subscription.unsubscribe();
    };
  }, [profile?.id]);
  
  const value = {
    profile,
    loading,
    refreshProfile: fetchProfile,
  };
  
  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

// Create a hook that will return default values when used outside of context
export function useProfile() {
  const context = useContext(ProfileContext);
  
  if (!context) {
    // Return default values instead of throwing an error
    return defaultProfileContext;
  }
  
  return context;
} 