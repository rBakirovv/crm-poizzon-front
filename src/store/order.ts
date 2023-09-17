import { makeAutoObservable } from "mobx";
import { IMergedOrders, IOrder } from "../types/interfaces";

class OrderData {
  order: IOrder = {
    _id: "",
    creater: "",
    buyer: "",
    stockman: "",
    createdAt: new Date(Date.now()),
    overudeAfter: new Date(Date.now()),
    paidAt: new Date(Date.now()),
    deliveredAt: new Date(Date.now()),
    buyAt: "",
    inChinaStockAt: "",
    orderId: 0,
    combinedOrder: [],
    status: "",
    link: "",
    payLink: "",
    paymentUUID: "",
    category: "",
    subcategory: "",
    brand: "",
    model: "",
    size: "",
    orderImages: [],
    payProofImages: [],
    buyProofImages: [],
    receiptImages: [],
    uploadedBuyProofImages: "",
    uploadedReceiptImages: "",
    isReceiptImages: false,
    payment: "",
    currentRate: "0",
    priceCNY: "0",
    priceDeliveryChina: "0",
    priceDeliveryRussia: "0",
    commission: "0",
    promoCodePercent: 0,
    comment: "",
    poizonCode: "",
    filledPoizonCode: "",
    deliveryCode: "",
    deliveryName: "",
    deliveryNameRecipient: "",
    deliveryPhone: "",
    deliveryPhoneRecipient: "",
    deliveryMethod: "",
    deliveryAddress: "",
    deliveryEntity: "",
    deliveryRelatedEntities: "",
    reorder: false,
    __v: 0,
  };

  orders: Array<IOrder> = [];

  ordersTableLength: number = 0;

  mergedOrders: Array<IMergedOrders> = [];

  constructor() {
    makeAutoObservable(this);
  }

  setOrder(currentOrder: IOrder) {
    this.order = currentOrder;
  }

  deleteOrder(orderId: string) {
    this.orders = this.orders.filter((orderItem) => orderItem._id !== orderId);
  }

  setOrders(ordersList: Array<IOrder>) {
    this.orders = ordersList;
  }

  pushOrder(orderItem: IOrder) {
    this.orders.push(orderItem);
  }

  setCurrentRate(rate: string) {
    this.order.currentRate = rate;
  }

  setLink(newLink: string) {
    this.order.link = newLink;
  }

  setOrdersTableLength(number: number) {
    this.ordersTableLength = number;
  }

  setMergedOrders(mergedOrdersData: Array<IMergedOrders>) {
    this.mergedOrders = mergedOrdersData;
  }
}

export default new OrderData();
