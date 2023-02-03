import { BASE_URL } from "./constants";

const HEADERS = {
  "Content-Type": "application/json",
};

export const getUsers = () => {
  return fetch(`${BASE_URL}/users`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const getUserInfo = () => {
  return fetch(`${BASE_URL}/users/me`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const createUser = (
  name: string,
  email: string,
  position: string,
  password: string
) => {
  return fetch(`${BASE_URL}/users/create`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      name: name,
      email: email,
      position: position,
      password: password,
    }),
  }).then(checkResponse);
};

export const deleteUser = (email: string) => {
  return fetch(`${BASE_URL}/users/${email}`, {
    credentials: "include",
    method: "DELETE",
    headers: HEADERS,
  }).then(checkResponse);
};

export const changePassword = (password: string) => {
  return fetch(`${BASE_URL}/users/me`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      password: password,
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
