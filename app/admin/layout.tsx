'use client';

import { ClientProviders } from '@/components/ClientProviders';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      {children}
    </ClientProviders>
  );
} 