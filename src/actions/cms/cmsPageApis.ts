// import { cmsType } from "../../types/cms";
import api from "..";
import {
  GET_PROPERTY_TYPE,
  GET_PROPERTY_FEATURED,
  GET_WHAT_WE_DO,
  GET_FEEDBACK_CMS,
  OWNER_SUBSCRIPTION_PLAN_GET_URL,
  DROP_US_A_LINE_URL,
} from "../constant";

interface payloadSchema {
  name: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
}

export const getProprtyTypeList = async () => {
  const res = await api.get(GET_PROPERTY_TYPE);
  return res.data;
};

export const getProprtyFeatured = async () => {
  const res = await api.get(GET_PROPERTY_FEATURED);
  return res.data;
};

export const getWhatWeDo = async () => {
  const res = await api.get(GET_WHAT_WE_DO);
  return res.data;
};

export const getFeedbackCms = async () => {
  const res = await api.get(GET_FEEDBACK_CMS);
  return res.data;
};

export const getFeedbackList = async () => {
  const res = await api.get('feedback');
  return res.data;
};

export const updateRatingFeedbackStatus = async (feedbackId: string) => {
    const res = await api.patch(`/feature-feedback/${feedbackId}`);
    return res.data;
}

export const getSubscriptionPlanListCms = async (role: string = "", params: { search?: string } = {}) => {
  const res = await api.get(OWNER_SUBSCRIPTION_PLAN_GET_URL + role, { params: params });
  return res.data;
};

export const dropALine = async (payload: payloadSchema) => {
    const res = await api.post(DROP_US_A_LINE_URL, payload);
    return res.data;
};

export const dropALineList = async () => {
    const res = await api.get(DROP_US_A_LINE_URL);
    return res.data;
};
