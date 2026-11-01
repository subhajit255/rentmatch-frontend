export type LatLng = {
  lat: number;
  lng: number;
};

export type RegionData = {
  headquarters: string;
  postcodes: string[];
  latLng: LatLng;
  popularCities: string[];
};

export type StateData = {
  [regionName: string]: RegionData;
};

export type CountryData = {
  [stateName: string]: StateData;
};

export type basicDetailsType = {
  "property_name": string,
  "property_no": string,
  "property_type_id": string,
  "is_available_for_rent": boolean,
  "subrup": string,
  "country": string,
  "state": string,
  "city": string,
  "pincode": string,
  
  "full_address": string, //optional
  "description": string,
  "latitude": string,
  "longitude": string
}

export type defaultDetailsType = {
  weekly_rent_price: string;
  monthly_rent_price: string;
  bond_or_security_deposit: string;
  available_from: Date
  rent_details_lease_terms: string; // in months only
};

export type defaultFeaturesType = {
  no_of_bedrooms: string | number;
  no_of_bathrooms: string;
  parking: string;
  no_of_garage: string;
  land_size: string;
  floor_area: string;
};

export type InteriorState = {

  living_spaces: string[];
  climate_and_comfort: string[];
  kitchen_features: string[];
  bedroom_features: string[];
  bathroom_features: string[];
  laundry: string[];
  storage: string[];
  security_and_access: string[];
  finishes_and_extras: string[];
  tech_and_connectivity: string[];
};

export type OutdoorState = {
  features?: string[];
  outdoor_entering_area: string[]; // multi-select: Shed, Storage, ...
};

export type PropertyAminitiesState = string[];

export type AdditionalInfoState = {
  pets: "ALLOWED" | "NOT_ALLOWED" | "CASE_BY_CASE";
  description: string;
  energy_rating: number;
};

export interface DocItem {
  _id?: string;
  data?: File | string; // string for edit mode (existing URL), File for new uploads
  is_featured?: boolean;
  url?: string;
  name?: string;
}

export interface DocumentsPayload {
  images: DocItem[] | [];
  videos: DocItem[] | [];
  floor_plans: DocItem[] | [];
}

export type schedulePayloadType = {
  date: Date | null;
  discription: string;
  property_object_id: string;
};

// ___________________

export interface PropertyTypeDetails {
  _id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  img: string;
  updatedAt: string;
  __v: number;
}

export interface PropertyBasicInfo {
  property_no: string | null;
  property_name: string;
  property_type_id: PropertyTypeDetails;
  is_available_for_rent: boolean;
  subrup: string;
  state: string;
  pincode: string;
  country: string;
  latitude: string;
  longitude: string;
  full_address: string;
  _id: string;
}

interface CompanyDetails {
  company_name: string | null;
  company_number: string | null;
  company_address: string | null;
  company_email: string | null;
  company_phone: string | null;
}

interface SubscriptionSetting {
  email: boolean;
  notification: boolean;
}

interface UserSubscription {
  super_admin_registration: SubscriptionSetting;
  admin_creation: SubscriptionSetting;
  admin_registration: SubscriptionSetting;
  member_creation: SubscriptionSetting;
  member_profile_updation: SubscriptionSetting;
}

interface PropertyUser {
  _id: string;
  role: "LANDLORD" | "TENANT" | "ADMIN"; // Added common roles
  email: string;
  __v: number;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  contact_label: string | null;
  country: string;
  createdAt: string;
  date: string;
  date_of_birth: string | null;
  devices_token: string | null;
  expiresAt: string | null;
  first_name: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  is_registered: boolean;
  is_subscribe: boolean;
  is_verified: boolean;
  last_login_date: string;
  last_name: string;
  member_id: string;
  member_status: string | null;
  middle_name: string | null;
  otp: string | null;
  phone_extension: number;
  phone_number: number;
  state: string | null;
  updatedAt: string;
  user_name: string;
  zip: string | null;
  company_details: CompanyDetails;
  subscription: UserSubscription;
  profile_image: string;
}

// ___________________-MAIN RESULT ________________
export interface PropertyResult {
  _id: string;
  property_id: string;
  is_complete: boolean;
  is_active: boolean;
  is_send_request: boolean;
  is_wishlist: boolean;
  is_cms_featured: boolean;
  property_details: {
    basic: PropertyBasicInfo;
    rent_details: defaultDetailsType;
    features: defaultFeaturesType;
    interior: defaultDetailsType;
    outdoor: defaultDetailsType;
    additional_information: defaultDetailsType;
    amenities_features: defaultDetailsType;
    nearby_amenities: defaultDetailsType;
    _id: defaultDetailsType;
    documents: defaultDetailsType;
  };
  createdAt: string;
  updatedAt: string;
}


export type advanceSearch = {
  search?: string
  start_price?: string
  end_price?: string
  start_size?: string
  end_size?: string
  garages?: string
  bathrooms?: string
  bedrooms?: string
  balcony?: string
  rentalCityPreference?: string
  rentalStatePreference?: string
}

export type visitInfoType = {
  address: string,
  lat: number,
  lng: number,
  city: string,
  country: string
}

export type ownerDetailsbyPMType = {
  first_name: string,
  middle_name: string,
  last_name: string,
  phone_number: string,
  email: string,
  full_address: string,
}
