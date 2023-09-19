import { makeAutoObservable } from "mobx";

class OrdersBar {
  orderStatus: string | null =
    typeof window !== "undefined" && sessionStorage.getItem("ordersBar")
      ? sessionStorage.getItem("ordersBar")
      : "Черновик";

  constructor() {
    makeAutoObservable(this);
  }

  setNewStatus = (newStatus: string) => {
    this.orderStatus = newStatus;
    sessionStorage.setItem("ordersBar", newStatus);
  };
}

export default new OrdersBar();
