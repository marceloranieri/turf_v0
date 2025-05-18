"use client";

import { ProfileProvider } from '@/components/profile-provider';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const isLoggedIn = !!data.session;
      setIsAuthenticated(isLoggedIn);
      setIsLoading(false);
      
      if (!isLoggedIn) {
        redirect('/login');
      }
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
    <ProfileProvider>
      {children}
    </ProfileProvider>
  ) : null;
} 