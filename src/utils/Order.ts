import { IOrderImages } from "../types/interfaces";
import { BASE_URL } from "./constants";

const HEADERS = {
  "Content-Type": "application/json",
};

export const getOrders = () => {
  return fetch(`${BASE_URL}/orders`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const getCurrentOrder = (orderId: string | string[]) => {
  return fetch(`${BASE_URL}/order/${orderId}`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const createOrder = (creater: string, currentRate: string) => {
  return fetch(`${BASE_URL}/orders/create`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      creater: creater,
      currentRate: currentRate,
    }),
  }).then(checkResponse);
};

export const deleteOrder = (id: string) => {
  return fetch(`${BASE_URL}/orders/${id}`, {
    credentials: "include",
    method: "DELETE",
    headers: HEADERS,
  }).then(checkResponse);
};

export const updateOrderDraft = (
  id: string,
  link: string,
  category: string,
  subcategory: string,
  brand: string,
  model: string,
  size: string,
  payment: string,
  priceCNY: string,
  priceDeliveryChina: string,
  priceDeliveryRussia: string,
  commission: string,
  promoCodePercent: number,
  comment: string
) => {
  return fetch(`${BASE_URL}/order/draft/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      link: link,
      category: category,
      subcategory: subcategory,
      brand: brand,
      model: model,
      size: size,
      payment: payment,
      priceCNY: priceCNY,
      priceDeliveryChina: priceDeliveryChina,
      priceDeliveryRussia: priceDeliveryRussia,
      commission: commission,
      promoCodePercent: promoCodePercent,
      comment: comment,
    }),
  }).then(checkResponse);
};

export const updateDeliveryData = (
  id: string,
  deliveryName: string,
  deliveryNameRecipient: string,
  deliveryPhone: string,
  deliveryPhoneRecipient: string,
  deliveryMethod: string,
  deliveryAddress: string
) => {
  return fetch(`${BASE_URL}/order/delivery-data/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      deliveryName: deliveryName,
      deliveryNameRecipient: deliveryNameRecipient,
      deliveryPhone: deliveryPhone,
      deliveryPhoneRecipient: deliveryPhoneRecipient,
      deliveryMethod: deliveryMethod,
      deliveryAddress: deliveryAddress,
    }),
  }).then(checkResponse);
};

export const updateOrderImages = (
  id: string,
  orderImages: Array<IOrderImages>
) => {
  return fetch(`${BASE_URL}/order/order-images/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      orderImages: orderImages,
    }),
  }).then(checkResponse);
};

export const updatePayProofImages = (
  id: string,
  payProofImages: Array<IOrderImages>
) => {
  return fetch(`${BASE_URL}/order/pay-proof-images/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      payProofImages: payProofImages,
    }),
  }).then(checkResponse);
};

export const deleteOrderImage = (imageName: string, id: string) => {
  return fetch(`${BASE_URL}/order/order-images/${id}`, {
    credentials: "include",
    method: "DELETE",
    headers: HEADERS,
    body: JSON.stringify({
      imageName: imageName,
    }),
  }).then(checkResponse);
};

export const deletePayProofImage = (imageName: string, id: string) => {
  return fetch(`${BASE_URL}/order/pay-proof-images/${id}`, {
    credentials: "include",
    method: "DELETE",
    headers: HEADERS,
    body: JSON.stringify({
      imageName: imageName,
    }),
  }).then(checkResponse);
};

export const uploadImages = (files: FormData, folder: string) => {
  return fetch(`${BASE_URL}/images-upload/`, {
    method: "POST",
    headers: {
      Folder: folder,
    },
    body: files,
  }).then(checkResponse);
};

export const acceptPayment = (id: string) => {
  return fetch(`${BASE_URL}/order/order-accept-pay/${id}`, {
    credentials: "include",
    method: "PATCH",
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
