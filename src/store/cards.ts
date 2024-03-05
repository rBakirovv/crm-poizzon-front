import { makeAutoObservable } from "mobx";
import { ICards, IOrder } from "../types/interfaces";

class CardsData {
  cards: ICards = {
    updatedAt: null,
    _id: "",
  };

  ordersAfterUpdatedAt: Array<IOrder> = [];

  ordersTodayPaidAt: Array<IOrder> = [];
  ordersTodaySplitAt: Array<IOrder> = [];
  ordersTodaySplitSecondAt: Array<IOrder> = [];

  ordersYesterdayPaidAt: Array<IOrder> = [];
  ordersYesterdaySplitAt: Array<IOrder> = [];
  ordersYesterdaySplitSecondAt: Array<IOrder> = [];

  ordersSplitSecondByDate: Array<IOrder> = [];

  splitDebt: Array<IOrder> = [];

  constructor() {
    makeAutoObservable(this);
  }

  setUpdatedDate = (newDate: ICards) => {
    this.cards = newDate;
  };

  setOrdersAfterUpdatedAt = (orders: Array<IOrder>) => {
    this.ordersAfterUpdatedAt = orders;
  };

  setOrdersTodayPaidAt = (orders: Array<IOrder>) => {
    this.ordersTodayPaidAt = orders;
  };

  setOrdersTodaySplitAt = (orders: Array<IOrder>) => {
    this.ordersTodaySplitAt = orders;
  };

  setOrdersTodaySplitSecondAt = (orders: Array<IOrder>) => {
    this.ordersTodaySplitSecondAt = orders;
  };

  setOrdersYesterdayPaidAt = (orders: Array<IOrder>) => {
    this.ordersYesterdayPaidAt = orders;
  };

  setOrdersYesterdaySplitAt = (orders: Array<IOrder>) => {
    this.ordersYesterdaySplitAt = orders;
  };

  setOrdersYesterdaySplitSecondAt = (orders: Array<IOrder>) => {
    this.ordersYesterdaySplitSecondAt = orders;
  };

  setSplitDebt = (orders: Array<IOrder>) => {
    this.splitDebt = orders;
  };

  setOrdersSplitSecondByDate = (orders: Array<IOrder>) => {
    this.ordersSplitSecondByDate = orders;
  };
}

export default new CardsData();
