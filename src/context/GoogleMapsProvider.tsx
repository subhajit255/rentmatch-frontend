// src/context/GoogleMapsProvider.tsx
import React, {
  createContext,
  useContext,
  useMemo,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
const GooglemapKey: string = process.env.REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY || '';
if (!GooglemapKey) {
  console.warn('[GoogleMapsProvider] REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY is not set in .env');
}


const LIBRARIES: ("places")[] = ['places'];

type GoogleMapsContextType = {
  isLoaded: boolean;
  loadError: Error | undefined;
};

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(undefined);

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  const { isLoaded, loadError } = useJsApiLoader({
    // googleMapsApiKey: process.env.REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    googleMapsApiKey: GooglemapKey,
    libraries: LIBRARIES,
    id: 'google-maps-script',           // same ID = reuse if already loaded
    nonce: undefined,
  });

  // Optional: log once when loaded (for debugging)
  useEffect(() => {
    if (isLoaded) {
      console.log('Google Maps JS API loaded');
    }
    if (loadError) {
      console.error('Google Maps failed to load:', loadError);
    }
  }, [isLoaded, loadError]);

  const value = useMemo(() => ({ isLoaded, loadError }), [isLoaded, loadError]);

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext);
  if (context === undefined) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
}