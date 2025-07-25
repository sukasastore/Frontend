'use client';

// Core
import { useContext } from 'react';

// Context
import { LayoutContext } from '@/lib/context/global/layout.context';

// Interface & Types
import {
  IGlobalComponentProps,
  ISidebarMenuItem,
  LayoutContextProps,
} from '@/lib/utils/interfaces';

// Icons
import {
  faCog,
  faHome,
  faSliders,
  faUpRightFromSquare,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';

// Constants and Utiils
import useCheckAllowedRoutes from '@/lib/hooks/useCheckAllowedRoutes';

// Components
import SidebarItem from './side-bar-item';
import { useTranslations } from 'next-intl';
import { useConfiguration } from '@/lib/hooks/useConfiguration';

function SuperAdminSidebar({ children }: IGlobalComponentProps) {
  // Contexts
  const { isSuperAdminSidebarVisible } =
    useContext<LayoutContextProps>(LayoutContext);

  return (
    <div className="relative">
      <aside
        id="app-sidebar"
        className={`box-border transform overflow-hidden transition-all duration-300 ease-in-out ${isSuperAdminSidebarVisible ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}`}
      >
        <nav
          className={`flex h-full flex-col border-r bg-white shadow-sm transition-opacity duration-300 ${isSuperAdminSidebarVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          <ul className="flex-1 pl-2">{children}</ul>
        </nav>
      </aside>
    </div>
  );
}

export default function MakeSidebar() {
  // Hooks
  const t = useTranslations();
  const { IS_MULTIVENDOR } = useConfiguration();

  // Contexts
  const { isSuperAdminSidebarVisible } =
    useContext<LayoutContextProps>(LayoutContext);

  const navBarItems: ISidebarMenuItem[] = [
    {
      text: 'My Website',
      label: t('My Website'),
      route: 'https://sukasa-web.netlify.app/',
      isParent: true,
      icon: faUpRightFromSquare,
      isClickable: true,
      shouldOpenInNewTab: true,
    },
    {
      text: 'Home',
      label: t('Home'),
      route: '/home',
      isParent: true,
      icon: faHome,
      isClickable: true,
    },
    {
      text: 'General',
      label: t('General'),
      route: '/general',
      isParent: true,
      icon: faCog,
      subMenu: useCheckAllowedRoutes([
        {
          text: 'Vendors',
          label: t('Vendors'),
          route: '/general/vendors',
          isParent: false,
          isAllowed: IS_MULTIVENDOR === true,
        },
        {
          text: IS_MULTIVENDOR === true ? 'Stores' : 'Store',
          label: IS_MULTIVENDOR === true ? t('Stores') : t('Store'),
          route: '/general/stores',
          isParent: false,
        },
        {
          text: 'Riders',
          label: t('Riders'),
          route: '/general/riders',
          isParent: false,
        },
        {
          text: 'Users',
          label: t('Users'),
          route: '/general/users',
          isParent: false,
        },
        {
          text: 'Staff',
          label: t('Staff'),
          route: '/general/staff',
          isParent: false,
        },
      ]),
      shouldShow: function () {
        return this.subMenu ? this.subMenu.length > 0 : false;
      },
    },
    {
      text: 'Management',
      label: t('Management'),
      route: '/management',
      isParent: true,
      icon: faSliders,
      subMenu: useCheckAllowedRoutes([
        {
          text: 'Configuration',
          label: t('Configuration'),
          route: '/management/configurations',
          isParent: false,
        },
        {
          text: 'Orders',
          label: t('Orders'),
          route: '/management/orders',
          isParent: false,
          isAllowed: IS_MULTIVENDOR === true,
        },
        {
          text: 'Coupons',
          label: t('Coupons'),
          route: '/management/coupons',
          isParent: false,
        },
        {
          text: 'Cuisine',
          label: t('Cuisine'),
          route: '/management/cuisines',
          isParent: false,
        },
        {
          text: 'Banners',
          label: t('Banners'),
          route: '/management/banners',
          isParent: false,
          isAllowed: IS_MULTIVENDOR === true,
        },
        {
          text: 'Tipping',
          label: t('Tipping'),
          route: '/management/tippings',
          isParent: false,
        },
        {
          text: 'Commission Rate',
          label: t('Commission Rate'),
          route: '/management/commission-rates',
          isParent: false,
        },

        {
          text: 'Notification',
          label: t('Notification'),
          route: '/management/notifications',
          isParent: false,
        },
      ]),
      shouldShow: function () {
        return this.subMenu ? this.subMenu.length > 0 : false;
      },
    },
    ...(IS_MULTIVENDOR ? [{
      text: t('Wallet'),
      route: '/wallet',
      isParent: true,
      icon: faWallet,
      // eslint-disable-next-line react-hooks/rules-of-hooks
      subMenu: useCheckAllowedRoutes([
        {
          text: t('Transaction History'),
          route: '/wallet/transaction-history',
          isParent: false,
        },
        {
          text: 'Withdrawal Request',
          route: '/wallet/withdraw-requests',
          isParent: false,
        },
        {
          text: t('Earnings'),
          route: '/wallet/earnings',
          isParent: false,
        },
      ]),
      shouldShow: function () {
        return this.subMenu ? this.subMenu.length > 0 : false;
      },
    }] : []),
  ];

  return (
    <>
      <SuperAdminSidebar>
        <div className="h-[90vh] pb-4 overflow-y-auto overflow-x-hidden pr-2">
          {navBarItems.map((item, index) =>
            item.shouldShow && !item.shouldShow() ? null : (
              <SidebarItem
                key={index}
                expanded={isSuperAdminSidebarVisible}
                {...item}
              />
            )
          )}
        </div>
      </SuperAdminSidebar>
    </>
  );
}