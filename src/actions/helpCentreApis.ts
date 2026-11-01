// import { cmsType } from "../types/cms";
import api from ".";

export const sendFeedback = async (payload: any) => {
    const res = await api.post("/feed-back", payload);
    console.log("_________- ??", res)
    return res.data;
};

export const updateFeedback = async (ticketId: string, payload: any) => {
    const res = await api.put(`/feed-back/${ticketId}`, payload);
    return res.data;
}

export const updateFeedbackStatus = async (ticketId: string, payload: any) => {
    const res = await api.patch(`/feed-back/status-update/${ticketId}`, payload);
    return res.data;
}

export const getMyIssues = async () => {
    const res = await api.get("/feed-back");
    return res.data;
};

export const sendRating = async (payload: any) => {
    const res = await api.post("/feedback", payload);
    console.log("feedback_________- ??", res)
    return res.data;
};
