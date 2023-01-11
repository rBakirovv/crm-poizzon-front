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

    setTimeout(() => router.push("/sign-in"), 200);
  }

  return (
    <nav className={styles["nav"]}>
      <ul className={styles["nav__list"]}>
        <li className={styles["nav__list-item"]}>
          <Link
            className={`${styles["nav__list-item-link"]} ${
              (router.pathname === "/" ||
                router.pathname.includes("/order/")) &&
              styles["nav__list-item-link_active"]
            }`}
            href="/"
          >
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
        {UserData.userData.position === "Создатель" && (
          <li className={styles["nav__list-item"]}>
            <Link
              className={`${styles["nav__list-item-link"]} ${
                router.pathname === "/rate" &&
                styles["nav__list-item-link_active"]
              }`}
              href="/rate"
            >
              Курс
            </Link>
          </li>
        )}
        {(UserData.userData.position === "Создатель" ||
          UserData.userData.position === "Администратор") && (
          <li className={styles["nav__list-item"]}>
            <Link
              className={`${styles["nav__list-item-link"]} ${
                router.pathname === "/payments" &&
                styles["nav__list-item-link_active"]
              }`}
              href="/payments"
            >
              Оплата
            </Link>
          </li>
        )}
        {(UserData.userData.position === "Создатель" ||
          UserData.userData.position === "Администратор") && (
          <li className={styles["nav__list-item"]}>
            <Link
              className={`${styles["nav__list-item-link"]} ${
                router.pathname === "/users" &&
                styles["nav__list-item-link_active"]
              }`}
              href="/users"
            >
              Пользователи
            </Link>
          </li>
        )}
        {(UserData.userData.position === "Создатель" ||
          UserData.userData.position === "Администратор") && (
          <li className={styles["nav__list-item"]}>
            <Link
              className={`${styles["nav__list-item-link"]} ${
                router.pathname === "/promo-code" &&
                styles["nav__list-item-link_active"]
              }`}
              href="/promo-code"
            >
              Промо-код
            </Link>
          </li>
        )}
        <li
          onClick={handleLogOut}
          className={`${styles["nav__list-item"]} ${styles["nav__list-item_exit"]}`}
        >
          Выход из аккаунта
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
