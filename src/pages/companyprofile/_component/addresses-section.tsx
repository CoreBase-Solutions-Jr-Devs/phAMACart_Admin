import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  Loader2,
  MapPin,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import type { CompanyProfileFormValues } from "@/features/companyProfile/schema";
import { useLazyGetCurrentLocationAddressQuery } from "@/features/deliverysettings/deliverySettingsAPI";

interface Props {
  readOnly?: boolean;
}

type AddressFormValue = NonNullable<
  CompanyProfileFormValues["addresses"]
>[number];

export const AddressesSection = ({ readOnly }: Props) => {
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CompanyProfileFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const addresses = watch("addresses") ?? [];

  const [isLocating, setIsLocating] = useState(false);

  const [
    getCurrentLocationAddress,
    { isFetching: isGettingCurrentLocation },
  ] = useLazyGetCurrentLocationAddressQuery();

  const handlePrimaryChange = (
    index: number,
    checked: boolean,
  ) => {
    if (checked) {
      addresses.forEach((_, i) => {
        setValue(
          `addresses.${i}.isPrimary`,
          i === index,
          {
            shouldValidate: true,
            shouldDirty: true,
          },
        );
      });

      return;
    }

    setValue(
      `addresses.${index}.isPrimary`,
      false,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  const appendAddress = (
    address?: Partial<AddressFormValue>,
  ) => {
    const hasPrimary = addresses.some(
      (item) => item.isPrimary,
    );

    const newAddress: AddressFormValue = {
      street: address?.street ?? "",
      city: address?.city ?? "",
      county: address?.county ?? "",
      postalCode: address?.postalCode ?? "",
      country: address?.country ?? "",
      latitude: address?.latitude ?? null,
      longitude: address?.longitude ?? null,
      googlePlaceId:
        address?.googlePlaceId ?? null,
      isPrimary:
        address?.isPrimary ?? !hasPrimary,
    };

    append(newAddress);
  };

  const addManualAddress = () => {
    appendAddress();
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error(
        "Location services are not supported by this browser.",
      );
      return;
    }

    if (
      isLocating ||
      isGettingCurrentLocation
    ) {
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const {
            latitude,
            longitude,
          } = position.coords;

          const address =
            await getCurrentLocationAddress({
              latitude,
              longitude,
            }).unwrap();

          const hasPrimary = addresses.some(
            (item) => item.isPrimary,
          );

          const resolvedLatitude =
            address.latitude != null
              ? Number(address.latitude)
              : latitude;

          const resolvedLongitude =
            address.longitude != null
              ? Number(address.longitude)
              : longitude;

          const newAddress: AddressFormValue = {
            street: address.street ?? "",
            city: address.city ?? "",
            county: address.county ?? "",
            postalCode:
              address.postalCode ?? "",
            country: address.country ?? "",

            // API may return these as strings,
            // but the form schema requires numbers.
            latitude: Number.isFinite(
              resolvedLatitude,
            )
              ? resolvedLatitude
              : null,

            longitude: Number.isFinite(
              resolvedLongitude,
            )
              ? resolvedLongitude
              : null,

            googlePlaceId:
              address.googlePlaceId ?? null,

            isPrimary: !hasPrimary,
          };

          append(newAddress);

          toast.success(
            "Current location address added.",
          );
        } catch (error) {
          console.error(
            "Failed to resolve current location address:",
            error,
          );

          toast.error(
            "Unable to determine the address for your current location.",
          );
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error(
              "Location permission was denied. Please allow location access and try again.",
            );
            break;

          case error.POSITION_UNAVAILABLE:
            toast.error(
              "Your current location could not be determined.",
            );
            break;

          case error.TIMEOUT:
            toast.error(
              "Getting your current location timed out. Please try again.",
            );
            break;

          default:
            toast.error(
              "Unable to determine your current location.",
            );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  const removeAddress = (index: number) => {
    const wasPrimary =
      addresses[index]?.isPrimary ?? false;

    remove(index);

    if (
      wasPrimary &&
      addresses.length > 1
    ) {
      setValue(
        "addresses.0.isPrimary",
        true,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );
    }
  };

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        {!readOnly && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={useCurrentLocation}
              disabled={
                isLocating ||
                isGettingCurrentLocation
              }
            >
              {isLocating ||
              isGettingCurrentLocation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Locating...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Use Current Location
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addManualAddress}
            >
              <PlusIcon className="mr-1 h-4 w-4" />
              Add Address
            </Button>
          </div>
        )}
      </div>

      {/* Empty state */}
      {fields.length === 0 && (
        <div className="rounded-md border border-dashed p-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <MapPin className="h-6 w-6 text-muted-foreground" />

            <p className="text-sm text-muted-foreground">
              No addresses added.
            </p>

            {!readOnly && (
              <p className="text-xs text-muted-foreground">
                Add an address manually or use your
                current location.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Addresses */}
      <div className="space-y-3">
        {fields.map((field, index) => {
          const address = addresses[index];

          const isGoogleAddress =
            Boolean(address?.googlePlaceId);

          return (
            <div
              key={field.id}
              className="relative space-y-3 rounded-md border p-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between pr-8">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium">
                    Address {index + 1}
                  </h4>

                  {isGoogleAddress && (
                    <span className="rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      Google Place
                    </span>
                  )}
                </div>

                {!readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() =>
                      removeAddress(index)
                    }
                  >
                    <Trash2Icon className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>

              {/* Address fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">
                    Street
                  </Label>

                  <Input
                    disabled={readOnly}
                    {...register(
                      `addresses.${index}.street`,
                    )}
                  />

                  {errors.addresses?.[index]
                    ?.street && (
                    <p className="mt-1 text-xs text-destructive">
                      {
                        errors.addresses[index]
                          ?.street?.message
                      }
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-xs">
                    City
                  </Label>

                  <Input
                    disabled={readOnly}
                    {...register(
                      `addresses.${index}.city`,
                    )}
                  />

                  {errors.addresses?.[index]
                    ?.city && (
                    <p className="mt-1 text-xs text-destructive">
                      {
                        errors.addresses[index]
                          ?.city?.message
                      }
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-xs">
                    County
                  </Label>

                  <Input
                    disabled={readOnly}
                    {...register(
                      `addresses.${index}.county`,
                    )}
                  />
                </div>

                <div>
                  <Label className="text-xs">
                    Postal code
                  </Label>

                  <Input
                    disabled={readOnly}
                    {...register(
                      `addresses.${index}.postalCode`,
                    )}
                  />
                </div>

                <div>
                  <Label className="text-xs">
                    Country
                  </Label>

                  <Input
                    disabled={readOnly}
                    {...register(
                      `addresses.${index}.country`,
                    )}
                  />

                  {errors.addresses?.[index]
                    ?.country && (
                    <p className="mt-1 text-xs text-destructive">
                      {
                        errors.addresses[index]
                          ?.country?.message
                      }
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <Checkbox
                    checked={
                      address?.isPrimary ?? false
                    }
                    disabled={readOnly}
                    onCheckedChange={(checked) =>
                      handlePrimaryChange(
                        index,
                        Boolean(checked),
                      )
                    }
                  />

                  <Label className="text-xs">
                    Primary address
                  </Label>
                </div>
              </div>

              {/* Google metadata */}
              {isGoogleAddress && (
                <div className="grid grid-cols-3 gap-3 border-t pt-3">
                  <div>
                    <Label className="text-xs">
                      Google Place ID
                    </Label>

                    <Input
                      disabled
                      {...register(
                        `addresses.${index}.googlePlaceId`,
                      )}
                    />
                  </div>

                  <div>
                    <Label className="text-xs">
                      Latitude
                    </Label>

                    <Input
                      disabled
                      value={
                        address?.latitude != null
                          ? String(
                              address.latitude,
                            )
                          : ""
                      }
                      readOnly
                    />
                  </div>

                  <div>
                    <Label className="text-xs">
                      Longitude
                    </Label>

                    <Input
                      disabled
                      value={
                        address?.longitude != null
                          ? String(
                              address.longitude,
                            )
                          : ""
                      }
                      readOnly
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};