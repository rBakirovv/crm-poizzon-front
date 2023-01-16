export interface IUserData {
  email: string;
  name: string;
  position: string;
  _id?: string;
  __v?: number;
}

export interface IPayments {
  title: string;
  number: string;
  _id: string;
}

export interface IOrder {
  _id: string;
  creater: string;
  buyer: string;
  postman: string;
  createdAt: Date;
  overudeAfter: Date;
  buyAt: Date | string;
  inChinaStockAt: Date | string;
  orderId: number;
  status: string;
  link: string;
  category: string;
  subcategory: string;
  brand: string;
  model: string;
  size: string;
  orderImages: Array<IOrderImages>;
  payProofImages: Array<IOrderImages>;
  buyProofImages: Array<IOrderImages>;
  payment: string;
  currentRate: string;
  priceCNY: string;
  priceDeliveryChina: string;
  priceDeliveryRussia: string;
  commission: string;
  promoCodePercent: number;
  comment: string;
  poizonCode: string;
  deliveryCode: string;
  deliveryName: string;
  deliveryNameRecipient: string;
  deliveryPhone: string;
  deliveryPhoneRecipient: string;
  deliveryMethod: string;
  deliveryAddress: string;
  __v?: number;
}

export interface IOrderImages {
  _id: string;
  name: string;
  path: string;
  size: string;
}

export interface IRate {
  rate: string;
  _id?: string;
}

export interface IPromoCode {
  code: string;
  percent: number;
  _id?: string;
}
