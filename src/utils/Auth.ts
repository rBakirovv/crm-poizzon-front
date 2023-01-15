import { BASE_URL } from "./constants";

const HEADERS = {
  "Content-Type": "application/json",
};

export const authorize = (email: string, password: string, code: string) => {
  return fetch(`${BASE_URL}/signin`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      email,
      password,
      code,
    }),
  }).then(checkResponse);
};

export const verification = (email: string, password: string) => {
  return fetch(`${BASE_URL}/signin-verification`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      email,
      password,
    }),
  }).then(checkResponse);
};

export const logOut = () => {
  return fetch(`${BASE_URL}/signout`, {
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
