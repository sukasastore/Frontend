'use client';

// Component imports
import HeaderText from '@/lib/ui/useable-components/header-text';

import { useTranslations } from 'next-intl';

export default function SettingsScreenHeader() {
  // Hooks
  const t = useTranslations();

  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText text={t('Settings')} />
      </div>
    </div>
  );
}
