import { makeAutoObservable } from "mobx";
import { IUserData } from "../types/interfaces";

class UserData {
  userData: IUserData = {
    email: "",
    name: "",
    position: "",
    _id: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setUserData = (data: IUserData) => {
    this.userData = data;
  };
}

export default new UserData();
