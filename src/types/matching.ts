export interface MatchingPreferencesPayload {
  // 1. Location (Weight: 20)
  suburbs: string[];
  searchRadius: "exact" | "5km" | "10km" | "25km" | "any";

  // 2. Weekly budget (Weight: 20)
  minBudget: number | "";
  maxBudget: number | "";
  isBudgetFlexible: boolean;

  // 3. Bedrooms (Weight: 12)
  minBedrooms: number | "";

  // 4. Move-in timing (Weight: 10)
  earliestMoveInDate: string;
  latestMoveInDate: string;

  // 5. Accessibility (Weight: 10)
  essentialAccessibility: string[];
  preferredAccessibility: string[];

  // 6. Bathrooms (Weight: 8)
  minBathrooms: number | "";

  // 7. Property type (Weight: 8)
  propertyTypes: string[];
  acceptableAlternativeTypes: string[];

  // 8. Pets (Weight: 7)
  hasPets: boolean;
  petDetails?: string;

  // 9. Parking (Weight: 5)
  parkingRequirement: "essential" | "preferred" | "not_needed";
  parkingSpaces: number | "";
}

export const defaultMatchingPreferences: MatchingPreferencesPayload = {
  suburbs: [],
  searchRadius: "10km",
  minBudget: "",
  maxBudget: "",
  isBudgetFlexible: false,
  minBedrooms: 1,
  earliestMoveInDate: "",
  latestMoveInDate: "",
  essentialAccessibility: [],
  preferredAccessibility: [],
  minBathrooms: 1,
  propertyTypes: ["Apartment"],
  acceptableAlternativeTypes: [],
  hasPets: false,
  petDetails: "",
  parkingRequirement: "preferred",
  parkingSpaces: 1,
};
