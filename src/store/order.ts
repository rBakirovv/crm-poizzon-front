import { makeAutoObservable } from "mobx";
import { IOrder } from "../types/interfaces";

class OrderData {
  order: IOrder = {
    _id: "",
    creater: "",
    createdAt: new Date(Date.now()),
    overudeAfter: new Date(Date.now()),
    orderId: 0,
    status: "",
    link: "",
    category: "",
    subcategory: "",
    brand: "",
    model: "",
    size: "",
    // images
    payment: "",
    currentRate: "0",
    priceCNY: "0",
    priceDeliveryChina: "0",
    priceDeliveryRussia: "0",
    commission: "0",
    promoCodePercent: 0,
    comment: "",
    __v: 0,
  };

  constructor() {
    makeAutoObservable(this);
  }

  setOrder(currentOrder: IOrder) {
    this.order = currentOrder;
  }

  setCurrentRate(rate: string) {
    this.order.currentRate = rate;
  }

  setLink(newLink: string) {
    this.order.link = newLink;
  }
}

export default new OrderData();
