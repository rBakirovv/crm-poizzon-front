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
  stockman: string;
  createdAt: Date;
  overudeAfter: Date;
  paidAt: Date;
  buyAt: Date | string;
  inChinaStockAt: Date | string;
  deliveredAt: Date | string;
  orderId: number;
  combinedOrder: Array<ICombinedOrder>;
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
  deliveryName?: string;
  deliveryNameRecipient?: string;
  deliveryPhone?: string;
  deliveryPhoneRecipient?: string;
  deliveryMethod: string;
  deliveryAddress: string;
  deliveryEntity: string;
  deliveryRelatedEntities: string;
  reorder: boolean,
  __v?: number;
}

interface ICombinedOrder {
  combinedOrder: Array<string>;
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
