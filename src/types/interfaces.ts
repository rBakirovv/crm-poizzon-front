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
  createdAt: Date;
  overudeAfter: Date;
  orderId: number;
  status: string;
  link: string;
  category: string;
  subcategory: string;
  brand: string;
  model: string;
  size: string;
  // images
  payment: string;
  currentRate: string;
  priceCNY: string;
  priceDeliveryChina: string;
  priceDeliveryRussia: string;
  commission: string;
  promoCodePercent: number;
  comment: string;
  __v?: number;
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
