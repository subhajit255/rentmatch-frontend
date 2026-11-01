import { z } from "zod";

export const createMyPostSchema = z.object({
    subject: z.string()
        .min(3, "Please provide subject atleast with 3 characters")
        .max(100, "Please provide subject within 100 characters"),

    about_post: z.string()
        .min(3, "Please provide about post atleast with 3 characters")
        .max(1000, "Please provide about post within 1000 characters"),

    property_type_object_id: z.string()
        .min(3, "Please select a property type"),

    move_in_requirements: z.string()
        .min(3, "Please select a move-in requirement"),

    location: z.string()
        .min(10, "Please provide preferred location atleast with 10 characters")
        .max(1000, "Please provide preferred location within 1000 characters"),

    start_price: z.string().refine(value => !isNaN(Number(value)), {
        message: "Start price must be a valid number"
    }).transform(value => Number(value)),

    end_price: z.string().refine(value => !isNaN(Number(value)), {
        message: "End price must be a valid number"
    }).transform(value => Number(value)),

    start_size: z.string().refine(value => !isNaN(Number(value)), {
        message: "Start size must be a valid number"
    }).transform(value => Number(value)),
    
    end_size: z.string().refine(value => !isNaN(Number(value)), {
        message: "End size must be a valid number"
    }).transform(value => Number(value)),

    // rooms: z.string().refine(value => value.trim() !== "", {
    //     message: "Please select preferred rooms quantity",
    // }),
    garages: z.string().refine(value => value.trim() !== "", {
        message: "Please select preferred garages quantity",
    }),
    bathrooms: z.string().refine(value => value.trim() !== "", {
        message: "Please select preferred bathrooms quantity",
    }),
    bedrooms: z.string().refine(value => value.trim() !== "", {
        message: "Please select preferred bedrooms quantity",
    }),
    balcony: z.string().refine(value => value.trim() !== "", {
        message: "Please select preferred balcony quantity",
    }),

}).refine(data => data.start_price <= data.end_price, {
    message: "Start price must not be greater than end price",
    path: ["start_price"],
}).refine(data => data.start_size <= data.end_size, {
    message: "Start size must not be greater than end size",
    path: ["start_size"],
});