import { FC, useEffect, useState } from "react";
import Link from "next/link";
import ReactDOM from "react-dom";
import { useRouter } from "next/router";
import { logOut } from "../../../utils/Auth";
import UserData from "../../../store/user";
import Logged from "../../../store/logged";
import styles from "./Burger.module.css";
import OrdersBar from "../../../store/ordersBar";
import { observer } from "mobx-react-lite";

interface IBurgerProps {
  isBurgerOpen: boolean;
  closeBurger: () => void;
}

const Burger: FC<IBurgerProps> = observer(({ isBurgerOpen, closeBurger }) => {
  const router = useRouter();

  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  });

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

  function openDraft() {
    OrdersBar.setNewStatus("Черновик");
    router.replace("/");
  }

  function openPaymentVerification() {
    OrdersBar.setNewStatus("Проверка оплаты");
    router.replace("/");
  }

  function openAwaitingPurchase() {
    OrdersBar.setNewStatus("Ожидает закупки");
    router.replace("/");
  }

  function openOnPurchase() {
    OrdersBar.setNewStatus("На закупке");
    router.replace("/");
  }

  function openPurchased() {
    OrdersBar.setNewStatus("Закуплен");
    router.replace("/");
  }

  function openInRussia() {
    OrdersBar.setNewStatus("На складе в РФ");
    router.replace("/");
  }

  function openSent() {
    OrdersBar.setNewStatus("Доставляется");
    router.replace("/");
  }

  function openСompleted() {
    OrdersBar.setNewStatus("Завершён");
    router.replace("/");
  }

  const burgerElement = (
    <div
      className={`${styles["burger"]} ${
        isBurgerOpen && styles["burger_active"]
      }`}
    >
      <div className={styles["burger__buttons-container"]}>
        {UserData.userData.position !== "Байер" && (
          <Link
            className={`${styles["burger__button"]} ${styles["burger__button_black"]}`}
            href="/create-order"
            onClick={closeBurger}
          >
            Новый заказ
          </Link>
        )}
        <Link
          className={`${styles["burger__button"]} ${styles["burger__button_search"]}`}
          href="/search-order"
          onClick={closeBurger}
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
          <div className={styles["nav__list-item-order-container"]}>
            {UserData.userData.position !== "Байер" && (
              <button
                className={styles["nav__list-item-order"]}
                onClick={openDraft}
              >
                Черновик
              </button>
            )}
            {UserData.userData.position !== "Байер" && (
              <button
                className={styles["nav__list-item-order"]}
                onClick={openPaymentVerification}
              >
                Проверка оплаты
              </button>
            )}
            {UserData.userData.position !== "Менеджер" && (
              <button
                className={styles["nav__list-item-order"]}
                onClick={openAwaitingPurchase}
              >
                Ожидает закупки
              </button>
            )}
            {UserData.userData.position !== "Менеджер" && (
              <button
                className={styles["nav__list-item-order"]}
                onClick={openOnPurchase}
              >
                На закупке
              </button>
            )}
            {UserData.userData.position !== "Менеджер" && (
              <button
                className={styles["nav__list-item-order"]}
                onClick={openPurchased}
              >
                Закуплен
              </button>
            )}
            {(UserData.userData.position === "Администратор" ||
              UserData.userData.position === "Создатель") && (
              <button
                className={styles["nav__list-item-order"]}
                onClick={openInRussia}
              >
                На складе в РФ
              </button>
            )}
            {(UserData.userData.position === "Администратор" ||
              UserData.userData.position === "Создатель") && (
              <button
                className={styles["nav__list-item-order"]}
                onClick={openSent}
              >
                Доставляется
              </button>
            )}
            {(UserData.userData.position === "Администратор" ||
              UserData.userData.position === "Создатель") && (
              <button
                className={styles["nav__list-item-order"]}
                onClick={openСompleted}
              >
                Завершён
              </button>
            )}
          </div>
        </li>
        {(UserData.userData.position === "Создатель" ||
          UserData.userData.position === "Администратор") && (
          <li onClick={closeBurger} className={styles["nav__list-item"]}>
            <Link
              className={`${styles["nav__list-item-link"]} ${
                router.pathname === "/merged" &&
                styles["nav__list-item-link_active"]
              }`}
              href="/merged"
            >
              Объединить
            </Link>
          </li>
        )}
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
});

export default Burger;
