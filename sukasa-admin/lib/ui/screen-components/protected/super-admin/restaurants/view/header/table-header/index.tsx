// Custom Components
import { useConfiguration } from '@/lib/hooks/useConfiguration';
import CustomTextField from '@/lib/ui/useable-components/input-field';

// Interfaces
import { IRestaurantsTableHeaderProps } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';

export default function RestaurantsTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
}: IRestaurantsTableHeaderProps) {
  // Hooks
  const t = useTranslations();
  const { IS_MULTIVENDOR } = useConfiguration();

  return (
    <div className="mb-4 flex flex-col gap-6">
      <div className="flex-colm:flex-row flex w-fit items-center gap-2">
        {IS_MULTIVENDOR && (
          <div className="w-60">
            <CustomTextField
              type="text"
              name="vendorFilter"
              maxLength={35}
              showLabel={false}
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder={t('Keyword Search')}
            />
          </div>
        )}
      </div>
    </div>
  );
}
