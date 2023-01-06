import { makeAutoObservable } from "mobx";

interface IUserData {
  email: string,
  name: string,
  position: string,
  _id: string,
}

class UserData {
  userData: IUserData = {
    email: '',
    name: '',
    position: '',
    _id: '',
  };

  constructor() {
    makeAutoObservable(this);
  }

  setUserData = (data: IUserData) => {
    this.userData = data;
  };
}

export default new UserData();
