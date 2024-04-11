import { BASE_URL } from "./constants";

const HEADERS = {
  "Content-Type": "application/json",
};

export const getSupplies = () => {
  return fetch(`${BASE_URL}/supply`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const getOrdersBySupplies = (id: string) => {
  return fetch(`${BASE_URL}/supply/orders/${id}`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const createSupply = (createdAt: string) => {
  return fetch(`${BASE_URL}/supply/create`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      createdAt: createdAt,
    }),
  }).then(checkResponse);
};

export const updateSupply = (id: string, supply: Array<String>) => {
  return fetch(`${BASE_URL}/supply/update-supply/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      supply: supply,
    }),
  }).then(checkResponse);
};

export const updateStock = (id: string, stock: Array<String>) => {
  return fetch(`${BASE_URL}/supply/update-stock/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      stock: stock,
    }),
  }).then(checkResponse);
};

export const deleteSupplyDate = (id: string) => {
  return fetch(`${BASE_URL}/supply/delete-supply/${id}`, {
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
