import ProtectedLayout from '@/components/protected-layout';

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
} 