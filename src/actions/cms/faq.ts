import { cmsType } from "../../types/cms";
import api from "..";
import { FAQ_GET_URL, GET_TERMS_AND_CONDITIONS_URL } from "../constant";

export const getFaqeList = async (params: { search?: string } = {}) => {
  const res = await api.get(FAQ_GET_URL);
  // const res = await api.get(GET_FAQ_GET_URL, { params: params });
  return res.data;
};

export const addFaqe = async (payload: { name: string, description: string }) => {
  const res = await api.post(FAQ_GET_URL, payload);
  return res.data;
};


export const editFaqe = async (id: string) => {
  const res = await api.get(FAQ_GET_URL + "/" + id);
  return res.data;
};

export const updateFaqApi = async (payload: { name: string, description: string }, id: string) => {
  const res = await api.put(FAQ_GET_URL + "/" + id, payload);
  return res.data;
};

export const deleteFaqApi = async (id: string) => {
  const res = await api.delete(FAQ_GET_URL + "/" + id);
  return res.data;
};

export const getTermsAndPrivacyApi = async (type: cmsType) => {
  const res = await api.get(GET_TERMS_AND_CONDITIONS_URL + "/" + type);
  // const res = await api.get(GET_FAQ_GET_URL, { params: params });
  return res.data;
};
export const addTermsAndPrivacyApi = async (payload: { title: string; type: string; content: string ,role : string}) => {
  const res = await api.post(GET_TERMS_AND_CONDITIONS_URL, payload);
  return res.data;
}; 
