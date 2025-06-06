'use client';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      {children}
    </ClientProviders>
  );
} 