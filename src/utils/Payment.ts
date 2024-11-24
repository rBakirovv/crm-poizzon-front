import { BASE_URL } from "./constants";

const HEADERS = {
  "Content-Type": "application/json",
};

export const getPayments = () => {
  return fetch(`${BASE_URL}/payments`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const createPayment = (title: string, number: string) => {
  return fetch(`${BASE_URL}/payments/create`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      title,
      number,
    }),
  }).then(checkResponse);
};

export const deletePayment = (id: string) => {
  return fetch(`${BASE_URL}/payments/${id}`, {
    credentials: "include",
    method: "DELETE",
    headers: HEADERS,
  }).then(checkResponse);
};

export const updatePaymentOrder = (id: string, order: number) => {
  return fetch(`${BASE_URL}/payments/update-order/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      paymentOrder: order,
    }),
  }).then(checkResponse);
};

export const changeServicePercentage = (id: string, servicePercentage: string) => {
  return fetch(`${BASE_URL}/payments/update-service-percentage/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      servicePercentage: servicePercentage,
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
