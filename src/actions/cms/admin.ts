import { addAdminPayload } from "@/src/types/admin";
import api from "..";
import { ADD_ADMIN_URL } from "../constant";

export const createAdminApi = async (payload: addAdminPayload) => {
  const res = await api.post(ADD_ADMIN_URL, payload);
  return res.data;
};

export const updateAdminApi = async (payload: addAdminPayload, id: string) => {
  const res = await api.put(ADD_ADMIN_URL + "/" + id, payload);
  return res.data;
};

export const statusChangeAdminApi = async ( { id }: { id: string }) => {
  const res = await api.get(`user-managment/status-update/admin/${id}`);
  return res.data;
};