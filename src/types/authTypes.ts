import { adminType, memberType } from "./memberTypes";

export type getOtpSchema = {
  role: memberType;
  email: string;
  type: string;
  password?: string;
  confirmPassword?: string;
  otp?: string;
}

export type logInSchema = {
    user_id: string,
    password: string,
    role: memberType | adminType,
}

export type registrationSchema = {
    "name" ?: string,
    "role": memberType,
    "first_name": string,
    "middle_name"?: string,
    "last_name": string,
    "password": string,
    "email": string,
    "gender": string,
    "age_bracket"?: string,
    "phone_number": string,
    "confirm_password"?: string,
    "user_name": string,
    "company_details"?: {
        "company_name": string,
        "company_number": string,
        "company_address": string,
        "company_email": string,
        "company_phone": string
    }
}