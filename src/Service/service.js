import axios from "axios";
import { removeLoaleStorageItem } from "../Utils/localeStorage";
import { ADMIN_DETAILS, USER_DETAILS } from "../Constant/Constant";

// export const COMMON_IMAGE_URL = "http://localhost:3000/api/";
// export const BASE_URL = "http://localhost:3000/api/";

export const COMMON_IMAGE_URL = import.meta.env.COMMON_IMAGE_URL;
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const createApiForClient = (contentType) => {
  const headers = { "Cache-Control": "no-cache" };

  if (contentType === "multipart") {
    headers["Content-Type"] = "multipart/form-data";
  } else if (contentType === "json") {
    headers["Content-Type"] = "application/json";
  }
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: 600000,
    withCredentials: true,
  });

  // Request interceptor
  api.interceptors.request.use(
    function (config) {
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  // Response interceptor
  api.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.status === 401) {
        const currentpath = window.location.pathname;
        if (currentpath.includes("/admin")) {
          removeLoaleStorageItem(ADMIN_DETAILS);
          window.location.replace("/admin/login");
        } else {
          removeLoaleStorageItem(USER_DETAILS);
          window.location.replace("/login");
        }
      }
      return Promise.reject(error);
    },
  );

  return api;
};

const apiMultipart = createApiForClient("multipart");
const apiJson = createApiForClient("json");

export { apiMultipart, apiJson };
