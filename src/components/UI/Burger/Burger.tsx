import { FC, useEffect, useState } from "react";
import Link from "next/link";
import ReactDOM from "react-dom";
import { useRouter } from "next/router";
import { logOut } from "../../../utils/Auth";
import UserData from "../../../store/user";
import Logged from "../../../store/logged";
import styles from "./Burger.module.css";

interface IBurgerProps {
  isBurgerOpen: boolean;
  closeBurger: () => void;
  createNewOrder: () => void;
}

const Burger: FC<IBurgerProps> = ({
  isBurgerOpen,
  closeBurger,
  createNewOrder,
}) => {
  const router = useRouter();

  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  });

  function handleCreateOrder() {
    createNewOrder();
    closeBurger();
  }

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

  const burgerElement = (
    <div
      className={`${styles["burger"]} ${
        isBurgerOpen && styles["burger_active"]
      }`}
    >
      <div className={styles["burger__buttons-container"]}>
        <button
          className={`${styles["burger__button"]} ${styles["burger__button_black"]}`}
          onClick={handleCreateOrder}
        >
          Новый заказ
        </button>
        <Link
          className={`${styles["burger__button"]} ${styles["burger__button_white"]}`}
          href="/"
        >
          Поиск
        </Link>
      </div>
      <ul className={styles["nav__list"]}>
        <li onClick={closeBurger} className={styles["nav__list-item"]}>
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
        <li onClick={closeBurger} className={styles["nav__list-item"]}>
          <Link className={styles["nav__list-item-link"]} href="/">
            Заказы на выкуп
          </Link>
        </li>
        <li onClick={closeBurger} className={styles["nav__list-item"]}>
          <Link className={styles["nav__list-item-link"]} href="/">
            Склад
          </Link>
        </li>
        {UserData.userData.position === "Создатель" && (
          <li onClick={closeBurger} className={styles["nav__list-item"]}>
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
          <li onClick={closeBurger} className={styles["nav__list-item"]}>
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
          <li onClick={closeBurger} className={styles["nav__list-item"]}>
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
          <li onClick={closeBurger} className={styles["nav__list-item"]}>
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
          onClick={() => {
            closeBurger();
            handleLogOut();
          }}
          className={`${styles["nav__list-item"]} ${styles["nav__list-item_exit"]}`}
        >
          Выход из аккаунта
        </li>
      </ul>
    </div>
  );

  if (isBrowser && document.getElementById("burger")) {
    return ReactDOM.createPortal(
      burgerElement,
      document.getElementById("burger")!
    );
  } else {
    return null;
  }
};

export default Burger;
