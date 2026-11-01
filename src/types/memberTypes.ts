export type memberType = "TENANT" | "LANDLORD" | "PROPERTY MANAGER";
export type genderType = "MALE" | "FEMALE" | "OTHERS";
export type adminType = "ADMIN" | "SUPER ADMIN";

export type memberDropdown = {
    value: memberType,
    id: number,
    title: string
}

export type genderDropdown = {
    value: genderType,
    id: number,
    title: string
}

export interface ProtectedRouteProps {
    //   children: React.ReactElement;
    allowedRoles?: memberType[] | adminType[];
}

export interface MemberDetailType {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role: string;
    gender: string;
    is_subscribe: boolean;
    member_id: string;
    updatedAt?: string;
    date?: string
}