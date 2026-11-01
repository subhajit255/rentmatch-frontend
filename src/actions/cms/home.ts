import api from "..";
import { GET_WHAT_WE_DO__URL } from "../constant";

export const getWhatWeDoList = async (params: { search?: string } = {}) => {
  const res = await api.get(GET_WHAT_WE_DO__URL);
  // const res = await api.get(GET_FAQ_GET_URL, { params: params });
  return res.data;
};