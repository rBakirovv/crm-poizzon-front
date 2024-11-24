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

export const getOrdersTable = (
  index: number,
  status: string | null,
  filterPurchased: string,
  filterPayment: string,
  filterReorder: string
) => {
  return fetch(
    `${BASE_URL}/orders-table?page=${index}&status=${status}&filterPurchased=${filterPurchased}&filterPayment=${filterPayment}&filterReorder=${filterReorder}`,
    {
      credentials: "include",
      method: "GET",
      headers: HEADERS,
    }
  ).then(checkResponse);
};

export const searchOrder = (page: number, search: string | number) => {
  return fetch(`${BASE_URL}/orders-search`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      page: page,
      search: search,
    }),
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

export const unmergeOrders = (id: string) => {
  return fetch(`${BASE_URL}/order/unmerge/${id}`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
  }).then(checkResponse);
};

export const getClientCombinedOrders = (id: string) => {
  return fetch(`${BASE_URL}/order/client-merge-info/${id}`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const getCombinedOrders = (id: string) => {
  return fetch(`${BASE_URL}/order/merge-info/${id}`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
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
  veritableRate: string,
  priceCNY: string,
  priceDeliveryChina: string,
  priceDeliveryRussia: string,
  commission: string,
  promoCodePercent: number,
  comment: string,
  totalReorder: boolean,
  servicePercentage: string
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
      veritableRate: veritableRate,
      priceCNY: priceCNY,
      priceDeliveryChina: priceDeliveryChina,
      priceDeliveryRussia: priceDeliveryRussia,
      commission: commission,
      promoCodePercent: promoCodePercent,
      comment: comment,
      totalReorder: totalReorder,
      servicePercentage: servicePercentage,
    }),
  }).then(checkResponse);
};

export const createOrderSplit = (
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
  comment: string,
  totalReorder: boolean
) => {
  return fetch(`${BASE_URL}/orders/create-split`, {
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
      totalReorder: totalReorder,
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
  payLinkSplit: string,
  paymentUUIDSplit: string,
  payLinkSplitSecond: string,
  paymentUUIDSplitSecond: string,
  payLinkExpress: string,
  paymentUUIDExpress: string,
  payLinkSplitExpress: string,
  paymentUUIDSplitExpress: string,
  payLinkSplitSecondExpress: string,
  paymentUUIDSplitSecondExpress: string,
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
      payLinkSplit: payLinkSplit,
      paymentUUIDSplit: paymentUUIDSplit,
      payLinkSplitSecond: payLinkSplitSecond,
      paymentUUIDSplitSecond: paymentUUIDSplitSecond,
      payLinkExpress: payLinkExpress,
      paymentUUIDExpress: paymentUUIDExpress,
      payLinkSplitExpress: payLinkSplitExpress,
      paymentUUIDSplitExpress: paymentUUIDSplitExpress,
      payLinkSplitSecondExpress: payLinkSplitSecondExpress,
      paymentUUIDSplitSecondExpress: paymentUUIDSplitSecondExpress,
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

export const updatePaidAt = (id: string) => {
  return fetch(`${BASE_URL}/order/paid/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
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

export const deleteDraftImage = (imageName: string, id: string) => {
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

export const acceptPaymentSplit = (id: string) => {
  return fetch(`${BASE_URL}/order/order-accept-pay-split/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
  }).then(checkResponse);
};

export const acceptPaymentSplitSecond = (id: string) => {
  return fetch(`${BASE_URL}/order/order-accept-pay-split-second/${id}`, {
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

export const updatePurchaseData = (
  id: string,
  poizonCode: string,
  filledPoizonCode: string
) => {
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
  uploadedBuyProofImages: string
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

export const getInStockInRussia = () => {
  return fetch(`${BASE_URL}/orders-stock`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
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

export const orderDeliveryCode = (id: string, deliveryCode: string) => {
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

export const updateDeliveryTg = (id: string, deliveryName: string) => {
  return fetch(`${BASE_URL}/order/order-tg/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      deliveryName: deliveryName,
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
  deliveryPhone: string,
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
      deliveryPhone: deliveryPhone,
      deliveryNameRecipient: deliveryNameRecipient,
      tarif: tarif,
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
  deliveryName: string,
  deliveryNameRecipient: string,
  deliveryPhone: string,
  deliveryMethod: string,
  deliveryEntity: string
) => {
  return fetch(`${BASE_URL}/order/delivery-address/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      deliveryAddress: deliveryAddress,
      deliveryName: deliveryName,
      deliveryNameRecipient: deliveryNameRecipient,
      deliveryPhone: deliveryPhone,
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

export const getCities = (auth: string) => {
  return fetch(`${BASE_URL}/delivery/cities`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      auth: auth,
    }),
  }).then(checkResponse);
};

export const getDeliverypoints = (auth: string, code: number) => {
  return fetch(`${BASE_URL}/delivery/deliverypoints`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      auth: auth,
      code: code,
    }),
  }).then(checkResponse);
};

export const calculateTariff = (auth: string, to_location: number) => {
  return fetch(`${BASE_URL}/delivery/calculate-tariff`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      auth: auth,
      to_location: to_location,
    }),
  }).then(checkResponse);
};

export const updateReceiptImages = (
  id: string,
  receiptImages: Array<IOrderImages>,
  uploadedReceiptImages: string
) => {
  return fetch(`${BASE_URL}/order/receipt-images/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      receiptImages: receiptImages,
      uploadedReceiptImages: uploadedReceiptImages,
    }),
  }).then(checkResponse);
};

export const deleteReceiptImage = (imageName: string, id: string) => {
  return fetch(`${BASE_URL}/order/receipt-images/${id}`, {
    credentials: "include",
    method: "DELETE",
    headers: HEADERS,
    body: JSON.stringify({
      imageName: imageName,
    }),
  }).then(checkResponse);
};

export const setIsReceiptImages = (id: string, isReceiptImages: boolean) => {
  return fetch(`${BASE_URL}/order/is-receipt-images/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      isReceiptImages: isReceiptImages,
    }),
  }).then(checkResponse);
};

export const updatePayment = (
  id: string,
  payLink: string,
  paymentUUID: string,
  payLinkSplit: string,
  paymentUUIDSplit: string,
  payLinkSplitSecond: string,
  paymentUUIDSplitSecond: string,
  payLinkExpress: string,
  payLinkSplitExpress: string,
  payLinkSplitSecondExpress: string,
  paymentUUIDExpress: string,
  paymentUUIDSplitExpress: string,
  paymentUUIDSplitSecondExpress: string
) => {
  return fetch(`${BASE_URL}/order/update-payment/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      payLink: payLink,
      paymentUUID: paymentUUID,
      payLinkSplit: payLinkSplit,
      paymentUUIDSplit: paymentUUIDSplit,
      payLinkSplitSecond: payLinkSplitSecond,
      paymentUUIDSplitSecond: paymentUUIDSplitSecond,
      payLinkExpress: payLinkExpress,
      payLinkSplitExpress: payLinkSplitExpress,
      payLinkSplitSecondExpress: payLinkSplitSecondExpress,
      paymentUUIDExpress: paymentUUIDExpress,
      paymentUUIDSplitExpress: paymentUUIDSplitExpress,
      paymentUUIDSplitSecondExpress: paymentUUIDSplitSecondExpress,
    }),
  }).then(checkResponse);
};

export const setIsSplitHandler = (id: string, isSplit: boolean) => {
  return fetch(`${BASE_URL}/order/is-split/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      isSplit: isSplit,
    }),
  }).then(checkResponse);
};

export const addPayLink = (id: string, payLink: string) => {
  return fetch(`${BASE_URL}/order/add-pay-link/${id}`, {
    credentials: "include",
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify({
      payLink: payLink,
    }),
  }).then(checkResponse);
};

export const addPayLinkSplit = (id: string, splitLink: string) => {
  return fetch(`${BASE_URL}/order/add-pay-link-split/${id}`, {
    credentials: "include",
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify({
      splitLink: splitLink,
    }),
  }).then(checkResponse);
};

export const addPayLinkSplitSecond = (id: string, splitLinkSecond: string) => {
  return fetch(`${BASE_URL}/order/add-pay-link-split-second/${id}`, {
    credentials: "include",
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify({
      splitLinkSecond: splitLinkSecond,
    }),
  }).then(checkResponse);
};

export const addPayLinkExpress = (id: string, link: string) => {
  return fetch(`${BASE_URL}/order/add-pay-link-express/${id}`, {
    credentials: "include",
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify({
      link: link,
    }),
  }).then(checkResponse);
};

export const addPayLinkSplitExpress = (id: string, link: string) => {
  return fetch(`${BASE_URL}/order/add-pay-link-split-express/${id}`, {
    credentials: "include",
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify({
      link: link,
    }),
  }).then(checkResponse);
};

export const addPayLinkSplitSecondExpress = (id: string, link: string) => {
  return fetch(`${BASE_URL}/order/add-pay-link-split-second-express/${id}`, {
    credentials: "include",
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify({
      link: link,
    }),
  }).then(checkResponse);
};

/* Статистика карт */

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

export const getOrdersAfterUpdatedAt = () => {
  return fetch(`${BASE_URL}/cards/orders`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const getOrdersPaidToday = () => {
  return fetch(`${BASE_URL}/cards/orders-today`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const getOrdersSplitToday = () => {
  return fetch(`${BASE_URL}/cards/split-today`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const getOrdersSplitSecondToday = () => {
  return fetch(`${BASE_URL}/cards/split-second-today`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const getOrdersPaidYesterday = () => {
  return fetch(`${BASE_URL}/cards/orders-yesterday`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const getOrdersSplitYesterday = () => {
  return fetch(`${BASE_URL}/cards/split-yesterday`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const getOrdersSplitSecondYesterday = () => {
  return fetch(`${BASE_URL}/cards/split-second-yesterday`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const getSplitDebt = () => {
  return fetch(`${BASE_URL}/cards/split-debt`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

/* Удаление старых */

export const getLongCompletedOrders = () => {
  return fetch(`${BASE_URL}/orders-long-completed`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const deleteFinalOrder = (id: string) => {
  return fetch(`${BASE_URL}/order/orders-final/${id}`, {
    credentials: "include",
    method: "DELETE",
    headers: HEADERS,
  }).then(checkResponse);
};

export const getLongDrafts = () => {
  return fetch(`${BASE_URL}/orders-long-drafts`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const getRecentlyArrived = () => {
  return fetch(`${BASE_URL}/recently-arrived`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const setIsPost = (id: string, isPost: boolean) => {
  return fetch(`${BASE_URL}/order/is-post/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      isPost: isPost,
    }),
  }).then(checkResponse);
};

export const setPurchaseImagesDisabled = (
  id: string,
  isPurchaseImagesDisabled: boolean
) => {
  return fetch(`${BASE_URL}/order/purchase-images-disable/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      isPurchaseImagesDisabled: isPurchaseImagesDisabled,
    }),
  }).then(checkResponse);
};

export const setExpressCost = (id: string, expressCost: number) => {
  return fetch(`${BASE_URL}/order/express-cost/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      expressCost: expressCost,
    }),
  }).then(checkResponse);
};

export const getSecondSplitByDate = (date: string) => {
  return fetch(`${BASE_URL}/order/get-second-split-by-date`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      date: date,
    }),
  }).then(checkResponse);
};

export const getManagersByDate = (date: string, manager: string) => {
  return fetch(`${BASE_URL}/order/get-managers-by-date`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      date: date,
      manager: manager,
    }),
  }).then(checkResponse);
};

export const changeComment = (id: string, comment: string) => {
  return fetch(`${BASE_URL}/order/change-comment/${id}`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      comment: comment,
    }),
  }).then(checkResponse);
};

export const setIsSurcharge = (id: string, isSurcharge: boolean) => {
  return fetch(`${BASE_URL}/order/is-surcharge/${id}`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      isSurcharge: isSurcharge,
    }),
  }).then(checkResponse);
};

export const updateSurcharge = (
  id: string,
  surchargePayLink: string,
  surchargeUUID: string,
  surchargeTotal: number
) => {
  return fetch(`${BASE_URL}/order/update-surcharge/${id}`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      surchargePayLink: surchargePayLink,
      surchargeUUID: surchargeUUID,
      surchargeTotal: surchargeTotal,
    }),
  }).then(checkResponse);
};

export const acceptSurcharge = (id: string) => {
  return fetch(`${BASE_URL}/order/accept-surcharge/${id}`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
  }).then(checkResponse);
};

export const addSurcharge = (id: string, link: string) => {
  return fetch(`${BASE_URL}/order/add-pay-link-surcharge/${id}`, {
    credentials: "include",
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify({
      link: link,
    }),
  }).then(checkResponse);
};

export const changeVeritableRate = (id: string, veritableRate: string) => {
  return fetch(`${BASE_URL}/order/change-veritable-rate/${id}`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      veritableRate: veritableRate,
    }),
  }).then(checkResponse);
};

export const changeVeritablePriceCNY = (
  id: string,
  veritablePriceCNY: string
) => {
  return fetch(`${BASE_URL}/order/change-veritable-price-CNY/${id}`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      veritablePriceCNY: veritablePriceCNY,
    }),
  }).then(checkResponse);
};

export const reorderOrderReset = (id: string) => {
  return fetch(`${BASE_URL}/order/reorder-reset/${id}`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
  }).then(checkResponse);
};

export const reorderOrderCopy = (
  id: string,
  servicePercentage: string,
  veritablePriceCNY: string,
  veritableRate: string,
  deliveryAddress: string,
  deliveryEntity: string,
  deliveryMethod: string,
  deliveryName: string,
  deliveryNameRecipient: string,
  deliveryPhone: string,
  paidAt: Date | null,
  paidAtSplit: Date | null,
  paidAtSplitSecond: Date | null,
  priceCNY: string,
  priceDeliveryChina: string,
  priceDeliveryRussia: string,
  promoCodePercent: number,
  commission: string,
  currentRate: string,
  expressCost: number
) => {
  return fetch(`${BASE_URL}/order/reorder-copy/${id}`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      servicePercentage,
      veritablePriceCNY,
      veritableRate,
      deliveryAddress,
      deliveryEntity,
      deliveryMethod,
      deliveryName,
      deliveryNameRecipient,
      deliveryPhone,
      paidAt,
      paidAtSplit,
      paidAtSplitSecond,
      priceCNY,
      priceDeliveryChina,
      priceDeliveryRussia,
      promoCodePercent,
      commission,
      currentRate,
      expressCost,
    }),
  }).then(checkResponse);
};

export const setAddedValue = (id: string, addedValue: string) => {
  return fetch(`${BASE_URL}/order/added-value/${id}`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      addedValue: addedValue,
    }),
  }).then(checkResponse);
};

export const setTakenAwayValue = (id: string, takenAwayValue: string) => {
  return fetch(`${BASE_URL}/order/taken-away-value/${id}`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      takenAwayValue: takenAwayValue,
    }),
  }).then(checkResponse);
};

export const setReturnValue = (id: string, returnValue: boolean) => {
  return fetch(`${BASE_URL}/order/return-value/${id}`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      returnValue: returnValue,
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
