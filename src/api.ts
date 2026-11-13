// Shared API configuration aligned with nk-admin.
// Local development uses the local Express API; deployed clients use Render.
const LOCAL_API_URL = "http://localhost:3001/api";
const RENDER_API_URL = "https://nkbike.onrender.com/api";
const CLOUDFLARE_API_URL = RENDER_API_URL;

const hostname =
  typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "";

const isLocalhost =
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname === "::1";

const isCloudflarePages =
  hostname === "nk-admin.phamdangkhoa0403.workers.dev" ||
  hostname.endsWith(".pages.dev");

const isCloudflareWorkers =
  hostname === "nkbike.phamdangkhoa0403.workers.dev" ||
  hostname.endsWith(".workers.dev");

const configuredApiUrl =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;

const normalizeApiUrl = (url: string) => String(url).trim().replace(/\/+$/, "");

const detectedApiUrl = isLocalhost
  ? LOCAL_API_URL
  : isCloudflarePages || isCloudflareWorkers
    ? CLOUDFLARE_API_URL
    : RENDER_API_URL;

export const BASE_URL = normalizeApiUrl(configuredApiUrl || detectedApiUrl);
export const DEFAUL_URL = BASE_URL.replace(/\/api$/i, "");

export const API_ENDPOINTS = {
  SIGNIN: `${BASE_URL}/signin`,
  SIGNUP: `${BASE_URL}/signup`,
  LOGIN: `${BASE_URL}/customers/login`,
  PRODUCTS: `${BASE_URL}/products`,
  PRODUCTS_CATEGORIES: `${BASE_URL}/categorys`,
  PRODUCTS_SEARCH: `${BASE_URL}/products/search`,
  PRODUCTS_CATEGORY: `${BASE_URL}/products/category`,
  VEHICLES: `${BASE_URL}/vehicles`,
  VEHICLE_BRANDS: `${BASE_URL}/vehicles/brands`,
  CUSTOMERS: `${BASE_URL}/customers`,
  ORDERS: `${BASE_URL}/orders`,
  ORDER: `${BASE_URL}/order`,
  SETTINGS: `${BASE_URL}/settings`,
};
