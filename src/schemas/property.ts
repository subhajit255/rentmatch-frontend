import { z } from "zod";

export const addPropertyValidateSchema = z.object({
  is_complete: z.boolean(),
  property_details: z.object({
    basic: z.object({
      property_name: z.string().min(1, "Property name is required"),
      property_no: z.string().min(1, "Property no is required"),
      property_type_id: z.string().min(1, "Please select a property type"),
      is_available_for_rent: z.boolean(),
      subrup: z.string().optional(),
      // year_built: z.string().optional(),
      country: z.string().optional(),
      state: z.string().optional(),
      city: z.string().optional(),
      pincode: z.string().optional(),
      // region_area: z.string().optional(),
      full_address: z.string().optional(),
      description: z.string().optional(),
    }),
    rent_details: z.object({
      weekly_rent_price: z.string().min(1, "Weekly rent is required"),
      // monthly_rent_price: z.string().optional().nullable(),
      bond_or_security_deposit: z.string().min(1, "Security deposit is required"),
      available_from: z.date(),
      rent_details_lease_terms: z.string().min(1, "Lease terms required"),
    }),
    features: z.object({
      no_of_bedrooms: z.string().optional(),
      no_of_bathrooms: z.string().optional(),
      parking: z.string().optional(),
      no_of_garage: z.string().optional(),
      land_size: z.string().optional(),
      floor_area: z.string().optional(),
    }),
    interior: z.object().optional(),
    outdoor: z.object({
      features: z.array(z.string()).nonempty("Please select at least one feature"),
      outdoor_entering_area: z.array(z.string()).nonempty("Please select at least one outdoor entering area"),
    }),
    amenities_features: z.array(z.string().optional()).optional(),
    additional_information: z.object({
      pets: z.enum(["ALLOWED", "NOT_ALLOWED", "CASE_BY_CASE"]),
      description: z.string().optional(),
      energy_rating: z.number().min(0).max(10),
    }),
  }),
});

// Infer the type from the schema
// export type AddPropertyInput = z.infer<typeof addPropertyValidateSchema>;
