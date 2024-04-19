import { BASE_URL } from "./constants";

const HEADERS = {
  "Content-Type": "application/json",
  //"Authorization": `Bearer ${API_PAYMENT_KEY}`,
};

/*
export const getPayStatus = (uuid: string) => {
  return fetch(`${BASE_PAYMENT_URL}/api/v1/payments/${uuid}`, { 
    method: "GET",
    headers: HEADERS,
    credentials: "include",
  }).then(checkResponse);
};
*/

export const createPayLink = (
  id: string,
  amount: number,
  redirect_url: string,
  callback_url: string
) => {
  return fetch(`${BASE_URL}/pay/link`, {
    method: "POST",
    headers: HEADERS,
    credentials: "include",
    body: JSON.stringify({
      id: id,
      amount: amount,
      redirect_url: redirect_url,
      callback_url: callback_url,
    }),
  }).then(checkResponse);
};

export const createPaymentLink = (
  id: string,
  amount: number,
  redirect_url: string,
) => {
  return fetch(`${BASE_URL}/pay/create-link`, {
    method: "POST",
    headers: HEADERS,
    credentials: "include",
    body: JSON.stringify({
      id: id,
      amount: amount,
      redirect_url: redirect_url,
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
