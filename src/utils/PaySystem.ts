import { BASE_URL } from "./constants";

const HEADERS = {
  "Content-Type": "application/json",
};

export const getPaymentAnypayments = (id: string) => {
  return fetch(`${BASE_URL}/pay/link-info-anypayments/${id}`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
  }).then(checkResponse);
};

export const createPayLinkAnypayments = (
  orderId: string,
  customId: string,
  amount: number,
  redirect_url: string
) => {
  return fetch(`${BASE_URL}/pay/link-anypayments`, {
    method: "POST",
    headers: HEADERS,
    credentials: "include",
    body: JSON.stringify({
      orderId: orderId,
      customId: customId,
      amount: amount,
      redirect_url: redirect_url,
    }),
  }).then(checkResponse);
};

export const getPaymentOnepay = (id: string) => {
  return fetch(`${BASE_URL}/pay/link-info-one-pay/${id}`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
  }).then(checkResponse);
};

export const createPayLinkOnepay = (
  orderId: string,
  amount: number,
  redirect_url: string,
  callback_url: string
) => {
  return fetch(`${BASE_URL}/pay/link-one-pay`, {
    method: "POST",
    headers: HEADERS,
    credentials: "include",
    body: JSON.stringify({
      orderId: orderId,
      amount: amount,
      redirect_url: redirect_url,
      callback_url: callback_url,
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
