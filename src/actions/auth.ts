import api from ".";
import { getOtpSchema, logInSchema, registrationSchema } from "../types/authTypes";
import { MEMBER_LOGIN_URL, MEMBER_REGISTRATION_URL, VERIFICATION_URL } from "./constant";

export const registrationMember = async (payload: registrationSchema) => {
    const res = await api.post(MEMBER_REGISTRATION_URL, payload);
    return res.data;
};


export const loginMember = async (payload: logInSchema | { role: "GUEST", guset_token: "GTH007*67kdf%" }) => {
    const res = await api.post(MEMBER_LOGIN_URL, payload);
    return res.data;
};

export const verifyMember = async (payload: getOtpSchema) => {
    // create a request body without `role` when type is "forgotpassword"
    const body = payload
    // ?.type === "forgotpassword"
    //     ? (() => {
    //         const { role, ...rest } = payload as any;
    //         return rest as getOtpSchema;
    //       })()
    //     : payload;

    const res = await api.post(VERIFICATION_URL, body);
    return res.data;
};