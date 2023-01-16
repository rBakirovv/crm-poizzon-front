import { useState } from "react";
import OrderTable from "../UI/OrderTable/OrderTable";
import styles from "./OrdersList.module.css";

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

  function openPurchased() {
    setOrdersStatus("Закуплен");
  }

  function openInChina() {
    setOrdersStatus("На складе в Китае");
  }

  function openInRussia() {
    setOrdersStatus("На складе в РФ");
  }

  function openSent() {
    setOrdersStatus("Доставляется клиенту");
  }

  function openСompleted() {
    setOrdersStatus("Завершён");
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
              ordersStatus === "Черновик" &&
              styles["orders-list__navigation-text_active"]
            }`}
          >
            Черновик
          </p>
        </li>
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
        <li
          onClick={openInChina}
          className={styles["orders-list__navigation-item"]}
        >
          <p
            className={`${styles["orders-list__navigation-text"]} ${
              ordersStatus === "На складе в Китае" &&
              styles["orders-list__navigation-text_active"]
            }`}
          >
            На складе в Китае
          </p>
        </li>
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
        <li
          onClick={openSent}
          className={styles["orders-list__navigation-item"]}
        >
          <p
            className={`${styles["orders-list__navigation-text"]} ${
              ordersStatus === "Доставляется клиенту" &&
              styles["orders-list__navigation-text_active"]
            }`}
          >
            Доставляется клиенту
          </p>
        </li>
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
      </ul>
      {ordersStatus === "Черновик" && <OrderTable status={"Черновик"} />}
      {ordersStatus === "Проверка оплаты" && <OrderTable status={"Проверка оплаты"} />}
      {ordersStatus === "Ожидает закупки" && <OrderTable status={"Ожидает закупки"} />}
    </section>
  );
};

export default OrdersList;
