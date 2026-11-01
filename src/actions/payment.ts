import api from ".";
import { PAYMENT_URL } from "./constant";

export const createPaymentIntent = async (payload: { subscriptionId: string, amount : number }) => {
  const res = await api.post(PAYMENT_URL, payload);
  return res.data;
};


export const confirmPaymentIntent = async (paymentIntentId: string) => {
  const res = await api.post(`${PAYMENT_URL}/confirm`, { paymentIntentId });
  return res.data;
};


export const getPaymentIntent = async (payload: { user_object_id: string, subscription_id: string}) => {
  const res = await api.post(PAYMENT_URL, payload);
  return res.data;
};