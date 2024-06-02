import { makeAutoObservable } from "mobx";
import { IDeliveryMethod } from "../types/interfaces";

class DeliveryMethodData {
  deliveryMethod: IDeliveryMethod = {
    isCDEKBreakdown: false,
    _id: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setDeliveryMethod = (deliveryMethod: IDeliveryMethod) => {
    this.deliveryMethod = deliveryMethod;
  }

  setIsCDEKBreakdown = (changedCDEKBreakdown: boolean) => {
    this.deliveryMethod.isCDEKBreakdown = changedCDEKBreakdown;
  };
}

export default new DeliveryMethodData();