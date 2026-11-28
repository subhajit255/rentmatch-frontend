import api from ".";
import { advanceSearch } from "../types/property";
import { PM_LL_SAVE_POST_URL, POST_ACCEPT_REJECT_REQUEST_URL, POST_DETAILS_URL, POST_LIST_URL, POST_RECEIVE_REQUEST_URL, POST_REQUEST_SEND_URL, POST_TENANT_INVITATIONS_URL, TENANT_POST_ADD_URL, TENANT_POST_DELETE_URL, TENANT_POST_IS_ACTIVE_URL, TENANT_POST_LIST_URL, TENANT_POST_UPDATE_URL } from "./constant";

export const addMyPostApi = async ( payload : any) => {
  const res = await api.post(TENANT_POST_ADD_URL, payload);
  return res.data;
};

// export const getMyPost = async ( params: {search?: string} = {} ) => {
//   const res = await api.get(TENANT_POST_LIST_URL, {params});
//   return res.data;
// };

export const getMyPost = async (params: { search?: string; page?: number; limit?: number } = {}) => {
  const { page, limit } = params;
  const url = page && limit ? 
    TENANT_POST_LIST_URL+`/${page}/${limit}` : 
    TENANT_POST_LIST_URL;
  const res = await api.get(url, { params: { search: params.search } });
  return res.data;
};

export const updateMyPostApi = async ( payload : any, id : string) => {
  const res = await api.put(TENANT_POST_UPDATE_URL + "/" + id, payload);
  return res.data;
};

export const statusChangeOfMyPostApi = async ( id : string ) => {
  const res = await api.patch(TENANT_POST_IS_ACTIVE_URL + "/" + id);
  return res.data;
};

export const deleteMyPostApi = async ( id : string ) => {
  const res = await api.delete(TENANT_POST_DELETE_URL + "/" + id );
  return res.data;
};

export const getPostDetails = async ( id : string ) => {
  const res = await api.get(POST_DETAILS_URL+ "/" + id);
  return res.data;
};

export const getAllPost = async (page: number, limit: number, params: advanceSearch | null) => {
  // const { page, limit } = params;
  const url = page && limit ? 
    POST_LIST_URL+`${page}/${limit}` : 
    POST_LIST_URL;
  const res = await api.get(url, { params });
  return res.data;
};

export const getAllPostCMS = async (page: number, limit: number, params: advanceSearch | null) => {
  const url = page && limit ? 
    `/cms` + POST_LIST_URL + `${page}/${limit}` : 
    `/cms` + POST_LIST_URL;
  const res = await api.get(url, { params });
  return res.data;
};

export const postRequestSendApi = async ( payload : any) => {
  const res = await api.post(POST_REQUEST_SEND_URL, payload);
  return res.data;
};

export const postReceiveRequestApi = async ( id : string) => {
  const res = await api.get(POST_RECEIVE_REQUEST_URL + "/1/100" +"/"+id);
  return res.data;
};

export const getTenantInvitationsApi = async () => {
  const res = await api.get(POST_TENANT_INVITATIONS_URL);
  return res.data;
};

export const acceptRejectPostRequestApi = async (payload: {
  request_post_id: string;
  status: "APPROVED" | "REJECTED";
  discription?: string;
}) => {
  const res = await api.patch(POST_ACCEPT_REJECT_REQUEST_URL, payload);
  return res.data;
};

export const LandLordOrPM_SavePostApi = async (
  post_object_id: string, status:boolean
) => {
  const res = await api.post(PM_LL_SAVE_POST_URL, {
    post_object_id: post_object_id,
    status : status
  });
  return res.data;
};

export const LandLordOrPM_SavePostList = async () => {
  const res = await api.get(PM_LL_SAVE_POST_URL);
  return res.data;
};