import { BASE_URL } from "./constants";

const HEADERS = {
  "Content-Type": "application/json",
};

export const getDeliveryMethod = () => {
  return fetch(`${BASE_URL}/delivery-method/get`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const setIsCDEKBreakdown = (id: string, isCDEKBreakdown: boolean) => {
  return fetch(`${BASE_URL}/delivery-method/set-is-cdek-breakdown/${id}`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      isCDEKBreakdown: isCDEKBreakdown,
    }),
  }).then(checkResponse);
};

const checkResponse = (res: Response) => {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(res.status);
  }
};
