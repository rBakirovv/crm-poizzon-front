export interface IUserData {
  email: string;
  name: string;
  position: string;
  _id?: string;
  __v?: number;
}

export interface IPayments {
  title: string;
  number: string;
  _id: string;
}

export interface IOrder {
  link: string;
  _id: string;
  creater: string;
  createdAt: Date;
  overudeAfter: Date;
  orderId: number;
  status: string;
  __v: number;
}

export interface IRate {
  rate: string;
  _id?: string;
}
