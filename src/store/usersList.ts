import { makeAutoObservable } from "mobx";
import { IUserData } from "../types/interfaces";

class UsersDataList {
  usersList: Array<IUserData> = [];

  constructor() {
    makeAutoObservable(this);
  }

  createUser = (user: IUserData) => {
    this.usersList.push(user);
  };

  setUsersList(usersList: Array<IUserData>) {
    this.usersList = usersList;
  }

  deleteUser = (email: string) => {
    this.usersList = this.usersList.filter((user) => user.email !== email);
  };
}

export default new UsersDataList();
