import ProtectedLayout from '@/components/protected-layout';

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
} 