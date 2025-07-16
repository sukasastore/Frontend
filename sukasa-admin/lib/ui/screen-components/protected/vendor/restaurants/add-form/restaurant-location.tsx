'use client';

// Core
import { Form, Formik } from 'formik';
import { useContext, useState } from 'react';

// Interface and Types
import {
  IRestaurantsRestaurantLocationComponentProps,
  IVendorForm,
} from '@/lib/utils/interfaces';
import CustomGoogleMapsLocationBoundsVendorLayoutRestaurant from '@/lib/ui/useable-components/google-maps/location-bounds-restaurant(vendor-layout)';
import { GoogleMapsContext } from '@/lib/context/global/google-maps.context';

// Icons
// import CustomGoogleMapsLocationBounds from '@/lib/ui/useable-components/google-maps/location-bounds-restaurant(vendor)';

const initialValues: IVendorForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function RestaurantLocation({
  stepperProps,
}: IRestaurantsRestaurantLocationComponentProps) {
  const { onStepChange } = stepperProps ?? {
    onStepChange: () => {},
  };

  const { isLoaded } = useContext(GoogleMapsContext);

  // States
  const [formInitialValues] = useState<IVendorForm>({
    ...initialValues,
  });

  return (
    <div className="flex h-full w-full items-center justify-start">
      <div className="h-full w-full">
        <div className="flex flex-col gap-2">
          <div>
            <Formik
              initialValues={formInitialValues}
              validationSchema={null}
              enableReinitialize={true}
              onSubmit={() => {}}
              validateOnChange={false}
            >
              {({ handleSubmit }) => {
                return (
                  <Form onSubmit={handleSubmit}>
                    <div className="mb-2 space-y-3">
                      {isLoaded && (
                        <CustomGoogleMapsLocationBoundsVendorLayoutRestaurant
                          onStepChange={onStepChange}
                        />
                      )}
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
