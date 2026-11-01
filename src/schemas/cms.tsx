import { z } from "zod";

export const createPropertyTypeSchema = z.object({
  name: z
    .string()
    .min(3, "Please provide valid name")
    .max(100, "Please provide valid name"),

  description: z
    .string()
    .min(3, "Please provide valid description")
    .max(100, "Please provide valid description"),

  img: z.string().min(1, "Please provide a property Image"),
});

export const createFaqSchema = z.object({
  name: z
    .string()
    .min(3, "Please provide valid name")
    .max(100, "Please provide valid name"),

  description: z
    .string()
    .min(3, "Please provide valid description")
    .max(800, "Please provide valid description"),
});


export const createAdminSchema = z.object({
  first_name: z
    .string()
    .min(3, "Please provide valid first name")
    .max(100, "Please provide valid first name"),
  last_name: z
    .string()
    .min(3, "Please provide valid last name")
    .max(100, "Please provide valid last name"),
  email: z
    .email()
});
