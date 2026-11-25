import axios from 'axios';
export const URL : string = process.env.REACT_APP_PUBLIC_API_URL || 'http://localhost:4000/'
// console.log("URL ::: ", URL);

const api = axios.create({
  baseURL:URL + "api" + "/v1"
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('auth_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('@jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    // console.log(err.response);
    
    // if (err.response?.status === 401 ) {//&& err?.response?.data?.code === "user_not_found"
    //   localStorage.removeItem('access_token');
    //   // console.log("BASE_URL :: ", BASE_URL);
      
    //   window.location.href = `${URL}/login`  
    //   // Optionally: trigger logout or refresh token
    // }
    return Promise.reject(err);
  }
);

export default api;
