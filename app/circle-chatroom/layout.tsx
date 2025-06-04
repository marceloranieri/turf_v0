import ProtectedLayout from '@/components/protected-layout';

export default function CircleChatroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
} 