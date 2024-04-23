import { BASE_URL } from "./constants";

const HEADERS = {
  "Content-Type": "application/json",
};

export const getPayment = (id: string) => {
  return fetch(`${BASE_URL}/pay/link-info/${id}`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
  }).then(checkResponse);
};

export const createPayLink = (
  orderId: string,
  customId: string,
  amount: number,
  redirect_url: string,
) => {
  return fetch(`${BASE_URL}/pay/link`, {
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

const checkResponse = (res: Response) => {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(res.status);
  }
};
