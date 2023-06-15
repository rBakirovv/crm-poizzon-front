import OrderTable from "../UI/OrderTable/OrderTable";
import styles from "./OrdersList.module.css";
import UserData from "../../store/user";
import OrderData from "../../store/order";
import OrdersBar from "../../store/ordersBar";
import { observer } from "mobx-react-lite";
import { ADMIN, BUYER, SUPERADMIN, MANAGER } from "../../utils/constants";
import { getOrdersTable } from "../../utils/Order";

const OrdersList = observer(() => {
  async function openDraft() {
    await getOrdersTable(0, "Черновик", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Черновик");
  }

  async function openPaymentVerification() {
    await getOrdersTable(0, "Проверка оплаты", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Проверка оплаты");
  }

  async function openAwaitingPurchase() {
    await getOrdersTable(0, "Ожидает закупки", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Ожидает закупки");
  }

  async function openOnPurchase() {
    await getOrdersTable(0, "На закупке", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("На закупке");
  }

  async function openPurchased() {
    await getOrdersTable(0, "Закуплен", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Закуплен");
  }

  async function openWaitingDelivery() {
    await getOrdersTable(0, "Ожидает данные", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Ожидает данные");
  }

  async function openInRussia() {
    await getOrdersTable(0, "На складе в РФ", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("На складе в РФ");
  }

  async function openSent() {
    await getOrdersTable(0, "Доставляется", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Доставляется");
  }

  async function openСompleted() {
    await getOrdersTable(0, "Завершён", "", "", "").then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    await OrdersBar.setNewStatus("Завершён");
  }

  return (
    <section className={styles["orders-list"]}>
      <ul className={styles["orders-list__navigation"]}>
        {
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
        }
        {UserData.userData.position !== BUYER &&
          UserData.userData.position !== MANAGER && (
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
          UserData.userData.position === SUPERADMIN) && (
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
          UserData.userData.position === SUPERADMIN) && (
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
          UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN) && (
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
          UserData.userData.position === SUPERADMIN) && (
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
          UserData.userData.position === SUPERADMIN) && (
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
          UserData.userData.position === SUPERADMIN) && (
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
          UserData.userData.position === SUPERADMIN) && (
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
        UserData.userData.position !== BUYER && (
          <OrderTable status={"Проверка оплаты"} />
        )}
      {OrdersBar.orderStatus === "Ожидает закупки" &&
        (UserData.userData.position === BUYER ||
          UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN) && (
          <OrderTable status={"Ожидает закупки"} />
        )}
      {OrdersBar.orderStatus === "На закупке" &&
        (UserData.userData.position === BUYER ||
          UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN) && (
          <OrderTable status={"На закупке"} />
        )}
      {OrdersBar.orderStatus === "Закуплен" &&
        (UserData.userData.position === BUYER ||
          UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN) && (
          <OrderTable status={"Закуплен"} />
        )}
      {OrdersBar.orderStatus === "Ожидает данные" &&
        (UserData.userData.position === BUYER ||
          UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN) && (
          <OrderTable status={"Ожидает данные"} />
        )}
      {OrdersBar.orderStatus === "На складе в РФ" &&
        (UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN) && (
          <OrderTable status={"На складе в РФ"} />
        )}
      {OrdersBar.orderStatus === "Доставляется" &&
        (UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN) && (
          <OrderTable status={"Доставляется"} />
        )}
      {OrdersBar.orderStatus === "Завершён" &&
        (UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN) && (
          <OrderTable status={"Завершён"} />
        )}
    </section>
  );
});

export default OrdersList;
