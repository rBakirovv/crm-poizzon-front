import { makeAutoObservable } from "mobx";

class Logged {
  loggedIn: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setLoggedIn = (logged: boolean) => {
    this.loggedIn = logged;
  };
}

export default new Logged();
