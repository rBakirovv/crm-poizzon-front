import Link from "next/link";
import { logOut } from "../../../utils/Auth";
import styles from "./Navigation.module.css";
import { useRouter } from "next/router";
import UserData from "../../../store/user";
import Logged from "../../../store/logged";
import OrdersBar from "../../../store/ordersBar";
import { observer } from "mobx-react-lite";

const Navigation = observer(() => {
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
});

export default Navigation;
