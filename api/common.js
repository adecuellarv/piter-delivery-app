const ENV = process.env.EXPO_PUBLIC_ENV || "local";

const WPJson = "/wp-json/wp/v2";
const customAPIs = "/wp-json/api/v2";

const normalizeSiteURL = (value, sitePath) => {
  if (!value) {
    return "";
  }

  const trimmedValue = value.replace(/\/$/, "");

  if (
    trimmedValue.startsWith("http://") ||
    trimmedValue.startsWith("https://")
  ) {
    return trimmedValue;
  }

  return `http://${trimmedValue}:8888/${sitePath}`;
};

const resolveBaseURL = () => {
  if (ENV === "local") {
    const ip = process.env.EXPO_PUBLIC_LOCAL_IP;
    const path = process.env.EXPO_PUBLIC_SITE_PATH;

    if (!ip || !path) {
      console.warn("Missing EXPO_PUBLIC_LOCAL_IP or EXPO_PUBLIC_SITE_PATH");
    }

    return normalizeSiteURL(ip, path);
  }

  // DEV / PROD
  return process.env.EXPO_PUBLIC_BASE_URL;
};

export const getSiteBaseURL = () => resolveBaseURL();

export const getBaseURL = () => {
  const base = resolveBaseURL();
  return `${base}${WPJson}`;
};

export const getCustomBaseURL = () => {
  const base = resolveBaseURL();
  return `${base}${customAPIs}`;
};

export const apiSaveUsers = process.env.EXPO_PUBLIC_API_CREATE_USER;
export const apiValidateCodeUsers = process.env.EXPO_PUBLIC_API_VALIDATE_USER;
export const apiCreateOrder = process.env.EXPO_PUBLIC_API_FIREBASE_CREATE_ORDER;
export const apiCancelOrder = process.env.EXPO_PUBLIC_API_FIREBASE_CANCEL_ORDER;
export const apiGetOrders = process.env.EXPO_PUBLIC_API_FIREBASE_GET_ORDERS;
export const apiGetOrder = process.env.EXPO_PUBLIC_API_FIREBASE_GET_ORDER;
export const apiUpdateOrder = process.env.EXPO_PUBLIC_API_FIREBASE_UPDATE_ORDER;

export const apiCreateEventRequest =
  process.env.EXPO_PUBLIC_API_CREATE_EVENT_REQUEST ||
  "https://us-central1-piter-east.cloudfunctions.net/createEventRequest";
export const apiPutEventRequest =
  process.env.EXPO_PUBLIC_API_PUT_EVENT_REQUEST ||
  "https://us-central1-piter-east.cloudfunctions.net/putEventRequest";
export const apiGetEventRequest =
  process.env.EXPO_PUBLIC_API_GET_EVENT_REQUEST ||
  "https://us-central1-piter-east.cloudfunctions.net/getEventRequest";
export const apiUpdateEventRequest =
  process.env.EXPO_PUBLIC_API_UPDATE_EVENT_REQUEST ||
  "https://us-central1-piter-east.cloudfunctions.net/updateEventRequest";
export const apiDeleteEventRequest =
  process.env.EXPO_PUBLIC_API_DELETE_EVENT_REQUEST ||
  "https://us-central1-piter-east.cloudfunctions.net/deleteEventRequest";

export const IS_LOCAL = ENV === "local";
export const IS_DEV = ENV === "dev";
export const IS_PROD = ENV === "prod";
export const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP;
