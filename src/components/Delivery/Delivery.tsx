import styles from "./Delivery.module.css";
import OrderData from "../../store/order";
import UserData from "../../store/user";
import TextInput from "../UI/TextInput/TextInput";
import React, { useState } from "react";
import {
  deliveryToMoscow,
  inStockInRussia,
  orderSent,
  orderСompleted,
} from "../../utils/Order";
import SubmitPopup from "../SubmitPopup/SubmitPopup";

const Delivery = () => {
  const [data, setData] = useState({
    delivery_code: "",
  });

  const [isSubmitPopup, setIsSubmitPopup] = useState(false);

  function openSubmitPopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsSubmitPopup(true);
  }

  function closeSubmitPopup() {
    setIsSubmitPopup(false);
  }

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: value,
    });
  }

  function handleDeliveryToMoscow() {
    deliveryToMoscow(OrderData.order._id).then((order) => {
      OrderData.setOrder(order);
    });
  }

  function handleInStockInRussia() {
    inStockInRussia(OrderData.order._id, UserData.userData.name).then(
      (order) => {
        OrderData.setOrder(order);
      }
    );
  }

  function handleOrderSent() {
    orderSent(OrderData.order._id).then((order) => {
      OrderData.setOrder(order);
    });
  }

  function handleOrderСompleted() {
    orderСompleted(OrderData.order._id).then((order) => {
      OrderData.setOrder(order);
    });
  }

  return (
    <section className={styles["delivery"]}>
      <div className={styles["delivery__container"]}>
        <h2 className={styles["delivery-title"]}>Доставка</h2>
        {OrderData.order.comment !== "" && (
          <>
            <h4>Комментарий</h4>
            <p className={styles["delivery-span"]}>{OrderData.order.comment}</p>
          </>
        )}
        {OrderData.order.poizonCode !== "" && (
          <>
            <h4>Номер Poizon</h4>
            <p>{OrderData.order.poizonCode}</p>
          </>
        )}
        {OrderData.order.deliveryCode !== "" && (
          <>
            <h4>Номер CDEK</h4>
            <p>{OrderData.order.deliveryCode}</p>
          </>
        )}
        <h4>Cпособ доставки</h4>
        <p>{OrderData.order.deliveryMethod}</p>
        <h4>Адрес доставки</h4>
        <p>{OrderData.order.deliveryAddress}</p>
        <h4>ФИО получателя</h4>
        <p>{OrderData.order.deliveryNameRecipient}</p>
        <h4>Номер телефона получателя</h4>
        <p>{OrderData.order.deliveryPhoneRecipient}</p>
        {OrderData.order.status === "На складе в РФ" &&
          (UserData.userData.position === "Администратор" ||
            UserData.userData.position === "Создатель") && (
            <form
              onSubmit={openSubmitPopup}
              className={styles["delivery-form"]}
            >
              <h2 className={styles["delivery-title"]}>Управление доставкой</h2>
              <TextInput
                label="Трек-номер CDEK"
                name="delivery_code"
                value={data.delivery_code}
                required={true}
                handleChange={handleChange}
              />
              <button
                className={styles["delivery__subit-button"]}
                type="submit"
              >
                Отправлено
              </button>
            </form>
          )}
        {OrderData.order.status === "Закуплен" &&
          (UserData.userData.position === "Администратор" ||
            UserData.userData.position === "Создатель") && (
            <button
              onClick={openSubmitPopup}
              className={styles["delivery__subit-button"]}
              type="button"
            >
              На складе в РФ
            </button>
          )}
        {OrderData.order.status === "Доставляется" &&
          (UserData.userData.position === "Администратор" ||
            UserData.userData.position === "Создатель") && (
            <button
              onClick={openSubmitPopup}
              className={styles["delivery__subit-button"]}
              type="button"
            >
              Завершён
            </button>
          )}
      </div>
      {OrderData.order.status === "Закуплен" && (
        <SubmitPopup
          isSubmitPopup={isSubmitPopup}
          submitText="Изменить статус на На складе в РФ"
          onSubmit={handleInStockInRussia}
          closeSubmitPopup={closeSubmitPopup}
        />
      )}
      {OrderData.order.status === "На складе в РФ" && (
        <SubmitPopup
          isSubmitPopup={isSubmitPopup}
          submitText="Изменить статус на Доставляется"
          onSubmit={handleOrderSent}
          closeSubmitPopup={closeSubmitPopup}
        />
      )}
      {OrderData.order.status === "Доставляется" && (
        <SubmitPopup
          isSubmitPopup={isSubmitPopup}
          submitText="Изменить статус на Завершён"
          onSubmit={handleOrderСompleted}
          closeSubmitPopup={closeSubmitPopup}
        />
      )}
    </section>
  );
};

export default Delivery;
