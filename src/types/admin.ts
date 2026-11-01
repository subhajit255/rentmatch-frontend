export type roleTypesForSubscription = "PROPERTY OWNER" | "PROPERTY MANAGER" | "LANDLORD";
export type cyclesForSubscription = "WEEKLY" | "FORTNIGHTLY" | "MONTHLY" | "QUARTERLY" | "HALF YEARLY" | "YEARLY";
export interface subscriptionform {
    name: string;
    description: string;
    price: number | string;
    features: { title: string }[];
    plan_type: string;
    role_type: roleTypesForSubscription;
    cycles_for_subscription: cyclesForSubscription;
    is_active?: boolean;
}

export type addAdminPayload = {
    "first_name": string,
    "middle_name": string,
    "last_name": string,
    "email": string
}