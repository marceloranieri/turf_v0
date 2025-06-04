import ProtectedLayout from '@/components/protected-layout';

export default function CircleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
} 