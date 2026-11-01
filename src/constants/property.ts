import { AdditionalInfoState, CountryData, defaultDetailsType, InteriorState, OutdoorState, PropertyAminitiesState } from "../types/property";

export const SUBRUPS = [
  { id: 0, value: "CENTRAL", title: "Central" },
  { id: 1, value: "DOWNTOWN", title: "Downtown" },
  { id: 2, value: "RIVERSIDE", title: "Riverside" },
  { id: 3, value: "LAKESIDE", title: "Lakeside" },
  { id: 4, value: "WEST END", title: "West End" },
  { id: 5, value: "EAST END", title: "East End" },
  { id: 6, value: "NORTH VALLEY", title: "North Valley" },
  { id: 7, value: "SOUTH PARK", title: "South Park" },
  { id: 8, value: "GREENFIELD", title: "Greenfield" },
  { id: 9, value: "HILLTOP", title: "Hilltop" },
  { id: 10, value: "MEADOWVILLE", title: "Meadowville" },
  { id: 11, value: "OAKWOOD", title: "Oakwood" },
  { id: 12, value: "MAPLE GROVE", title: "Maple Grove" },
  { id: 13, value: "BROOKSIDE", title: "Brookside" },
  { id: 14, value: "SUNNYVALE", title: "Sunnyvale" },
  { id: 15, value: "HIGHLAND", title: "Highland" },
  { id: 16, value: "MIDTOWN", title: "Midtown" },
  { id: 17, value: "SPRINGDALE", title: "Springdale" },
  { id: 18, value: "ROSEWOOD", title: "Rosewood" },
  { id: 19, value: "FAIRVIEW", title: "Fairview" }
];

export const AUSTRALIA_DATA: CountryData = {
  "New South Wales": {
    "Sydney": {
      headquarters: "Sydney",
      postcodes: ["2000", "2001", "2007", "2010", "2150"],
      latLng: { lat: -33.8688, lng: 151.2093 },
      popularCities: [
        "Sydney",
        "Parramatta",
        "Penrith",
        "Liverpool",
        "Blacktown"
      ]
    },

    "Newcastle": {
      headquarters: "Newcastle",
      postcodes: ["2300", "2302", "2304"],
      latLng: { lat: -32.9283, lng: 151.7817 },
      popularCities: [
        "Newcastle",
        "Lake Macquarie",
        "Maitland"
      ]
    }
  },

  "Victoria": {
    Melbourne: {
      headquarters: "Melbourne",
      postcodes: ["3000", "3001", "3004", "3051"],
      latLng: { lat: -37.8136, lng: 144.9631 },
      popularCities: [
        "Melbourne",
        "Geelong",
        "Footscray",
        "St Kilda"
      ]
    },

    Ballarat: {
      headquarters: "Ballarat",
      postcodes: ["3350", "3353"],
      latLng: { lat: -37.5622, lng: 143.8503 },
      popularCities: [
        "Ballarat",
        "Wendouree"
      ]
    }
  },

  "Queensland": {
    Brisbane: {
      headquarters: "Brisbane",
      postcodes: ["4000", "4001", "4006"],
      latLng: { lat: -27.4698, lng: 153.0251 },
      popularCities: [
        "Brisbane",
        "Logan",
        "Ipswich",
        "Redcliffe"
      ]
    },

    "Gold Coast": {
      headquarters: "Gold Coast",
      postcodes: ["4217", "4218", "4220"],
      latLng: { lat: -28.0167, lng: 153.4000 },
      popularCities: [
        "Surfers Paradise",
        "Southport",
        "Broadbeach"
      ]
    }
  },

  "Western Australia": {
    Perth: {
      headquarters: "Perth",
      postcodes: ["6000", "6003", "6005"],
      latLng: { lat: -31.9505, lng: 115.8605 },
      popularCities: [
        "Perth",
        "Fremantle",
        "Joondalup"
      ]
    }
  },

  "South Australia": {
    Adelaide: {
      headquarters: "Adelaide",
      postcodes: ["5000", "5006", "5008"],
      latLng: { lat: -34.9285, lng: 138.6007 },
      popularCities: [
        "Adelaide",
        "Glenelg",
        "Elizabeth"
      ]
    }
  },

  "Tasmania": {
    Hobart: {
      headquarters: "Hobart",
      postcodes: ["7000", "7005", "7018"],
      latLng: { lat: -42.8821, lng: 147.3272 },
      popularCities: [
        "Hobart",
        "Kingston",
        "Glenorchy"
      ]
    }
  },

  "Australian Capital Territory": {
    Canberra: {
      headquarters: "Canberra",
      postcodes: ["2600", "2601", "2612"],
      latLng: { lat: -35.2809, lng: 149.1300 },
      popularCities: [
        "Canberra",
        "Belconnen",
        "Woden"
      ]
    }
  },

  "Northern Territory": {
    Darwin: {
      headquarters: "Darwin",
      postcodes: ["0800", "0810"],
      latLng: { lat: -12.4634, lng: 130.8456 },
      popularCities: [
        "Darwin",
        "Palmerston"
      ]
    },

    "Alice Springs": {
      headquarters: "Alice Springs",
      postcodes: ["0870"],
      latLng: { lat: -23.6980, lng: 133.8807 },
      popularCities: [
        "Alice Springs"
      ]
    }
  }
}


export const getStates = () =>
  Object.keys(AUSTRALIA_DATA).map(state => ({
    label: state,
    value: state
  }))

export const getRegions = (state: string) =>
  Object.keys(AUSTRALIA_DATA[state] || {}).map(region => ({
    label: region,
    value: region
  }))

export const getPostcodes = (state: string, region: string) =>
  AUSTRALIA_DATA[state]?.[region]?.postcodes || []



export const garages = [
  { id: 1, title: '1', value: '1' },
  { id: 2, title: '2', value: '2' },
  { id: 3, title: '3', value: '3' },
  { id: 4, title: '4', value: '4' },
  { id: 5, title: '5+', value: '5' },
  { id: 6, title: '0', value: '0' },
];

export const bedrooms = [
  { id: 7, title: '0', value: '0' },
  { id: 1, title: '1', value: '1' },
  { id: 2, title: '2', value: '2' },
  { id: 3, title: '3', value: '3' },
  { id: 4, title: '4', value: '4' },
  { id: 5, title: '5+', value: '5' },
];

export const bathrooms = [
  { id: 7, title: '0', value: '0' },
  { id: 1, title: '1', value: '1' },
  { id: 2, title: '2', value: '2' },
  { id: 3, title: '3', value: '3' },
  { id: 4, title: '4', value: '4' },
  { id: 5, title: '5+', value: '5' },
];

export const balcony = [
  { id: 7, title: '0', value: '0' },
  { id: 1, title: '1', value: '1' },
  { id: 2, title: '2', value: '2' },
  { id: 3, title: '3', value: '3' },
  { id: 4, title: '4', value: '4' },
  { id: 5, title: '5+', value: '5' },
];
// **************************************************************
export const about_you = [
  { id: 1, title: 'Student', value: 'student' },
  { id: 2, title: 'Working Professional', value: 'working_professional' },
  { id: 3, title: 'Family', value: 'family' },
  { id: 4, title: 'Couple', value: 'couple' },
  { id: 5, title: 'Retired', value: 'retired' },
  { id: 6, title: 'Business Owner', value: 'business_owner' },
];
export const employment_status = [
  { id: 1, title: 'Full-Time', value: 'full_time' },
  { id: 2, title: 'Part-Time', value: 'part_time' },
  { id: 3, title: 'Self-Employed', value: 'self_employed' },
  { id: 4, title: 'Student', value: 'student' },
];
export const pets = [
  { id: 1, title: 'No Pets', value: 'no_pets' },
  { id: 2, title: 'Cat', value: 'cat' },
  { id: 3, title: 'Dog', value: 'dog' },
  { id: 4, title: 'Other', value: 'other' },
];
export const smoking_preference = [
  { id: 1, title: 'Non-Smoker', value: 'non_smoker' },
  { id: 2, title: 'Smoker', value: 'smoker' },
];
// ***************************************************************



export const propertyBasicTab = [
  {
    tab: "Property Basics",
    id: "0",
    extension: "property-basics",
  },
  {
    tab: "Rent Details",
    id: "1",
    extension: "rent-details",
  },
  {
    tab: "Property Features",
    id: "2",
    extension: "property-features",

  },
  {
    tab: "Interior Features",
    id: "3",
    extension: "intirior-features",
  },
  {
    tab: "Outdoor Features",
    id: "4",
    extension: "outdoor-features",
  },
  // {
  //   tab: "Amenities",
  //   id: "5",
  //   extension: "aminities",
  // },
  {
    tab: "Additional Information",
    id: "6",
    extension: "additional-information",
  },
  {
    tab: "Property Images & Documents",
    id: "7",
    extenstion: "property-image-n-documents",
  },
  {
    tab: "Property Owner Details",
    id: "8",
    extenstion: "owner-details",
  }
]

export const default_basics = {
  "property_name": "",
  "property_no": "",
  "property_type_id": "",
  "is_available_for_rent": false,
  "subrup": "",
  "country": "",
  "state": "",
  "city": "",
  "pincode": "",
  "full_address": "", //optional
  "latitude": "",
  "longitude": "",
  "description": ""
}

export const owner_details_byPM = {
  first_name: "",
  middle_name: "",
  last_name: "",
  phone_number: "",
  email: "",
  full_address: "",
}

export const defaultFeatures = {
  "no_of_bedrooms": "",
  "no_of_bathrooms": "",
  "parking": "",
  "no_of_garage": "",
  "land_size": "", // mtr square, optional
  "floor_area": "" // mtr square, optional
}

export const defaultDetails: defaultDetailsType = { //"rent_details":
  "weekly_rent_price": "",
  "monthly_rent_price": "",
  "bond_or_security_deposit": "",
  "available_from": new Date(), //dd/mm/yy
  "rent_details_lease_terms": "6" // in months only
};

// ensure the default value has the correct type
export const defaultInterior: InteriorState = {
  living_spaces: [],
  climate_and_comfort: [],
  kitchen_features: [],
  bedroom_features: [],
  bathroom_features: [],
  laundry: [],
  storage: [],
  security_and_access: [],
  finishes_and_extras: [],
  tech_and_connectivity: [],
};

export const defaultOutdoor: OutdoorState = {
  features: [],
  outdoor_entering_area: [], //"Shed", "Storage"
};

export const propertyAminities: PropertyAminitiesState = []

export const defaultAdditionalInformation: AdditionalInfoState = {
  pets: "ALLOWED",
  description: "",
  energy_rating: 4,
};
