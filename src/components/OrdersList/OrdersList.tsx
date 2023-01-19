import { useEffect, useState } from "react";
import OrderTable from "../UI/OrderTable/OrderTable";
import styles from "./OrdersList.module.css";
import UserData from "../../store/user";
import { ADMIN, BUYER, SUPERADMIN } from "../../utils/constants";

const OrdersList = () => {
  const [ordersStatus, setOrdersStatus] = useState<string>("Черновик");

  function openDraft() {
    setOrdersStatus("Черновик");
  }

  function openPaymentVerification() {
    setOrdersStatus("Проверка оплаты");
  }

  function openAwaitingPurchase() {
    setOrdersStatus("Ожидает закупки");
  }

  function openOnPurchase() {
    setOrdersStatus("На закупке");
  }

  function openPurchased() {
    setOrdersStatus("Закуплен");
  }

  function openDeliveredToRussia() {
    setOrdersStatus("Доставка в Москву");
  }

  function openInRussia() {
    setOrdersStatus("На складе в РФ");
  }

  function openSent() {
    setOrdersStatus("Доставляется");
  }

  function openСompleted() {
    setOrdersStatus("Завершён");
  }

  useEffect(() => {
    if (UserData.userData.position) {
      if (UserData.userData.position === BUYER) {
        setOrdersStatus("Ожидает закупки");
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
                ordersStatus === "Черновик" &&
                styles["orders-list__navigation-text_active"]
              }`}
            >
              Черновик
            </p>
          </li>
        )}
        {UserData.userData.position !== BUYER && (
          <li
            onClick={openPaymentVerification}
            className={styles["orders-list__navigation-item"]}
          >
            <p
              className={`${styles["orders-list__navigation-text"]} ${
                ordersStatus === "Проверка оплаты" &&
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
                ordersStatus === "Ожидает закупки" &&
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
                ordersStatus === "На закупке" &&
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
                ordersStatus === "Закуплен" &&
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
                ordersStatus === "На складе в РФ" &&
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
                ordersStatus === "Доставляется" &&
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
                ordersStatus === "Завершён" &&
                styles["orders-list__navigation-text_active"]
              }`}
            >
              Завершён
            </p>
          </li>
        )}
      </ul>
      {ordersStatus === "Черновик" && UserData.userData.position !== BUYER && (
        <OrderTable status={"Черновик"} />
      )}
      {ordersStatus === "Проверка оплаты" &&
        UserData.userData.position !== BUYER && (
          <OrderTable status={"Проверка оплаты"} />
        )}
      {ordersStatus === "Ожидает закупки" &&
        (UserData.userData.position === BUYER ||
          UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN) && (
          <OrderTable status={"Ожидает закупки"} />
        )}
      {ordersStatus === "На закупке" &&
        (UserData.userData.position === BUYER ||
          UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN) && (
          <OrderTable status={"На закупке"} />
        )}
      {ordersStatus === "Закуплен" &&
        (UserData.userData.position === BUYER ||
          UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN) && (
          <OrderTable status={"Закуплен"} />
        )}
      {ordersStatus === "Доставляется в РФ" &&
        (UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN) && (
          <OrderTable status={"Доставляется в РФ"} />
        )}
      {ordersStatus === "Доставка в Москву" &&
        (UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN) && (
          <OrderTable status={"Доставка в Москву"} />
        )}
      {ordersStatus === "На складе в РФ" &&
        (UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN) && (
          <OrderTable status={"На складе в РФ"} />
        )}
      {ordersStatus === "Доставляется" &&
        (UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN) && (
          <OrderTable status={"Доставляется"} />
        )}
      {ordersStatus === "Завершён" &&
        (UserData.userData.position === ADMIN ||
          UserData.userData.position === SUPERADMIN) && (
          <OrderTable status={"Завершён"} />
        )}
    </section>
  );
};

export default OrdersList;
