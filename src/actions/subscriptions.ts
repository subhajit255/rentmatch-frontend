import api from ".";
import { subscriptionform } from "../types/admin";
import { OWNER_SUBSCRIPTION_PLAN_GET_URL, SUBSCRIPTION_PLAN_ADD_URL, SUBSCRIPTION_PLAN_EDIT_URL, SUBSCRIPTION_PLAN_GET_URL, SUBSCRIPTION_PLAN_STATUS_CHANGE_URL, SUBSCRIPTION_PLAN_URL, VERIFY_SUBSCRIPTION_PLAN_URL } from "./constant";

export const getSubscriptionPlanList = async (role: string = "", params: { search?: string } = {}) => {
  const res = await api.get(SUBSCRIPTION_PLAN_GET_URL + role, { params: params });
  // console.log("res ::: ", res);

  return res.data;
};

export const getSubscriptionPlanListForOwnersApi = async (role: string = "", params: { search?: string } = {}) => {
  const res = await api.get(OWNER_SUBSCRIPTION_PLAN_GET_URL + role, { params: params });
  // console.log("res ::: ", res);

  return res.data;
};

export const addSubscriptionPlan = async (payload: { name: string, description: string }) => {
  const res = await api.post(SUBSCRIPTION_PLAN_ADD_URL, payload);
  return res.data;
};


export const editSubscriptionPlan = async (id: string) => {
  const res = await api.get(SUBSCRIPTION_PLAN_EDIT_URL + "/" + id);
  return res.data;
};

export const updateSubscriptionPlanApi = async (payload: subscriptionform, id: string) => {
  const res = await api.put(SUBSCRIPTION_PLAN_URL + "/" + id, payload);
  return res.data;
};

export const deleteSubscriptionPlanApi = async (id: string) => {
  const res = await api.delete(SUBSCRIPTION_PLAN_URL + id);
  return res.data;
};

export const updateSubscriptionPlanStatusChangeApi = async (id: string) => {
  const res = await api.patch(SUBSCRIPTION_PLAN_STATUS_CHANGE_URL + id);
  return res.data;
};

export const verifySubscriptionPlanApi = async (payload: {member_objectId: string, paymentIntent_id: string, payment_respons: any}) => {
  try{
  const res = await api.patch(VERIFY_SUBSCRIPTION_PLAN_URL, payload);
  return res.data;
  }catch(error){
    console.error("Error verifying subscription plan:", error);
    // throw error; // Rethrow the error after logging it
    return { success: false, message: "Failed to verify subscription plan" };
  }
}