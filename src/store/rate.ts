import { makeAutoObservable } from "mobx";
import { IRate } from "../types/interfaces";

class RateData {
  rate: IRate = {
    rate: "",
    _id: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setNewRate = (newRate: IRate) => {
    this.rate = newRate;
  };
}

export default new RateData();
