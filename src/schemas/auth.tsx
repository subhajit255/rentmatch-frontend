import { z } from "zod";

export const signinSchema = z.object({
    user_id: z
        .email({ message: "Invalid email address" }),
   
    password: z.string()
        .min(8, "Password must be at least 8 characters"),
        // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 
        // "Password must contain uppercase, lowercase, number, and special character"),
    role: z.enum(["TENANT", "LANDLORD", "PROPERTY MANAGER", "SUPER ADMIN", "ADMIN"])
})

export type SigninSchemaType = z.infer<typeof signinSchema>;


export const registrationValidateSchema = z.object({
    email: z.string()
        .email({ message: "Please provide valid email address" }),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"], "Please select gender"),
    age_bracket: z.string().optional(),
    phone_number: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    first_name: z.string().min(1, "Please provide first name").max(50, "First name cannot exceed 50 characters"),
    last_name: z.string().min(1, "Please provide last name").max(50, "First name cannot exceed 50 characters"),
    middle_name: z.string()
    .max(50, "Middle name cannot exceed 50 characters")
    .optional(),
    user_name: z.string()
        .min(3, "User name must be at least 3 characters")
        .max(30, "User name cannot exceed 30 characters")
        .regex(/^[a-zA-Z0-9]+$/, "Username cannot contain special characters"),
  
    password: z.string()
        .min(8, "Password must be at least 8 characters"),
    confirm_password: z.string()
        .min(8, "Password must be at least 8 characters"),
    
    // company_details: z.object({
    //     company_name: z.string().min(3, "Please enter a valid company name"),
    //     company_number: z.string().min(3, "Please enter a valid company number"),
    //     company_address: z.string().min(3, "Please enter a valid company address"),
    //     company_email: z.string().min(3, "Please enter a valid company email"),
    //     company_phone: z.string().min(3, "Please enter a valid company phone number"),
    // })
    
}).refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"], // attach error to confirmPassword
    message: "Password and confirm password do not match",
});

export const forgotEmailSchema = z.object({
    email: z.string()
        .email({ message: "Please provide valid email address" }),
    role: z.enum(["TENANT", "LANDLORD", "PROPERTY MANAGER", "SUPER ADMIN", "ADMIN"])

});

export type ForgotEmailSchemaType = z.infer<typeof forgotEmailSchema>;

export const forgotOtpSchema = z.object({
    otp: z.string()
        .min(4, "Please enter 4 digit of OTP"),
    email: z.string()
        .email({ message: "Please provide valid email address" }),
    role: z.enum(["TENANT", "LANDLORD", "PROPERTY MANAGER", "SUPER ADMIN", "ADMIN"])
})

export const changePasswordSchema = z.object({
    email: z.string()
        .email({ message: "Please provide valid email address" }),
    role: z.enum(["TENANT", "LANDLORD", "PROPERTY MANAGER", "SUPER ADMIN", "ADMIN"]),
    password: z.string()
        .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
        .min(8, "Password must be at least 8 characters")
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // attach error to confirmPassword
    message: "Password and confirm password do not match",
});