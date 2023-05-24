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

export const getCurrentClientOrder = (orderId: string | string[]) => {
  return fetch(`${BASE_URL}/order/current/${orderId}`, {
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

export const getOrderByNumber = (orderId: string | string[]) => {
  return fetch(`${BASE_URL}/order-number/${orderId}`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const mergeOrders = (id: string, combinedOrder: Array<string>) => {
  return fetch(`${BASE_URL}/order/merge/${id}`, {
    credentials: "include",
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify({
      combinedOrder: combinedOrder,
    }),
  }).then(checkResponse);
};

export const createOrder = (
  creater: string,
  link: string,
  category: string,
  subcategory: string,
  brand: string,
  model: string,
  size: string,
  orderImages: Array<IOrderImages>,
  payment: string,
  currentRate: string,
  priceCNY: string,
  priceDeliveryChina: string,
  priceDeliveryRussia: string,
  commission: string,
  promoCodePercent: number,
  comment: string
) => {
  return fetch(`${BASE_URL}/orders/create`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      creater: creater,
      link: link,
      category: category,
      subcategory: subcategory,
      brand: brand,
      model: model,
      size: size,
      orderImages: orderImages,
      payment: payment,
      currentRate: currentRate,
      priceCNY: priceCNY,
      priceDeliveryChina: priceDeliveryChina,
      priceDeliveryRussia: priceDeliveryRussia,
      commission: commission,
      promoCodePercent: promoCodePercent,
      comment: comment,
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
  payLink: string,
  paymentUUID: string,
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
      payLink: payLink,
      paymentUUID: paymentUUID,
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

export const setDeliveryData = (
  id: string,
  deliveryName: string,
  deliveryPhone: string
) => {
  return fetch(`${BASE_URL}/order/set-delivery-data/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      deliveryName: deliveryName,
      deliveryPhone: deliveryPhone,
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

export const deleteDraftImage = (imageName: string) => {
  return fetch(`${BASE_URL}/order/order-draft-images`, {
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

export const inPurchase = (id: string, buyer: string) => {
  return fetch(`${BASE_URL}/order/in-purchase/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      buyer: buyer,
    }),
  }).then(checkResponse);
};

export const cancelPurchase = (id: string) => {
  return fetch(`${BASE_URL}/order/cancel-purchase/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
  }).then(checkResponse);
};

export const updatePurchaseData = (id: string, poizonCode: string, filledPoizonCode: string) => {
  return fetch(`${BASE_URL}/order/purchase/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      poizonCode: poizonCode,
      filledPoizonCode: filledPoizonCode,
    }),
  }).then(checkResponse);
};

export const updatePurchaseImages = (
  id: string,
  buyProofImages: Array<IOrderImages>,
  uploadedBuyProofImages: string,
) => {
  return fetch(`${BASE_URL}/order/purchase-images/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      buyProofImages: buyProofImages,
      uploadedBuyProofImages: uploadedBuyProofImages,
    }),
  }).then(checkResponse);
};

export const deletePurchaseImage = (imageName: string, id: string) => {
  return fetch(`${BASE_URL}/order/purchase-images/${id}`, {
    credentials: "include",
    method: "DELETE",
    headers: HEADERS,
    body: JSON.stringify({
      imageName: imageName,
    }),
  }).then(checkResponse);
};

export const deliveryToMoscow = (id: string) => {
  return fetch(`${BASE_URL}/order/delivery-to-Moscow/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
  }).then(checkResponse);
};

export const inStockInRussia = (id: string, stockman: string) => {
  return fetch(`${BASE_URL}/order/in-stock-in-Russia/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      stockman: stockman,
    }),
  }).then(checkResponse);
};

export const orderSent = (id: string, deliveryCode: string) => {
  return fetch(`${BASE_URL}/order/order-sent/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      deliveryCode: deliveryCode,
    }),
  }).then(checkResponse);
};

export const orderСompleted = (id: string) => {
  return fetch(`${BASE_URL}/order/order-completed/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
  }).then(checkResponse);
};

export const notLegit = (id: string) => {
  return fetch(`${BASE_URL}/order/not-legit/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
  }).then(checkResponse);
};

export const orderResume = (id: string) => {
  return fetch(`${BASE_URL}/order/order-resume/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
  }).then(checkResponse);
};

export const updateDeliveryAddress = (id: string, deliveryAddress: string) => {
  return fetch(`${BASE_URL}/order/order-delivery/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      deliveryAddress: deliveryAddress,
    }),
  }).then(checkResponse);
};

export const updateDeliveryPhone = (id: string, deliveryPhone: string) => {
  return fetch(`${BASE_URL}/order/order-phone/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      deliveryPhone: deliveryPhone,
    }),
  }).then(checkResponse);
};

export const updateDeliveryName = (
  id: string,
  deliveryNameRecipient: string
) => {
  return fetch(`${BASE_URL}/order/order-name/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      deliveryNameRecipient: deliveryNameRecipient,
    }),
  }).then(checkResponse);
};

export const updateDeliveryDuplicate = (
  id: string,
  deliveryRelatedEntities: string
) => {
  return fetch(`${BASE_URL}/order/order-duplicate/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      deliveryRelatedEntities: deliveryRelatedEntities,
    }),
  }).then(checkResponse);
};

export const updateDeliveryCDEKCode = (id: string, deliveryCode: string) => {
  return fetch(`${BASE_URL}/order/delivery-track-code/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      deliveryCode: deliveryCode,
    }),
  }).then(checkResponse);
};

// Работа со CDEK API

export const deliveryAuthorization = () => {
  return fetch(`${BASE_URL}/delivery/auth`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
  }).then(checkResponse);
};

export const deliveryCreate = (
  auth: string,
  number: string,
  comment: string,
  currentPVZId: string,
  name: string,
  amount: number,
  deliveryPhone: string | undefined,
  deliveryNameRecipient: string,
  tarif: number
) => {
  return fetch(`${BASE_URL}/delivery/new`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      auth: auth,
      number: number,
      comment: comment,
      currentPVZId: currentPVZId,
      name: name,
      amount: amount,
      deliveryPhone,
      deliveryNameRecipient,
      tarif,
    }),
  }).then(checkResponse);
};

export const createOrderDeliveryDuplicate = (
  auth: string,
  number: string,
  comment: string,
  currentPVZId: string,
  packages: any,
  amount: number,
  deliveryPhone: string | undefined,
  deliveryNameRecipient: string,
  tarif: number
) => {
  return fetch(`${BASE_URL}/delivery/new-duplicate`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      auth: auth,
      number: number,
      comment: comment,
      currentPVZId: currentPVZId,
      packages: packages,
      amount: amount,
      deliveryPhone,
      deliveryNameRecipient,
      tarif,
    }),
  }).then(checkResponse);
};

export const getDeliveryInfo = (auth: string, uuid: string) => {
  return fetch(`${BASE_URL}/delivery/uuid`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      auth: auth,
      uuid: uuid,
    }),
  }).then(checkResponse);
};

export const createDeliveryDocument = (auth: string, uuid: string) => {
  return fetch(`${BASE_URL}/delivery/document/new`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      auth: auth,
      uuid: uuid,
    }),
  }).then(checkResponse);
};

export const getDeliveryDocument = (auth: string, uuid: string) => {
  return fetch(`${BASE_URL}/delivery/document/uuid`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      auth: auth,
      uuid: uuid,
    }),
  }).then(checkResponse);
};

export const updateClientDeliveryAddress = (
  id: string,
  deliveryAddress: string,
  deliveryNameRecipient: string,
  deliveryMethod: string,
  deliveryEntity: string
) => {
  return fetch(`${BASE_URL}/order/delivery-address/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      deliveryAddress: deliveryAddress,
      deliveryNameRecipient: deliveryNameRecipient,
      deliveryMethod: deliveryMethod,
      deliveryEntity: deliveryEntity,
    }),
  }).then(checkResponse);
};

export const createDeliveryBarcode = (auth: string, uuid: string) => {
  return fetch(`${BASE_URL}/delivery/barcode/new`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      auth: auth,
      uuid: uuid,
    }),
  }).then(checkResponse);
};

export const getDeliveryBarcode = (auth: string, uuid: string) => {
  return fetch(`${BASE_URL}/delivery/barcode/uuid`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      auth: auth,
      uuid: uuid,
    }),
  }).then(checkResponse);
};

export const changeOrderDeliveryPhone = (
  auth: string,
  uuid: string,
  deliveryPhone: string | undefined
) => {
  return fetch(`${BASE_URL}/delivery/update-phone`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      auth: auth,
      uuid: uuid,
      deliveryPhone: deliveryPhone,
    }),
  }).then(checkResponse);
};

export const changeOrderDeliveryAddress = (
  auth: string,
  uuid: string,
  amount: number,
  currentPVZId: string,
  tarif: number
) => {
  return fetch(`${BASE_URL}/delivery/update-address`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      auth: auth,
      uuid: uuid,
      amount: amount,
      currentPVZId: currentPVZId,
      tarif: tarif,
    }),
  }).then(checkResponse);
};

export const changeOrderDeliveryName = (
  auth: string,
  uuid: string,
  deliveryName: string | undefined
) => {
  return fetch(`${BASE_URL}/delivery/update-name`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      auth: auth,
      uuid: uuid,
      deliveryName: deliveryName,
    }),
  }).then(checkResponse);
};

export const changeOrderDeliveryPackages = (
  auth: string,
  uuid: string,
  value: number,
  deliveryPackages: any
) => {
  return fetch(`${BASE_URL}/delivery/update-packages`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      auth: auth,
      uuid: uuid,
      value: value,
      packages: deliveryPackages,
    }),
  }).then(checkResponse);
};

export const changeTotalSum = (
  auth: string,
  tariff_code: number,
  from_location: number,
  to_location: number,
  packages: any,
  parameter: number
) => {
  return fetch(`${BASE_URL}/delivery/sum`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      auth: auth,
      tariff_code: tariff_code,
      from_location: from_location,
      to_location: to_location,
      packages: packages,
      parameter: parameter,
    }),
  }).then(checkResponse);
};

// Работа со CDEK API КОНЕЦ

export const reorderStatus = (id: string) => {
  return fetch(`${BASE_URL}/order/reorder/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
  }).then(checkResponse);
};

export const getCardsUpdatedAt = () => {
  return fetch(`${BASE_URL}/cards/statistics`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const updateCardsStatistics = (id: string) => {
  return fetch(`${BASE_URL}/cards/update/${id}`, {
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
