import { makeAutoObservable } from "mobx";
import { IOrder } from "../types/interfaces";

class OrderData {
  order: IOrder = {
    _id: "",
    creater: "",
    buyer: "",
    postman: "",
    createdAt: new Date(Date.now()),
    overudeAfter: new Date(Date.now()),
    buyAt: "",
    inChinaStockAt: "",
    orderId: 0,
    combinedOrder: [],
    status: "",
    link: "",
    category: "",
    subcategory: "",
    brand: "",
    model: "",
    size: "",
    orderImages: [],
    payProofImages: [],
    buyProofImages: [],
    payment: "",
    currentRate: "0",
    priceCNY: "0",
    priceDeliveryChina: "0",
    priceDeliveryRussia: "0",
    commission: "0",
    promoCodePercent: 0,
    comment: "",
    poizonCode: "",
    deliveryCode: "",
    deliveryName: "",
    deliveryNameRecipient: "",
    deliveryPhone: "",
    deliveryPhoneRecipient: "",
    deliveryMethod: "",
    deliveryAddress: "",
    __v: 0,
  };

  orders: Array<IOrder> = [];

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
}

export default new OrderData();
