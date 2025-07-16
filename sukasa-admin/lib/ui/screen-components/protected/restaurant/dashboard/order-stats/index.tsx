// Component
import { GET_DASHBOARD_RESTAURANT_ORDERS } from '@/lib/api/graphql/queries/dashboard';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import {
  IDashboardOrderStatsComponentsProps,
  IDashboardRestaurantOrdersSalesStatsResponseGraphQL,
  IQueryResult,
} from '@/lib/utils/interfaces';
import StatsCard from '@/lib/ui/useable-components/stats-card';

// Interface & Types
import {
  faCashRegister,
  faCreditCard,
  faMoneyBillWave,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import { useContext, useMemo } from 'react';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { useConfiguration } from '@/lib/hooks/useConfiguration';
import { useTranslations } from 'next-intl';

export default function UserStats({
  dateFilter,
}: IDashboardOrderStatsComponentsProps) {
  // Hooks
  const t = useTranslations();

  // Context
  const {
    restaurantLayoutContextData: { restaurantId },
  } = useContext(RestaurantLayoutContext);
  // COntext
  const { CURRENCY_CODE } = useConfiguration();

  const { data, loading } = useQueryGQL(
    GET_DASHBOARD_RESTAURANT_ORDERS,
    {
      restaurant: restaurantId,
      dateKeyword: dateFilter?.dateKeyword,
      starting_date: dateFilter?.startDate,
      ending_date: dateFilter?.endDate,
    },
    {
      fetchPolicy: 'network-only',
      debounceMs: 300,
    }
  ) as IQueryResult<
    IDashboardRestaurantOrdersSalesStatsResponseGraphQL | undefined,
    undefined
  >;

  const dashboardUsers = useMemo(() => {
    if (!data) return null;
    return {
      totalOrders:
        data?.getRestaurantDashboardOrdersSalesStats?.totalOrders ?? 0,
      totalSales: data?.getRestaurantDashboardOrdersSalesStats?.totalSales ?? 0,
      totalCODOrders:
        data?.getRestaurantDashboardOrdersSalesStats?.totalCODOrders ?? 0,
      totalCardOrders:
        data?.getRestaurantDashboardOrdersSalesStats?.totalCardOrders ?? 0,
    };
  }, [data]);

  return (
    <div className="p-3 grid grid-cols-1 items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <StatsCard
        label={t('Total Orders')}
        total={dashboardUsers?.totalOrders ?? 0}
        icon={faShoppingCart}
        route="/admin/store/orders"
        loading={loading}
        amountConfig={{ format: 'number', currency: 'USD' }}
      />

      <StatsCard
        label={t('Total COD Orders')}
        total={dashboardUsers?.totalCODOrders ?? 0}
        icon={faMoneyBillWave}
        route="/admin/store/orders"
        loading={loading}
        amountConfig={{ format: 'number', currency: 'USD' }}
      />

      <StatsCard
        label={t('Total Card Orders')}
        total={dashboardUsers?.totalCardOrders ?? 0}
        icon={faCreditCard}
        route="/admin/store/orders"
        loading={loading}
        amountConfig={{ format: 'number', currency: 'USD' }}
      />

      <StatsCard
        label={t('Total Sales')}
        total={dashboardUsers?.totalSales ?? 0}
        icon={faCashRegister}
        route="/admin/store/orders"
        loading={loading}
        amountConfig={{ format: 'currency', currency: CURRENCY_CODE ?? 'USD' }}
      />
    </div>
  );
}
