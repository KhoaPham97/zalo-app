import Axios from "axios";
import { BASE_URL } from "../api.ts";

const axios = Axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
});

export const baseURL = BASE_URL;

axios.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};
    config.headers["Accept"] = "application/json";

    // The Zalo Mini App uses customer-side/public API access.
    // Do not attach nk-admin's adminToken/accessToken to customer requests.
    if (config.data && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    config.credentials = "same-origin";
    return config;
  },
  (error) => Promise.reject(error),
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 403) {
      console.warn("API từ chối truy cập:", error?.response?.data);
    } else if (error?.response?.status === 401) {
      console.warn("API yêu cầu xác thực:", error?.response?.data);
    }
    return Promise.reject(error);
  },
);

export default axios;
