import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 