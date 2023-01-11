import { makeAutoObservable } from "mobx";
import { IPayments } from "../types/interfaces";

class PaymentsData {
  paymentsList: Array<IPayments> = [];

  constructor() {
    makeAutoObservable(this);
  }

  createPayment = (payments: IPayments) => {
    this.paymentsList.push(payments);
  };

  setPaymentsList(paymentsList: Array<IPayments>) {
    this.paymentsList = paymentsList;
  }

  deletePayment = (payment: string) => {
    this.paymentsList = this.paymentsList.filter(
      (paymentItem) => paymentItem._id !== payment
    );
  };
}

export default new PaymentsData();
