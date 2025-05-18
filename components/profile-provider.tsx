"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Profile, getProfileById } from "@/lib/profile-service";
import { useSupabase } from "@/lib/supabase-provider";

// Context type
interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

// Create context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Provider component
export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { supabase } = useSupabase();
  
  // Load profile on mount and setup realtime updates
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }
        
        const profile = await getProfileById(session.user.id);
        setProfile(profile);
        
        // Set up realtime subscription
        const channel = supabase
          .channel('profile-changes')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${session.user.id}`,
          }, (payload) => {
            setProfile(payload.new as Profile);
          })
          .subscribe();
          
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Error in profile provider:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [supabase]);
  
  // Refresh profile
  const refreshProfile = async () => {
    if (!profile) return;
    
    const updatedProfile = await getProfileById(profile.id);
    setProfile(updatedProfile);
  };
  
  // Context value
  const value = {
    profile,
    loading,
    refreshProfile,
  };
  
  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

// Hook to use the profile context
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}; 