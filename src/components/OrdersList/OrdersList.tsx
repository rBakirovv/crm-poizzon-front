import { useEffect } from "react";
import OrderTable from "../UI/OrderTable/OrderTable";
import styles from "./OrdersList.module.css";
import UserData from "../../store/user";
import OrdersBar from "../../store/ordersBar";
import { observer } from "mobx-react-lite";
import { ADMIN, BUYER, SUPERADMIN, MANAGER } from "../../utils/constants";

const OrdersList = observer(() => {
  function openDraft() {
    OrdersBar.setNewStatus("Черновик");
  }

  function openPaymentVerification() {
    OrdersBar.setNewStatus("Проверка оплаты");
  }

  function openAwaitingPurchase() {
    OrdersBar.setNewStatus("Ожидает закупки");
  }

  function openOnPurchase() {
    OrdersBar.setNewStatus("На закупке");
  }

  function openPurchased() {
    OrdersBar.setNewStatus("Закуплен");
  }

  function openInRussia() {
    OrdersBar.setNewStatus("На складе в РФ");
  }

  function openSent() {
    OrdersBar.setNewStatus("Доставляется");
  }

  function openСompleted() {
    OrdersBar.setNewStatus("Завершён");
  }

  useEffect(() => {
    if (UserData.userData.position) {
      if (UserData.userData.position === BUYER) {
        OrdersBar.setNewStatus("Ожидает закупки");
      }
    }
  }, [UserData.userData.position]);

  return (
    <section className={styles["orders-list"]}>
      <ul className={styles["orders-list__navigation"]}>
        {UserData.userData.position !== BUYER && (
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
        )}
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
      {OrdersBar.orderStatus === "Черновик" &&
        UserData.userData.position !== BUYER && (
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
      {OrdersBar.orderStatus === "Доставляется в РФ" &&
        (UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN) && (
          <OrderTable status={"Доставляется в РФ"} />
        )}
      {OrdersBar.orderStatus === "Доставка в Москву" &&
        (UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN) && (
          <OrderTable status={"Доставка в Москву"} />
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
