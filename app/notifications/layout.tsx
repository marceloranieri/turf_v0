import ProtectedLayout from '@/components/protected-layout';

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
} 