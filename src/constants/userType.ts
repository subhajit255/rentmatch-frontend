import { genderDropdown, memberDropdown } from "@/src/types/memberTypes";

export const memberRoles : memberDropdown[] = [
    {
        id  : 0,
        value : "TENANT",
        title : "Tenant"
    },
    {
        id  : 1,
        value : "LANDLORD",
        title : "Landlord"
    },
    {
        id  : 2,
        value : "PROPERTY MANAGER",
        title : "Property Manager"
    }
]

export const genders : genderDropdown[] = [
    {
        id  : 0,
        value : "MALE",
        title : "Male"
    },
    {
        id  : 1,
        value : "FEMALE",
        title : "Female"
    },
    {
        id  : 2,
        value : "OTHERS",
        title : "Others"
    }
]

export const ageBrackets = [
    { id: 0, value: "18-24", title: "18-24" },
    { id: 1, value: "25-34", title: "25-34" },
    { id: 2, value: "35-44", title: "35-44" },
    { id: 3, value: "45-54", title: "45-54" },
    { id: 4, value: "55-64", title: "55-64" },
    { id: 5, value: "65+", title: "65+" },
]