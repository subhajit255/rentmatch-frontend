import api from ".";
import { buildUploadFormData, PropertyPayload, toFormData } from "./common";
import {
  ACCEPT_REJECT_PROPERTY_REQUEST_URL,
  EXPLOER_PROPERTY,
  PROPERTY_ADD_URL,
  PROPERTY_DETAILS_URL,
  PROPERTY_DOCUMENTS_UPLOAD_URL,
  PROPERTY_GET_URL,
  PROPERTY_URL,
  REQUEST_LIST_URL,
  SAVED_PROPERTY,
  TENANT_PROPERTY_GET_URL,
  TENANT_PROPERTY_WISHLIST_ADD_URL,
  TENANT_PROPERTY_WISHLIST_REMOVE_URL,
  TENANT_REQUEST_PROPERTY_WISE_URL,
  TENANT_SEND_PROPERTY_REQUEST_URL,
  MASTER_PROPERTY_URL,
} from "./constant";

export const getProperty = async (currPage: number, lengthPerPage: number) => {
  const res = await api.get(`${PROPERTY_GET_URL}/${currPage}/${lengthPerPage}`);
  return res.data;
};

export const deletePropertyApi = async (id: string) => {
  const res = await api.delete(PROPERTY_URL + "/" + id);
  return res.data;
};

export const rentalAvailabilityApi = async (id: string) => {
  const res = await api.get(PROPERTY_URL + "/set-rental-availability/" + id);
  return res.data;
};

export const addPropertyApi = async (payload: any) => {
  const res = await api.post(PROPERTY_ADD_URL, payload);
  return res.data;
};

export const getMasterDataProperty = async () => {
  const res = await api.get(MASTER_PROPERTY_URL);
  return res.data;
};

export const getTenantProperty = async () => {
  const res = await api.get(TENANT_PROPERTY_GET_URL);
  return res.data;
};

export const sendPropertyRequestApi = async (property_object_id: string) => {
  const res = await api.post(TENANT_SEND_PROPERTY_REQUEST_URL, {
    property_object_id,
  });
  return res.data;
};

export const acceptRejectPropertyRequestApi = async (payload: any) => {
  const res = await api.patch(ACCEPT_REJECT_PROPERTY_REQUEST_URL, payload);
  return res.data;
};

export const tenantPropertyWishlistAddApi = async (
  property_object_id: string,
) => {
  const res = await api.post(TENANT_PROPERTY_WISHLIST_ADD_URL, {
    property_object_id,
  });
  return res.data;
};

export const tenantPropertyWishlistRemoveApi = async (id: string) => {
  const res = await api.delete(TENANT_PROPERTY_WISHLIST_REMOVE_URL + "/" + id);
  return res.data;
};

export const getAllProperty = async (
  params: {
    search?: any;
    page?: number;
    limit?: number;
    start_price?: string;
    end_price?: string;
    start_size?: string;
    end_size?: string;
    bedrooms?: string;
    bathrooms?: string;
    garages?: string;
    balcony?: string;
    amenities?: any;
    type?: string;
    location?: string;
    sort?: string;
    sort_by_price?: string;
    property_type?: string;
    lat?: string;
    lng?: string
  } = {},
) => {
  const { page, limit,search, ...filters } = params;

  const url =
    page && limit ? EXPLOER_PROPERTY + `/${page}/${limit}` : EXPLOER_PROPERTY;

  const cleanedFilters: Record<string, string> = {};
  if (search && search.trim() !== "") {
    cleanedFilters.search = search.trim();
  }

  // Special handling for amenities
  if (Array.isArray(filters.amenities) && filters.amenities.length > 0) {
    cleanedFilters.amenities = filters.amenities.join(",");
  } else if (
    typeof filters.amenities === "string" &&
    filters.amenities.trim()
  ) {
    cleanedFilters.amenities = filters.amenities.trim();
  }
  (
    [
      "search",
      "start_price",
      "end_price",
      "start_size",
      "end_size",
      "bedrooms",
      "bathrooms",
      "garages",
      "balcony",
      "type",
      "location",
      "sort",
      "sort_by_price",
      "property_type",
      "lat",
      "lng"
    ] as (keyof typeof filters)[]
  ).forEach((key) => {
    const value = filters[key];
    if (value != null && value !== "" && value !== "0") {
      // adjust "0" logic if needed
      cleanedFilters[key] = String(value).trim();
    }
  });
  const res = await api.get(url, { params: cleanedFilters });
  return res.data;
};

export const getFeaturedProperty = async (
  params: {
    search?: any;
    page?: number;
    limit?: number;
    sort?: string;
  } = {},
) => {
  const { page, limit,search } = params;

  // const url = page && limit ? "group-owner/property/featured-list" + `/${page}/${limit}` : "group-owner/property/featured-list";
  const url ="group-owner/property/featured-list";
  const res = await api.get(url); //, { params: { search: search } }
  return res.data;
};

export const getAllPropertyCMS = async (
  params: {
    search?: string;
    page?: number;
    limit?: number;
    start_price?: string;
    end_price?: string;
    start_size?: string;
    end_size?: string;
    bedrooms?: string;
    bathrooms?: string;
    garages?: string;
    balcony?: string;
    amenities?: any;
    type?: string;
    location?: string;
    sort?: string;
    sort_by_price?: string;
    property_type?: string;
  } = {},
) => {
  const { page, limit, ...filters } = params;
  const url =
    page && limit ? `/cms` + EXPLOER_PROPERTY + `/${page}/${limit}` : `/cms` + EXPLOER_PROPERTY;

  const cleanedFilters: Record<string, string> = {};

  // Special handling for amenities
  if (Array.isArray(filters.amenities) && filters.amenities.length > 0) {
    cleanedFilters.amenities = filters.amenities.join(",");
  } else if (
    typeof filters.amenities === "string" &&
    filters.amenities.trim()
  ) {
    cleanedFilters.amenities = filters.amenities.trim();
  }
  (
    [
      "search",
      "start_price",
      "end_price",
      "start_size",
      "end_size",
      "bedrooms",
      "bathrooms",
      "garages",
      "balcony",
      "type",
      "location",
      "sort",
      "sort_by_price",
      "property_type",
    ] as (keyof typeof filters)[]
  ).forEach((key) => {
    const value = filters[key];
    if (value != null && value !== "" && value !== "0") {
      // adjust "0" logic if needed
      cleanedFilters[key] = String(value).trim();
    }
  });

  // _____-If amenities is array → convert to comma-separated string____
  //   const queryParams = {
  //   ...filters,
  //   amenities: Array.isArray(filters.amenities)
  //     ? filters.amenities.join(",")
  //     : filters.amenities,
  // };

  // const res = await api.get(url, { params: { search: params.search } });
  const res = await api.get(url, { params: cleanedFilters });
  return res.data;
};

export const getSavedProperty = async (
  params: { search?: string; page?: number; limit?: number; propertyType?: string } = {},
) => {
  const { page, limit, propertyType } = params;
  const url =
    page && limit
      ? propertyType
        ? `${SAVED_PROPERTY}/${page}/${limit}/${propertyType}`
        : `${SAVED_PROPERTY}/${page}/${limit}`
      : SAVED_PROPERTY;
  const res = await api.get(url, { params: { search: params.search } });
  return res.data;
};

export const getPropertyRequestsApi = async (
  currPage: number,
  lengthPerPage: number,
) => {
  const res = await api.get(`${REQUEST_LIST_URL}/${currPage}/${lengthPerPage}`);
  return res.data;
};

export const uploadDocumentsApi = async (payload: PropertyPayload) => {
  // console.log("payload :: :", payload);

  const formData = buildUploadFormData(payload);
  // console.log("formData :: :", formData);
  const res = await api.post(`${PROPERTY_DOCUMENTS_UPLOAD_URL}`, formData);
  return res;
};

export const getTenantRequestsPropertyWiseApi = async (id: string) => {
  const res = await api.get(`${TENANT_REQUEST_PROPERTY_WISE_URL}/${id}`);
  return res.data;
};

export const getPropertyDetailsApi = async (id: string) => {
  const res = await api.get(`${PROPERTY_DETAILS_URL}/${id}`);
  return res.data;
};
