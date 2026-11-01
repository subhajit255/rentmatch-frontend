import { useQuery } from "@tanstack/react-query";

const GOOGLE_API_KEY = process.env.REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY || "АlzaSyB_b__IPFobrnyz8Uo31egsWQfoKWdkfvM";

export const usePlacesAutocomplete = (input: string) => {
  return useQuery({
    queryKey: ["places-autocomplete", input],
    queryFn: async () => {
      if (!input) return [];

      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_API_KEY}`
      );

      const data = await res.json();
      return data.predictions || [];
    },
    enabled: !!input,
    staleTime: 1000 * 60 * 5,
  });
};
