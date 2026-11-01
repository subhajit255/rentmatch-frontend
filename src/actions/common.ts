import { DocItem } from "../types/property";
import api from ".";
import { MY_PROFILE_UPDATE } from "./constant";


type Primitive = string | number | boolean | null | undefined;
export type ImagePayload = {
  data: File;
  is_featured: boolean;
};

export type PropertyPayload = {
  images: ImagePayload[];
  videos: ImagePayload[];
  floor_plans: ImagePayload[];
  property_object_id: string;
};


export function toFormData(
  payload: Record<string, any>,
  formData: FormData = new FormData(),
  parentKey?: string
): FormData {
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    // File
    if (value instanceof File || value instanceof Blob) {
      formData.append(formKey, value);
    }
    // Array
    else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        toFormData(item, formData, `${formKey}[${index}]`);
      });
    }
    // Object
    else if (typeof value === "object") {
      toFormData(value, formData, formKey);
    }
    // Primitive
    else {
      formData.append(formKey, String(value));
    }
  });

  return formData;
}

export function buildUploadFormData(payload: PropertyPayload): FormData {
  const formData = new FormData();

  // text field
  formData.append("property_object_id", payload.property_object_id);

  // multiple images
  payload.images.forEach(img => {
    formData.append("images", img.data);
  });

  // multiple videos
  payload.videos.forEach(file => {
    formData.append("videos", file.data);
  });

  // multiple floor plans
  payload.floor_plans.forEach(file => {
    formData.append("floor_plans", file.data);
  });

  return formData;
}

export const getMyprofileInfo = async () => {
  const res = await api.get('user-managment/get-profile');
  return res.data;
};

export const updateMyprofile = async (payload: any) => {
  const res = await api.put(MY_PROFILE_UPDATE, payload);
  console.log("Updated ??", res)
  return res.data;
};

export const notificationList = async () => {
  const res = await api.get('notification/send-notifaction-list');
  return res.data;
};

export const getRoleBySlug = async (slug:string) => {
  const res = await api.get(`role-permission/list/admin`);
  return res.data;
};

export const updatRolePermission = async (payload: any) => {
  console.log(payload, "<--payload of role")
  const res = await api.post(`role-permission/add`, payload);
  console.log("Updated ??", res)
  return res.data;
};

export const getDashboardData = async () => {
  try {
    const res = await api.get(`dashboard/`);
    return res.data;
  } catch (error) {
    console.log(error)
  }
};

export const getDashboardPropertyData = async () => {
  try {
    const res = await api.get(`dashboard/property-count`);
    return res.data;
  } catch (error) {
    console.log(error)
  }
};


export const upgradeFeturedData = async (id:string) => {
  try {
    const res = await api.post(`group-owner/property/featured`,
      {
        property_id : id
      }
    );
    return res.data;
  } catch (error) {
    console.log(error)
    // rethrow so react-query's onError fires instead of a false success
    throw error;
  }
};

