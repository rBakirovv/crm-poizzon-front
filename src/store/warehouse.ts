import { makeAutoObservable } from "mobx";
import { IOrder } from "../types/interfaces";

class WarehouseData {
  ordersRecentlyArrived: Array<IOrder> = [];

  constructor() {
    makeAutoObservable(this);
  }

  setOrdersRecentlyArrived = (orders: Array<IOrder>) => {
    this.ordersRecentlyArrived = orders;
  };
}

export default new WarehouseData();