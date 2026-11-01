import api from ".";
import { schedulePayloadType } from "../types/property";
import { CREATE_SCHEDULE_VISIT_URL, SAVED_PROPERTY_TYPES, GET_SCHEDULE_VISIT_URL, PROPERTY_TYPE_ADD_URL, PROPERTY_TYPE_GET_URL, PROPERTY_TYPE_UPDATE_URL, PROPERTY_TYPE_URL, STATUS_SCHEDULE_VISIT_URL } from "./constant";

export const getPropertyTypeList = async (params: {search?: string} = {} ) => {    
  const res = await api.get(PROPERTY_TYPE_GET_URL, {params : params}); 
  // console.log("res ::: ", res);
  
  return res.data;
};

export const getPropertyWishlistTypeList = async (params: {search?: string} = {} ) => {    
  const res = await api.get(SAVED_PROPERTY_TYPES, {params : params}); 
  // console.log("res ::: ", res);
  
  return res.data;
};

export const addPropertyType = async ( payload : {name : string, description : string} ) => {
  const res = await api.post(PROPERTY_TYPE_ADD_URL, payload);
  return res.data;
};


export const editPropertyType = async ( id : string ) => {
  const res = await api.get(PROPERTY_TYPE_UPDATE_URL + "/" + id);
  return res.data;
};

export const updatePropertyTypeApi = async ( payload : {name : string, description : string}, id : string) => {
  const res = await api.put(PROPERTY_TYPE_URL + "/" + id, payload);
  return res.data;
};

export const deletePropertyTypeApi = async ( id : string ) => {
  const res = await api.delete(PROPERTY_TYPE_URL+ "/" + id );
  return res.data;
};

export const createSchedulevisit = async ( payload : schedulePayloadType ) => {
  const res = await api.post(CREATE_SCHEDULE_VISIT_URL, payload);
  return res.data;
};

export const getSchedulevisit = async ( role: string = "" ) => {
  const res = await api.get(GET_SCHEDULE_VISIT_URL + role );
  return res.data;
};

export const statusUpdateApi = async ( payload: any, _id: string ) => {
  const res = await api.patch(STATUS_SCHEDULE_VISIT_URL + _id, payload);
  return res.data;
}