import ProtectedLayout from '@/components/protected-layout';

export default function MyCirclesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
} 