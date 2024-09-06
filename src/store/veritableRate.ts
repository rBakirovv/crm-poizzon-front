import { makeAutoObservable } from "mobx";
import { IRate } from "../types/interfaces";

class VeritableRateData {
  veritableRate: IRate = {
    rate: "",
    _id: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setNewRate = (newVeritableRateRate: IRate) => {
    this.veritableRate = newVeritableRateRate;
  };
}

export default new VeritableRateData();
