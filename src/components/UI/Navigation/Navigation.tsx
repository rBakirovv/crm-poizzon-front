import Link from "next/link";
import { logOut } from "../../../utils/Auth";
import styles from "./Navigation.module.css";
import { useRouter } from "next/router";
import UserData from "../../../store/user";
import OrderData from "../../../store/order";
import Logged from "../../../store/logged";
import OrdersBar from "../../../store/ordersBar";
import { observer } from "mobx-react-lite";
import { getOrdersTable } from "../../../utils/Order";

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

  async function openDraft() {
    await getOrdersTable(0, "Черновик", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Черновик");
    router.replace("/");
  }

  async function openPaymentVerification() {
    await getOrdersTable(0, "Проверка оплаты", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Проверка оплаты");
    router.replace("/");
  }

  async function openAwaitingPurchase() {
    await getOrdersTable(0, "Ожидает закупки", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Ожидает закупки");
    router.replace("/");
  }

  async function openOnPurchase() {
    await getOrdersTable(0, "На закупке", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("На закупке");
    router.replace("/");
  }

  async function openPurchased() {
    await getOrdersTable(0, "Закуплен", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Закуплен");
    router.replace("/");
  }

  async function openWaitingDelivery() {
    await getOrdersTable(0, "Ожидает данные", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Ожидает данные");
    router.replace("/");
  }

  async function openInRussia() {
    await getOrdersTable(0, "На складе в РФ", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("На складе в РФ");
    router.replace("/");
  }

  async function openRecentlyArrived() {
    await getOrdersTable(0, "Недавно прибывшие", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Недавно прибывшие");
  }

  async function openSent() {
    await getOrdersTable(0, "Доставляется", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Доставляется");
    await router.replace("/");
  }

  async function openСompleted() {
    await getOrdersTable(0, "Завершён", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Завершён");
    await router.replace("/");
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
            <button
              className={styles["nav__list-item-order"]}
              onClick={openDraft}
            >
              Черновик
            </button>
            {UserData.userData.position !== "Байер" &&
              UserData.userData.position !== "Менеджер" &&
              UserData.userData.position !== "Работник склада" && (
                <button
                  className={styles["nav__list-item-order"]}
                  onClick={openPaymentVerification}
                >
                  Проверка оплаты
                </button>
              )}
            {UserData.userData.position !== "Менеджер" &&
              UserData.userData.position !== "Работник склада" && (
                <button
                  className={styles["nav__list-item-order"]}
                  onClick={openAwaitingPurchase}
                >
                  Ожидает закупки
                </button>
              )}
            {UserData.userData.position !== "Менеджер" &&
              UserData.userData.position !== "Работник склада" && (
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
            {UserData.userData.position !== "Менеджер" &&
              UserData.userData.position !== "Байер" && (
                <button
                  className={`${styles["nav__list-item-order"]}`}
                  onClick={openWaitingDelivery}
                >
                  Ожидает данные
                </button>
              )}
            {(UserData.userData.position === "Администратор" ||
              UserData.userData.position === "Создатель" ||
              UserData.userData.position === "Работник склада") && (
              <button
                className={styles["nav__list-item-order"]}
                onClick={openInRussia}
              >
                На складе в РФ
              </button>
            )}
            {(UserData.userData.position === "Администратор" ||
              UserData.userData.position === "Создатель" ||
              UserData.userData.position === "Работник склада") && (
              <button
                className={styles["nav__list-item-order"]}
                onClick={openRecentlyArrived}
              >
                Недавно прибывшие
              </button>
            )}
            {(UserData.userData.position === "Администратор" ||
              UserData.userData.position === "Создатель" ||
              UserData.userData.position === "Работник склада") && (
              <button
                className={styles["nav__list-item-order"]}
                onClick={openSent}
              >
                Доставляется
              </button>
            )}
            {(UserData.userData.position === "Администратор" ||
              UserData.userData.position === "Создатель" ||
              UserData.userData.position === "Работник склада") && (
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
          <li className={styles["nav__list-item"]}>
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
          <li className={styles["nav__list-item"]}>
            <Link
              className={`${styles["nav__list-item-link"]} ${
                router.pathname === "/rate" &&
                styles["nav__list-item-link_active"]
              }`}
              href="/rate"
            >
              Курс/Комиссия
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
        {UserData.userData.position !== "Байер" &&
          UserData.userData.position !== "Работник склада" && (
            <li className={styles["nav__list-item"]}>
              <Link
                className={`${styles["nav__list-item-link"]} ${
                  router.pathname === "/cards" &&
                  styles["nav__list-item-link_active"]
                }`}
                href="/cards"
              >
                Статистика карт
              </Link>
            </li>
          )}
        {(UserData.userData.position === "Создатель" ||
          UserData.userData.position === "Администратор") && (
          <li className={styles["nav__list-item"]}>
            <Link
              className={`${styles["nav__list-item-link"]} ${
                router.pathname === "/supply" &&
                styles["nav__list-item-link_active"]
              }`}
              href="/supply"
            >
              Поставка
            </Link>
          </li>
        )}
        <li
          onClick={() => {
            handleLogOut();
          }}
          className={`${styles["nav__list-item"]} ${styles["nav__list-item_exit"]}`}
        >
          Выход из аккаунта
        </li>
      </ul>
    </nav>
  );
});

export default Navigation;
