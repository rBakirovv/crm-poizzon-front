import { makeAutoObservable } from "mobx";
import { IOrder, ISupply } from "../types/interfaces";

class SupplyData {
  supply: ISupply = {
    createdAt: "",
    supply: [],
    stock: [],
    _id: "",
    __v: 0,
  };

  supplies: Array<ISupply> = [];

  suppliesOrders: Array<IOrder> = [];

  constructor() {
    makeAutoObservable(this);
  }

  addSupply(supplyArray: Array<String>) {
    this.supply.supply = supplyArray;
  }

  addStock(stockArray: Array<String>) {
    this.supply.stock = stockArray;
  }

  deleteSupply(code: string) {
    this.supply.supply = this.supply.supply.filter(
      (codeItem) => codeItem !== code
    );
  }

  deleteSupplyDate(supplyId: string) {
    this.supplies = this.supplies.filter(
      (supplyItem) => supplyItem._id !== supplyId
    );
  }

  deleteStock(code: string) {
    this.supply.stock = this.supply.stock.filter(
      (codeItem) => codeItem !== code
    );
  }

  setSupplies(suppliesList: Array<ISupply>) {
    this.supplies = suppliesList;
  }

  setSupply(supply: ISupply) {
    this.supply = supply;
  }

  pushSupply(supply: ISupply) {
    this.supplies.push(supply);
  }

  setSuppliesOrders(orders: Array<IOrder>) {
    this.suppliesOrders = orders;
  }
}

export default new SupplyData();
