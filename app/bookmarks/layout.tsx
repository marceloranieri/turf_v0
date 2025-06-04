import ProtectedLayout from '@/components/protected-layout';

export default function BookmarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
} 