import { makeAutoObservable } from "mobx";
import { IPromoCode } from "../types/interfaces";

class PromoCodeData {
  promoCodeList: Array<IPromoCode> = [];
  percent: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  createPromoCode = (promoCodes: IPromoCode) => {
    this.promoCodeList.push(promoCodes);
  };

  setPromoCodeList(usersList: Array<IPromoCode>) {
    this.promoCodeList = usersList;
  }

  setPercent(newPercent: number) {
    this.percent = newPercent;
  }

  deletePromoCode = (codeId: string) => {
    this.promoCodeList = this.promoCodeList.filter(
      (promoCodeItem) => promoCodeItem._id !== codeId
    );
  };
}

export default new PromoCodeData();
