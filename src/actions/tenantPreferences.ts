import api from ".";
import { MatchingPreferencesPayload } from "../types/matching";

const PREFERENCES_STORAGE_KEY_PREFIX = "rentmatch_tenant_matching_preferences_";
const HAS_SETUP_KEY_PREFIX = "rentmatch_tenant_has_setup_preferences_";

export const getStorageKey = (userId?: string) => {
  return `${PREFERENCES_STORAGE_KEY_PREFIX}${userId || "current"}`;
};

export const getHasSetupKey = (userId?: string) => {
  return `${HAS_SETUP_KEY_PREFIX}${userId || "current"}`;
};

export const getTenantPreferencesApi = async (
  userId?: string
): Promise<{ data: MatchingPreferencesPayload | null; hasSetup: boolean }> => {
  const hasSetup = localStorage.getItem(getHasSetupKey(userId)) === "true";
  const localSaved = localStorage.getItem(getStorageKey(userId));
  let localData: MatchingPreferencesPayload | null = null;
  if (localSaved) {
    try {
      localData = JSON.parse(localSaved);
    } catch {
      localData = null;
    }
  }

  try {
    const res = await api.get("/tenant/preference");
    if (res?.data?.success && res?.data?.result) {
      const result = res.data.result;

      // Extract all suburbs (handling both array and single string)
      const parsedSuburbs: string[] = Array.isArray(result.suburbs) && result.suburbs.length > 0
        ? result.suburbs
        : (result.suburb ? [result.suburb] : []);

      // Extract all property types (handling both array and single string)
      const parsedPropertyTypes: string[] = Array.isArray(result.property_types) && result.property_types.length > 0
        ? result.property_types
        : (result.property_type ? [result.property_type] : ["Apartment"]);

      // Separate minBudget and maxBudget correctly
      const minB = result.min_budget !== undefined && result.min_budget !== null && result.min_budget !== ""
        ? Number(result.min_budget)
        : (result.weekly_budget !== undefined && result.weekly_budget !== null && result.weekly_budget !== "" ? Number(result.weekly_budget) : "");

      const maxB = result.max_budget !== undefined && result.max_budget !== null && result.max_budget !== ""
        ? Number(result.max_budget)
        : (result.weekly_budget !== undefined && result.weekly_budget !== null && result.weekly_budget !== "" ? Number(result.weekly_budget) : minB);

      const formatted: MatchingPreferencesPayload = {
        suburbs: parsedSuburbs,
        searchRadius:
          result.max_radius_km === 0
            ? "exact"
            : (`${result.max_radius_km}km` as any) || "10km",
        minBudget: minB,
        maxBudget: maxB,
        isBudgetFlexible: Boolean(result.is_budget_flexible),
        minBedrooms: result.bedrooms ?? 1,
        earliestMoveInDate: result.move_in_timing
          ? new Date(result.move_in_timing).toISOString().split("T")[0]
          : "",
        latestMoveInDate: result.move_in_latest
          ? new Date(result.move_in_latest).toISOString().split("T")[0]
          : "",
        essentialAccessibility:
          result.accessibility?.essential_features || [],
        preferredAccessibility:
          result.accessibility?.preferred_features || [],
        minBathrooms: result.bathrooms ?? 1,
        propertyTypes: parsedPropertyTypes,
        acceptableAlternativeTypes: [],
        hasPets: Boolean(result.is_having_pets),
        petDetails: Array.isArray(result.pet_types)
          ? result.pet_types.join(", ")
          : "",
        parkingRequirement: result.parking ? "essential" : "not_needed",
        parkingSpaces: result.parking_spaces || 1,
      };

      localStorage.setItem(getStorageKey(userId), JSON.stringify(formatted));
      localStorage.setItem(getHasSetupKey(userId), "true");
      return { data: formatted, hasSetup: true };
    } else if (res?.data?.has_preference === false) {
      return { data: localData, hasSetup: false };
    }
  } catch (err) {
    console.warn("GET /tenant/preference failed, using local cache:", err);
  }

  return { data: localData, hasSetup: hasSetup && localData !== null };
};

export const saveTenantPreferencesApi = async (
  payload: MatchingPreferencesPayload,
  userId?: string
): Promise<{ success: boolean; data: any }> => {
  // Always update local storage first so UI reacts immediately
  localStorage.setItem(getStorageKey(userId), JSON.stringify(payload));
  localStorage.setItem(getHasSetupKey(userId), "true");

  // Format payload to match backend saveUserPreference controller
  const radiusMap: Record<string, number> = {
    exact: 0,
    "5km": 5,
    "10km": 10,
    "25km": 25,
  };

  const selectedSuburbs = Array.isArray(payload.suburbs) ? payload.suburbs : [];
  const primarySuburb = selectedSuburbs.length > 0 ? selectedSuburbs[0] : "";

  const minB = payload.minBudget !== "" && payload.minBudget !== undefined ? Number(payload.minBudget) : null;
  const maxB = payload.maxBudget !== "" && payload.maxBudget !== undefined ? Number(payload.maxBudget) : minB;
  const weeklyB = maxB !== null ? maxB : (minB !== null ? minB : 0);

  const selectedPropertyTypes = Array.isArray(payload.propertyTypes) ? payload.propertyTypes : ["Apartment"];
  const primaryPropertyType = selectedPropertyTypes.length > 0 ? selectedPropertyTypes[0] : "Apartment";

  const backendPayload = {
    suburb: primarySuburb,
    suburbs: selectedSuburbs,
    maxRadiusKm: radiusMap[payload.searchRadius] ?? 10,
    minBudget: minB,
    maxBudget: maxB,
    weeklyBudget: weeklyB,
    isBudgetFlexible: Boolean(payload.isBudgetFlexible),
    bedrooms: Number(payload.minBedrooms || 0),
    bathrooms: Number(payload.minBathrooms || 0),
    propertyType: primaryPropertyType,
    propertyTypes: selectedPropertyTypes,
    isHavingPets: Boolean(payload.hasPets),
    petTypes: payload.petDetails
      ? [payload.petDetails]
      : payload.hasPets
      ? ["Pet"]
      : [],
    parking: payload.parkingRequirement !== "not_needed",
    parkingSpaces:
      payload.parkingRequirement !== "not_needed"
        ? Number(payload.parkingSpaces || 1)
        : 0,
    moveInTiming: payload.earliestMoveInDate || null,
    moveInLatest: payload.latestMoveInDate || null,
    essentialAccessibility: payload.essentialAccessibility || [],
    preferredAccessibility: payload.preferredAccessibility || [],
  };

  try {
    // Backend routes PUT and POST on /tenant/preference
    const res = await api.put("/tenant/preference", backendPayload);
    return { success: true, data: res?.data?.result || res?.data };
  } catch (err: any) {
    console.warn("PUT /tenant/preference error, trying POST fallback:", err);
    try {
      const postRes = await api.post("/tenant/preference", backendPayload);
      return { success: true, data: postRes?.data?.result || postRes?.data };
    } catch (postErr) {
      console.warn("POST /tenant/preference fallback also failed:", postErr);
      return { success: true, data: backendPayload };
    }
  }
};
