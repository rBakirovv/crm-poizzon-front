import OrderTable from "../UI/OrderTable/OrderTable";
import styles from "./OrdersList.module.css";
import UserData from "../../store/user";
import OrderData from "../../store/order";
import OrdersBar from "../../store/ordersBar";
import { observer } from "mobx-react-lite";
import {
  ADMIN,
  BUYER,
  SUPERADMIN,
  MANAGER,
  WAREHOUSEWORKER,
  MAINADMIN,
} from "../../utils/constants";
import { getOrdersTable } from "../../utils/Order";

const OrdersList = observer(() => {
  async function openDraft() {
    sessionStorage.setItem("ordersTablePage", "1");
    await getOrdersTable(0, "Черновик", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Черновик");
  }

  async function openPaymentVerification() {
    sessionStorage.setItem("ordersTablePage", "1");
    await getOrdersTable(0, "Проверка оплаты", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Проверка оплаты");
  }

  async function openAwaitingPurchase() {
    sessionStorage.setItem("ordersTablePage", "1");
    await getOrdersTable(0, "Ожидает закупки", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Ожидает закупки");
  }

  async function openOnPurchase() {
    sessionStorage.setItem("ordersTablePage", "1");
    await getOrdersTable(0, "На закупке", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("На закупке");
  }

  async function openPurchased() {
    sessionStorage.setItem("ordersTablePage", "1");
    await getOrdersTable(0, "Закуплен", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Закуплен");
  }

  async function openWaitingDelivery() {
    sessionStorage.setItem("ordersTablePage", "1");
    await getOrdersTable(0, "Ожидает данные", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Ожидает данные");
  }

  async function openInRussia() {
    sessionStorage.setItem("ordersTablePage", "1");
    await getOrdersTable(0, "На складе в РФ", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("На складе в РФ");
  }

  async function openRecentlyArrived() {
    sessionStorage.setItem("ordersTablePage", "1");
    await getOrdersTable(0, "Недавно прибывшие", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Недавно прибывшие");
  }

  async function openSent() {
    sessionStorage.setItem("ordersTablePage", "1");
    await getOrdersTable(0, "Доставляется", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Доставляется");
  }

  async function openСompleted() {
    sessionStorage.setItem("ordersTablePage", "1");
    await getOrdersTable(0, "Завершён", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Завершён");
  }

  return (
    <section className={styles["orders-list"]}>
      <ul className={styles["orders-list__navigation"]}>
        <li
          onClick={openDraft}
          className={styles["orders-list__navigation-item"]}
        >
          <p
            className={`${styles["orders-list__navigation-text"]} ${
              OrdersBar.orderStatus === "Черновик" &&
              styles["orders-list__navigation-text_active"]
            }`}
          >
            Черновик
          </p>
        </li>
        {UserData.userData.position !== BUYER &&
          UserData.userData.position !== MANAGER &&
          UserData.userData.position !== WAREHOUSEWORKER && (
            <li
              onClick={openPaymentVerification}
              className={styles["orders-list__navigation-item"]}
            >
              <p
                className={`${styles["orders-list__navigation-text"]} ${
                  OrdersBar.orderStatus === "Проверка оплаты" &&
                  styles["orders-list__navigation-text_active"]
                }`}
              >
                Проверка оплаты
              </p>
            </li>
          )}
        {(UserData.userData.position === BUYER ||
          UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN ||
          UserData.userData.position === MAINADMIN) && (
          <li
            onClick={openAwaitingPurchase}
            className={styles["orders-list__navigation-item"]}
          >
            <p
              className={`${styles["orders-list__navigation-text"]} ${
                OrdersBar.orderStatus === "Ожидает закупки" &&
                styles["orders-list__navigation-text_active"]
              }`}
            >
              Ожидает закупки
            </p>
          </li>
        )}
        {(UserData.userData.position === BUYER ||
          UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN ||
          UserData.userData.position === MAINADMIN) && (
          <li
            onClick={openOnPurchase}
            className={styles["orders-list__navigation-item"]}
          >
            <p
              className={`${styles["orders-list__navigation-text"]} ${
                OrdersBar.orderStatus === "На закупке" &&
                styles["orders-list__navigation-text_active"]
              }`}
            >
              На закупке
            </p>
          </li>
        )}
        {(UserData.userData.position === BUYER ||
          UserData.userData.position === WAREHOUSEWORKER ||
          UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN ||
          UserData.userData.position === MAINADMIN) && (
          <li
            onClick={openPurchased}
            className={styles["orders-list__navigation-item"]}
          >
            <p
              className={`${styles["orders-list__navigation-text"]} ${
                OrdersBar.orderStatus === "Закуплен" &&
                styles["orders-list__navigation-text_active"]
              }`}
            >
              Закуплен
            </p>
          </li>
        )}
        {(UserData.userData.position === ADMIN ||
          UserData.userData.position === WAREHOUSEWORKER ||
          UserData.userData.position === SUPERADMIN ||
          UserData.userData.position === MAINADMIN) && (
          <li
            onClick={openWaitingDelivery}
            className={styles["orders-list__navigation-item"]}
          >
            <p
              className={`${styles["orders-list__navigation-text"]} ${
                OrdersBar.orderStatus === "Ожидает данные" &&
                styles["orders-list__navigation-text_active"]
              }`}
            >
              Ожидает данные
            </p>
          </li>
        )}
        {(UserData.userData.position === ADMIN ||
          UserData.userData.position === WAREHOUSEWORKER ||
          UserData.userData.position === SUPERADMIN ||
          UserData.userData.position === MAINADMIN) && (
          <li
            onClick={openInRussia}
            className={styles["orders-list__navigation-item"]}
          >
            <p
              className={`${styles["orders-list__navigation-text"]} ${
                OrdersBar.orderStatus === "На складе в РФ" &&
                styles["orders-list__navigation-text_active"]
              }`}
            >
              На складе в РФ
            </p>
          </li>
        )}
        {(UserData.userData.position === ADMIN ||
          UserData.userData.position === WAREHOUSEWORKER ||
          UserData.userData.position === SUPERADMIN ||
          UserData.userData.position === MAINADMIN) && (
          <li
            onClick={openRecentlyArrived}
            className={styles["orders-list__navigation-item"]}
          >
            <p
              className={`${styles["orders-list__navigation-text"]} ${
                OrdersBar.orderStatus === "Недавно прибывшие" &&
                styles["orders-list__navigation-text_active"]
              }`}
            >
              Недавно прибывшие
            </p>
          </li>
        )}
        {(UserData.userData.position === ADMIN ||
          UserData.userData.position === WAREHOUSEWORKER ||
          UserData.userData.position === SUPERADMIN ||
          UserData.userData.position === MAINADMIN) && (
          <li
            onClick={openSent}
            className={styles["orders-list__navigation-item"]}
          >
            <p
              className={`${styles["orders-list__navigation-text"]} ${
                OrdersBar.orderStatus === "Доставляется" &&
                styles["orders-list__navigation-text_active"]
              }`}
            >
              Доставляется
            </p>
          </li>
        )}
        {(UserData.userData.position === ADMIN ||
          UserData.userData.position === WAREHOUSEWORKER ||
          UserData.userData.position === SUPERADMIN ||
          UserData.userData.position === MAINADMIN) && (
          <li
            onClick={openСompleted}
            className={styles["orders-list__navigation-item"]}
          >
            <p
              className={`${styles["orders-list__navigation-text"]} ${
                OrdersBar.orderStatus === "Завершён" &&
                styles["orders-list__navigation-text_active"]
              }`}
            >
              Завершён
            </p>
          </li>
        )}
      </ul>
      {OrdersBar.orderStatus === "Черновик" && (
        <OrderTable status={"Черновик"} />
      )}
      {OrdersBar.orderStatus === "Проверка оплаты" &&
        UserData.userData.position !== BUYER &&
        UserData.userData.position !== WAREHOUSEWORKER && (
          <OrderTable status={"Проверка оплаты"} />
        )}
      {OrdersBar.orderStatus === "Ожидает закупки" &&
        (UserData.userData.position === BUYER ||
          UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN ||
          UserData.userData.position === MAINADMIN) && (
          <OrderTable status={"Ожидает закупки"} />
        )}
      {OrdersBar.orderStatus === "На закупке" &&
        (UserData.userData.position === BUYER ||
          UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN ||
          UserData.userData.position === MAINADMIN) && (
          <OrderTable status={"На закупке"} />
        )}
      {OrdersBar.orderStatus === "Закуплен" &&
        (UserData.userData.position === BUYER ||
          UserData.userData.position === WAREHOUSEWORKER ||
          UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN ||
          UserData.userData.position === MAINADMIN) && (
          <OrderTable status={"Закуплен"} />
        )}
      {OrdersBar.orderStatus === "Ожидает данные" &&
        (UserData.userData.position === BUYER ||
          UserData.userData.position === WAREHOUSEWORKER ||
          UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN ||
          UserData.userData.position === MAINADMIN) && (
          <OrderTable status={"Ожидает данные"} />
        )}
      {OrdersBar.orderStatus === "На складе в РФ" &&
        (UserData.userData.position === ADMIN ||
          UserData.userData.position === WAREHOUSEWORKER ||
          UserData.userData.position === SUPERADMIN ||
          UserData.userData.position === MAINADMIN) && (
          <OrderTable status={"На складе в РФ"} />
        )}
      {OrdersBar.orderStatus === "Недавно прибывшие" &&
        (UserData.userData.position === ADMIN ||
          UserData.userData.position === WAREHOUSEWORKER ||
          UserData.userData.position === SUPERADMIN ||
          UserData.userData.position === MAINADMIN) && (
          <OrderTable status={"Недавно прибывшие"} />
        )}
      {OrdersBar.orderStatus === "Доставляется" &&
        (UserData.userData.position === ADMIN ||
          UserData.userData.position === WAREHOUSEWORKER ||
          UserData.userData.position === SUPERADMIN ||
          UserData.userData.position === MAINADMIN) && (
          <OrderTable status={"Доставляется"} />
        )}
      {OrdersBar.orderStatus === "Завершён" &&
        (UserData.userData.position === ADMIN ||
          UserData.userData.position === WAREHOUSEWORKER ||
          UserData.userData.position === SUPERADMIN ||
          UserData.userData.position === MAINADMIN) && (
          <OrderTable status={"Завершён"} />
        )}
    </section>
  );
});

export default OrdersList;
