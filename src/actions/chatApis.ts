// import { cmsType } from "../types/cms";
import api from ".";
import { CHAT_LIST_URL, CHAT_CONTENT_URL } from "./constant";

export const getChatList = async () => {
  const res = await api.get(CHAT_LIST_URL);
  return res.data;
};

// export const getChatContent = async () => {
//   // const CHAT_CONTENT_URL: string = 'message/list'
//   // message/list/:id || message/list/69245a186fde38943b3ad4f4
//   const res = await api.get(CHAT_CONTENT_URL);
//   return res.data;
// };

export const getChatContent = async (otherUserId: string) => {
  if (!otherUserId) throw new Error("No conversation partner selected");
  const res = await api.get(`${CHAT_CONTENT_URL}/${otherUserId}`);
  return res.data;
};

export const sendMessage = async (payload: { receiver: string; content: string; property_id?: string }) => {
  console.log("SMS payload ??", payload)
  const res = await api.post("/message/add", payload);
  return res.data;
};
