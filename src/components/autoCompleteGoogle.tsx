// src/components/ui/GooglePlacesAutocomplete.tsx
import React, { forwardRef, useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { Input } from './ui/input'; // adjust path
import { cn } from './lib/utils';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
};

const GooglePlacesAutocomplete = forwardRef<HTMLInputElement, Props>(
  (
    {
      value,
      onChange,
      onPlaceSelect,
      placeholder = 'Search for a location...',
      className,
      error,
      disabled,
    },
    ref
  ) => {
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const handlePlaceChanged = () => {
      const autocomplete = autocompleteRef.current;
      if (!autocomplete) return;

      const place = autocomplete.getPlace();
      if (!place?.formatted_address) return;

      onPlaceSelect?.(place);
      onChange(place.formatted_address); // most common use-case
    };

    return (
      <div className={cn('relative w-full', className)}>
        <Autocomplete
          onLoad={(auto) => (autocompleteRef.current = auto)}
          onPlaceChanged={handlePlaceChanged}
          // You can restrict here globally or per-instance
          // options={{ componentRestrictions: { country: 'in' } }}
        >
          <Input
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(error && 'border-red-500 focus-visible:ring-red-500')}
          />
        </Autocomplete>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

GooglePlacesAutocomplete.displayName = 'GooglePlacesAutocomplete';

export default GooglePlacesAutocomplete;