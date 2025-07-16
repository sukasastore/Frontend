// Path: /index.tsx/customerSupport/super-admin/screens/ui/lib
'use client';

import { useState } from 'react';
import CustomerSupportMain from '@/lib/ui/screen-components/protected/super-admin/customerSupport/view/main';
import CustomerSupportMobilesTabs from '@/lib/ui/screen-components/protected/super-admin/customerSupport/view/mobile-tabs';
import { useTranslations } from 'next-intl';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import HeaderText from '@/lib/ui/useable-components/header-text';


// Types
type CustomerSupportTabType = 'tickets' | 'chats';

export default function CustomerSupportScreen() {
  // Hooks
  const t = useTranslations();
  
  // States
  const [activeTab, setActiveTab] = useState<CustomerSupportTabType>('tickets');
  
  // Input value state (before debouncing)
  const [inputValue, setInputValue] = useState<string>('');
  
  
  // Handler for search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <div className="w-full flex-shrink-0 border-b p-3">
        <div className="mb-4 flex flex-col items-center justify-between sm:flex-row">
          <HeaderText text={t('Customer Support')} />
        </div>

        <div className="flex flex-col w-full items-start space-y-4 sm:w-60">
          <CustomTextField
            type="text"
            name="userSearch"
            maxLength={35}
            placeholder={t('Search for users')}
            showLabel={false}
            value={inputValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      {/* Mobile tabs for switching between users and tickets */}
      <CustomerSupportMobilesTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      {/* Main content area */}
      <CustomerSupportMain 
        activeTab={activeTab}
      />
    </div>
  );
}