import api from ".";
import { GET_MEMBER_DETAIL_URL, GET_USER_LIST, MEMBER_CHAT_DETAILS_URL, MEMBER_CHAT_LIST_URL, MEMBER_POSTS_URL, MEMBER_PROPERTIES_URL, MEMBER_SCHEDULES_URL } from "./constant";

export const getUserManagementList = async (role: string, page: number, count: number, params: {search?: string} = {} ) => {    
  const res = await api.get(GET_USER_LIST + `${role}/${page}/${count}`, {params : params}); 
  return res.data;
};


export const getMemberDetailApi = async (id: string) => {    
  const res = await api.get(GET_MEMBER_DETAIL_URL + id); 
  return res.data;
};

export const getMemberPostDetail = async (id: string) => {    
  const res = await api.get(`user-managment/member-post-list/` + id); 
  return res.data;
};

export const getMemberChatDetail = async (id: string) => {    
  try {
    const res = await api.get(MEMBER_CHAT_LIST_URL + id); 
    console.log(res, "chat list res ")
    return res.data;
  } catch (error) {
    console.error(error, "<--error ")
  }
};

export const getMemberChatConversation = async (sender: string, receiver:string) => {    
  const res = await api.get(`user-managment/member-chat-details/${sender}/${receiver}`); 
  return res.data;
};

export const getMemberScheduleVisitDetail = async (id: string) => {    
  try {
    const res = await api.get(`user-managment/member-schedule-list/` + id); 
    return res.data;
  } catch (error) {
    console.error(error, "<--Error")
  }
};

export const getPropertyListDetail = async (id: string, page:number, limit:number) => {    
  try {
    const res = await api.get(`user-managment/member-property-list/${id}/${page}/${limit}`); 
    return res.data;
  } catch (error) {
    console.error(error, "<--Error")
  }
};

export const getMemberSchedulesApi = async (id: string, page:number, limit: number) => {    
  const res = await api.get(MEMBER_SCHEDULES_URL + page + '/' + limit + '/' + id); 
  return res.data;
};

export const getMemberChatListsApi = async (id: string, page:number, limit: number) => {    
  const res = await api.get(MEMBER_CHAT_LIST_URL + page + '/' + limit + '/' + id); 
  return res.data;
};

export const getMemberChatDetailsApi = async (sid: string, rid: string) => {    
  const res = await api.get(MEMBER_CHAT_DETAILS_URL + sid + "/" + rid); 
  return res.data;
};

export const getMemberPropertiesApi = async (id: string, page:number, limit: number) => {    
  const res = await api.get(MEMBER_PROPERTIES_URL + page + '/' + limit + '/' + id); 
  return res.data;
};

export const getMemberPostsAPI = async (id: string, page:number, limit: number) => {    
  const res = await api.get(MEMBER_POSTS_URL + page + '/' + limit + '/' + id); 
  return res.data;
};