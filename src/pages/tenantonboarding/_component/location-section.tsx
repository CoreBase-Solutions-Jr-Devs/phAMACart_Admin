import { Crosshair, Loader2, MapPin, RotateCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GooglePlaceAddressInput } from "@/features/deliverysettings/deliverySettingsType";
import { useLocationResolver } from "@/hooks/use-location-resolver";

interface LocationSectionProps {
  address: GooglePlaceAddressInput;
  onUpdateField: (key: keyof GooglePlaceAddressInput, value: string) => void;
  onResolvedAddress: (address: GooglePlaceAddressInput) => void;
}

export function LocationSection({
  address,
  onUpdateField,
  onResolvedAddress,
}: LocationSectionProps) {
  const {
    query,
    predictions,
    isSearching,
    isResolving,
    isLocating,
    error,
    search,
    selectPrediction,
    resolveByPlaceId,
    useCurrentLocation,
  } = useLocationResolver({ onResolve: onResolvedAddress });

  const isBusy = isSearching || isResolving || isLocating;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
        <CardDescription>
          Google Places details for the pharmacy's physical location.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* SEARCH / RESOLVER */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="address-search">Search for an address</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={useCurrentLocation}
              disabled={isBusy}
            >
              {isLocating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Crosshair className="size-4" />
              )}
              Use current location
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            {(isSearching || isResolving) && (
              <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
            <Input
              id="address-search"
              className="pl-9"
              value={query}
              onChange={(event) => search(event.target.value)}
              placeholder="Start typing an address to auto-fill the fields below"
              autoComplete="off"
            />
            {predictions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border bg-popover shadow-md">
                {predictions.map((prediction) => (
                  <button
                    key={prediction.placeId}
                    type="button"
                    onClick={() => selectPrediction(prediction)}
                    className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span className="flex flex-col">
                      <span className="truncate">
                        {prediction.primaryText}
                      </span>
                      {prediction.secondaryText && (
                        <span className="truncate text-xs text-muted-foreground">
                          {prediction.secondaryText}
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <p className="text-xs text-muted-foreground">
            Selecting a suggestion or using your current location fills in
            the fields below. Street isn't returned by the lookup, so add
            it by hand; everything else you can still edit afterwards.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="address-street">Street</Label>
            <Input
              id="address-street"
              value={address.street}
              onChange={(event) => onUpdateField("street", event.target.value)}
              placeholder="Malindi Road"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address-city">City</Label>
            <Input
              id="address-city"
              value={address.city}
              onChange={(event) => onUpdateField("city", event.target.value)}
              placeholder="Mombasa"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address-county">County</Label>
            <Input
              id="address-county"
              value={address.county}
              onChange={(event) => onUpdateField("county", event.target.value)}
              placeholder="Mombasa"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address-postal-code">Postal code</Label>
            <Input
              id="address-postal-code"
              value={address.postalCode}
              onChange={(event) =>
                onUpdateField("postalCode", event.target.value)
              }
              placeholder="80100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address-country">Country</Label>
            <Input
              id="address-country"
              value={address.country}
              onChange={(event) => onUpdateField("country", event.target.value)}
              placeholder="KE"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="google-place-id">Google Place ID</Label>
            <div className="flex gap-2">
              <Input
                id="google-place-id"
                value={address.googlePlaceId}
                onChange={(event) =>
                  onUpdateField("googlePlaceId", event.target.value)
                }
                placeholder="ChIJ..."
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!address.googlePlaceId.trim() || isResolving}
                onClick={() => resolveByPlaceId(address.googlePlaceId)}
                title="Resolve address from this Place ID"
                aria-label="Resolve address from this Place ID"
              >
                {isResolving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RotateCw className="size-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Pasted a Place ID directly? Click resolve to pull the rest of
              the address.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address-latitude">Latitude</Label>
            <Input
              id="address-latitude"
              type="number"
              step="any"
              value={address.latitude}
              onChange={(event) =>
                onUpdateField("latitude", event.target.value)
              }
              placeholder="-4.0435"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address-longitude">Longitude</Label>
            <Input
              id="address-longitude"
              type="number"
              step="any"
              value={address.longitude}
              onChange={(event) =>
                onUpdateField("longitude", event.target.value)
              }
              placeholder="39.6682"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}