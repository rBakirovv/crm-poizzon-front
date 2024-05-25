import { makeAutoObservable } from "mobx";
import { ICommission } from "../types/interfaces";

class CommissionData {
  commission: ICommission = {
    sneakersChina: "0",
    sneakersRussia: "0",
    winterShoesChina: "0",
    winterShoesRussia: "0",
    jacketChina: "0",
    jacketRussia: "0",
    sweatshirtChina: "0",
    sweatshirtRussia: "0",
    tShirtChina: "0",
    tShirtRussia: "0",
    socksChina: "0",
    socksRussia: "0",
    bagChina: "0",
    bagRussia: "0",
    perfumeChina: "0",
    perfumeRussia: "0",
    pantsChina: "0",
    pantsRussia: "0",
    headdressChina: "0",
    headdressRussia: "0",
    techniqueChina: "0",
    techniqueRussia: "0",
    otherChina: "0",
    otherRussia: "0",
    commission: "999",
    _id: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setUpdatedCommission = (newCommission: ICommission) => {
    this.commission = newCommission;
  };
}

export default new CommissionData();