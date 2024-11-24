export interface IUserData {
  email: string;
  name: string;
  position: string;
  username?: string;
  _id?: string;
  __v?: number;
}

export interface IPayments {
  title: string;
  number: string;
  _id: string;
  paymentOrder: number;
  servicePercentage: string;
}

export interface IOrder {
  _id: string;
  creater: string;
  buyer: string;
  stockman: string;
  createdAt: Date;
  overudeAfter: Date;
  payBeforeSplit: Date;
  paidAt: Date;
  buyAt: Date | string;
  inChinaStockAt: Date | string;
  inRussiaStockAt: Date | string;
  deliveredAt: Date | string;
  orderId: number;
  combinedOrder: Array<ICombinedOrder>;
  status: string;
  link: string;
  payLink: string;
  payLinkSplit: string;
  paymentUUID: string;
  paymentUUIDSplit: string;
  payLinkSplitSecond: string;
  paymentUUIDSplitSecond: string;
  isSplitPaid: boolean;
  isSplitPaidSecond: boolean;
  paidAtSplit: Date;
  paidAtSplitSecond: Date;
  category: string;
  subcategory: string;
  brand: string;
  model: string;
  size: string;
  orderImages: Array<IOrderImages>;
  payProofImages: Array<IOrderImages>;
  buyProofImages: Array<IOrderImages>;
  receiptImages: Array<IOrderImages>;
  uploadedBuyProofImages: string;
  uploadedReceiptImages: string;
  isReceiptImages: boolean;
  payment: string;
  isSplit: boolean;
  currentRate: string;
  veritableRate: string;
  priceCNY: string;
  veritablePriceCNY: string;
  priceDeliveryChina: string;
  priceDeliveryRussia: string;
  commission: string;
  promoCodePercent: number;
  comment: string;
  poizonCode: string;
  filledPoizonCode: string;
  deliveryCode: string;
  deliveryName: string;
  deliveryNameRecipient: string;
  deliveryPhone: string;
  deliveryPhoneRecipient: string;
  deliveryMethod: string;
  deliveryAddress: string;
  deliveryEntity: string;
  deliveryRelatedEntities: string;
  reorder: boolean;
  totalReorder: boolean;
  payLinksArray: Array<string>;
  splitLinksArray: Array<string>;
  splitSecondLinksArray: Array<string>;
  isPost: boolean;
  isPurchaseImagesDisabled: boolean;
  expressCost: number;
  payLinkExpress: string;
  payLinkSplitExpress: string;
  payLinkSplitSecondExpress: string;
  paymentUUIDExpress: string;
  paymentUUIDSplitExpress: string;
  paymentUUIDSplitSecondExpress: string;
  payLinksExpressArray: Array<string>;
  splitLinksExpressArray: Array<string>;
  splitSecondLinksExpressArray: Array<string>;
  isSurcharge: boolean;
  surchargePayLink: string;
  surchargeUUID: string;
  surchargePayLinksArray: Array<string>;
  surchargeTotal: number;
  paidAtSurcharge: Date;
  servicePercentage: string;
  addedValue: string;
  takenAwayValue: string;
  returnValue: false;
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

export interface ICards {
  updatedAt: Date | null;
  _id?: string;
}

export interface ISupply {
  createdAt: string;
  supply: Array<String>;
  stock: Array<String>;
  _id?: string;
  __v?: number;
}

export interface ISupply {
  createdAt: string;
  supply: Array<String>;
  stock: Array<String>;
  _id?: string;
  __v?: number;
}

export interface ICommission {
  sneakersChina: string;
  sneakersRussia: string;
  winterShoesChina: string;
  winterShoesRussia: string;
  jacketChina: string;
  jacketRussia: string;
  sweatshirtChina: string;
  sweatshirtRussia: string;
  tShirtChina: string;
  tShirtRussia: string;
  socksChina: string;
  socksRussia: string;
  bagChina: string;
  bagRussia: string;
  perfumeChina: string;
  perfumeRussia: string;
  pantsChina: string;
  pantsRussia: string;
  headdressChina: string;
  headdressRussia: string;
  techniqueChina: string;
  techniqueRussia: string;
  otherChina: string;
  otherRussia: string;
  commission: string;
  _id?: string;
  __v?: number;
}

export interface IMergedOrders {
  orderId: number;
  _id: string;
  orderStatus: string;
  subcategory: string;
  priceCNY: string;
  currentRate: string;
  priceDeliveryChina: string;
  priceDeliveryRussia: string;
  commission: string;
  promoCodePercent: number;
  expressCost: number;
  payment: string;
  isSplitPaid: boolean;
  isSplitPaidSecond: boolean;
}

export interface IMergedClientOrders {
  orderId: number;
  _id: string;
  model: string;
  subcategory: string;
}

export interface IDeliveryMethod {
  isCDEKBreakdown: boolean;
  _id: string;
}