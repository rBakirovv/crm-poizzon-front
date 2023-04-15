import { makeAutoObservable } from "mobx";
import { ICards } from "../types/interfaces";

class CardsData {
  cards: ICards = {
    updatedAt: null,
    _id: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setUpdatedDate = (newDate: ICards) => {
    this.cards = newDate;
  };
}

export default new CardsData();
