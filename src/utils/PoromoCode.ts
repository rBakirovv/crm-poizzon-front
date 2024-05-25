import { BASE_URL } from "./constants";

const HEADERS = {
  "Content-Type": "application/json",
};

export const getPoromoCodes = () => {
  return fetch(`${BASE_URL}/promo-codes`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const getPoromoCode = (code: string) => {
  return fetch(`${BASE_URL}/promo-code/${code}`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const createPoromoCode = (code: string, percent: number) => {
  return fetch(`${BASE_URL}/promo-code/create`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      code,
      percent,
    }),
  }).then(checkResponse);
};

export const deletePoromoCode = (id: string) => {
  return fetch(`${BASE_URL}/promo-code/${id}`, {
    credentials: "include",
    method: "DELETE",
    headers: HEADERS,
  }).then(checkResponse);
};

const checkResponse = (res: Response) => {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(res.status);
  }
};
