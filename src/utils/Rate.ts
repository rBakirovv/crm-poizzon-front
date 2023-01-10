import { BASE_URL } from "./constants";

const HEADERS = {
  "Content-Type": "application/json",
};

export const getRate = () => {
  return fetch(`${BASE_URL}/rate`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const createRate = () => {
  return fetch(`${BASE_URL}/rate/create`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
  }).then(checkResponse);
};

export const updateRate = (id: string, newRate: string) => {
  return fetch(`${BASE_URL}/rate/${id}`, {
    credentials: "include",
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify({
      newRate,
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
