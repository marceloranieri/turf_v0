import ProtectedLayout from '@/components/protected-layout';

export default function ChatroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
} 