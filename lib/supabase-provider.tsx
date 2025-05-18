'use client';

import { createContext, useContext } from 'react';
import { supabase } from './supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

type SupabaseContext = {
  supabase: SupabaseClient<Database>;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Context.Provider value={{ supabase }}>
      {children}
    </Context.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }
  return context;
};

export default useSupabase; 