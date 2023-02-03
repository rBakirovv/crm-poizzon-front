import { makeAutoObservable } from "mobx";

class OrdersBar {
  orderStatus: string = "Черновик";

  constructor() {
    makeAutoObservable(this);
  }

  setNewStatus = (newStatus: string) => {
    this.orderStatus = newStatus;
  };
}

export default new OrdersBar();
