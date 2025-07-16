'use client';

import { ProfileProvider } from '@/lib/context/vendor/profile.context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProfileProvider>{children}</ProfileProvider>;
}
