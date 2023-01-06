import Link from "next/link";
import { logOut } from "../../../utils/Auth";
import styles from "./Navigation.module.css";
import { useRouter } from "next/router";
import UserData from "../../../store/user";
import Logged from "../../../store/logged";

const Navigation = () => {
  const router = useRouter();

  function handleLogOut() {
    logOut();
    Logged.setLoggedIn(false);
    UserData.setUserData({
      email: "",
      name: "",
      position: "",
      _id: "",
    });

    router.push("/sign-in");
  }
  return (
    <nav className={styles["nav"]}>
      <ul className={styles["nav__list"]}>
        <li className={styles["nav__list-item"]}>
          <Link className={styles["nav__list-item-link"]} href="/">
            Заказы
          </Link>
        </li>
        <li className={styles["nav__list-item"]}>
          <Link className={styles["nav__list-item-link"]} href="/">
            Заказы на выкуп
          </Link>
        </li>
        <li className={styles["nav__list-item"]}>
          <Link className={styles["nav__list-item-link"]} href="/">
            Склад
          </Link>
        </li>
        <div className={styles["nav__list-line"]}></div>
        <li className={styles["nav__list-item"]}>
          <Link className={styles["nav__list-item-link"]} href="/">
            Оплата
          </Link>
        </li>
        <li className={styles["nav__list-item"]}>
          <Link className={styles["nav__list-item-link"]} href="/">
            Пользователи
          </Link>
        </li>
        <li className={styles["nav__list-item"]}>
          <Link className={styles["nav__list-item-link"]} href="/">
            Промо-код
          </Link>
        </li>
        <li onClick={handleLogOut} className={styles["nav__list-item"]}>
          Выход
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
