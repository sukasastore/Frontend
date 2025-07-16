'use client';
// HOC
import RESTAURANT_GUARD from '@/lib/hoc/RESTAURANT_GUARD';
// Layout
import { RestaurantLayoutProvider } from '@/lib/context/restaurant/layout-restaurant.context';
import RestaurantLayout from '@/lib/ui/layouts/protected/restaurant';
import { ProfileProvider } from '@/lib/context/restaurant/profile.context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ProtectedLayout = RESTAURANT_GUARD(
    ({ children }: { children: React.ReactNode }) => {
      return <RestaurantLayout>{children}</RestaurantLayout>;
    }
  );

  return (
    <ProtectedLayout>
      <RestaurantLayoutProvider>
        <ProfileProvider>{children}</ProfileProvider>
      </RestaurantLayoutProvider>
    </ProtectedLayout>
  );
}
