import React, { useState } from "react";
// import { usePlacesAutocomplete } from "@/hooks/usePlacesAutocomplete";
import useDebounce from "../custom-hooks/debounce";
import { usePlacesAutocomplete } from "../custom-hooks/usePlacesAutocomplete";
// import { useDebounce } from "@/hooks/useDebounce";

interface LocationAutocompleteProps {
  onSelect: (place: { place_id: string; description: string }) => void;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({ onSelect }) => {
  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input, 400);

  const { data: suggestions, isLoading } =
    usePlacesAutocomplete(debouncedInput);

  return (
    <div className="relative w-full">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search location..."
        className="w-full border rounded-md p-3"
      />

      {suggestions?.length > 0 && (
        <div className="absolute w-full bg-white shadow-md rounded-md mt-1 z-50">
          {suggestions.map((place: { place_id: string; description: string }) => (
            <div
              key={place.place_id}
              onClick={() => {
                onSelect(place);
                setInput(place.description);
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {place.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
