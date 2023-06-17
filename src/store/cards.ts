import { makeAutoObservable } from "mobx";
import { ICards, IOrder } from "../types/interfaces";

class CardsData {
  cards: ICards = {
    updatedAt: null,
    _id: "",
  };

  ordersAfterUpdatedAt: Array<IOrder> = [];

  constructor() {
    makeAutoObservable(this);
  }

  setUpdatedDate = (newDate: ICards) => {
    this.cards = newDate;
  };

  setOrdersAfterUpdatedAt = (orders: Array<IOrder>) => {
    this.ordersAfterUpdatedAt = orders;
  };
}

export default new CardsData();
