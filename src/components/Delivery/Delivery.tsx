import styles from "./Delivery.module.css";
import OrderData from "../../store/order";
import UserData from "../../store/user";
import TextInput from "../UI/TextInput/TextInput";
import React, { useState } from "react";
import {
  inStockInRussia,
  orderSent,
  orderСompleted,
  updateDeliveryAddress,
  deliveryAuthorization,
  createDeliveryDocument,
  getDeliveryDocument,
} from "../../utils/Order";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import Preloader from "../UI/Preloader/Preloader";

const Delivery = () => {
  const [data, setData] = useState({
    delivery_code: OrderData.order.deliveryCode,
    delivery_address: OrderData.order.deliveryAddress,
  });

  const [isSubmitPopup, setIsSubmitPopup] = useState(false);
  const [isSubmitChangePopup, setIsSubmitChangePopup] = useState(false);
  const [isSubmitChangeAddressPopup, setIsSubmitChangeAddressPopup] =
    useState(false);

  const [isChangeAddress, setIsChangeAddress] = useState(false);

  const [isPreloader, setIsPreloader] = useState(false);

  function openSubmitPopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsSubmitPopup(true);
  }

  function closeSubmitPopup() {
    setIsSubmitPopup(false);
  }

  function openSubmitChangePopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsSubmitChangePopup(true);
  }

  function closeSubmitChangePopup() {
    setIsSubmitChangePopup(false);
  }

  function openSubmitChangeAddressPopup() {
    setIsSubmitChangeAddressPopup(true);
  }

  function closeSubmitChangeAddressPopup() {
    setIsSubmitChangeAddressPopup(false);
  }

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: value,
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
    orderSent(OrderData.order._id, data.delivery_code).then((order) => {
      OrderData.setOrder(order);
    });
  }

  function handleOrderСompleted() {
    orderСompleted(OrderData.order._id).then((order) => {
      OrderData.setOrder(order);
    });
  }

  function copyNumberId() {
    navigator.clipboard.writeText(OrderData.order._id);
  }

  function copyNumberPoizon() {
    navigator.clipboard.writeText(OrderData.order.poizonCode);
  }

  function copyNumberCDEK() {
    navigator.clipboard.writeText(OrderData.order.deliveryCode);
  }

  function handleChangeAddress() {
    setIsChangeAddress(true);
  }

  function copyTelegram() {
    navigator.clipboard.writeText(OrderData.order.deliveryPhone!);
  }

  function handleUpdateDeliveryAddress() {
    updateDeliveryAddress(OrderData.order._id, data.delivery_address)
      .then((order) => {
        OrderData.setOrder(order);
      })
      .then(() => {
        setIsChangeAddress(false);
      });
  }

  function openPDFHandler() {
    deliveryAuthorization()
      .then((authData) => {
        createDeliveryDocument(authData.token, OrderData.order.deliveryEntity)
          .then((deliveryDocument) => {
            setIsPreloader(true);
            setTimeout(() => {
              getDeliveryDocument(authData.token, deliveryDocument.entity.uuid)
                .then((pdfData) => {
                  setIsPreloader(false);
                  openPDF(pdfData.pdf);
                })
                .catch((err) => {
                  setIsPreloader(false);
                  console.log(err);
                });
            }, 5000);
          })
          .catch((err) => {
            setIsPreloader(false);
            console.log(err);
          });
      })
      .catch((err) => {
        setIsPreloader(false);
        console.log(err);
      });
  }

  function openPDF(pdfInBase64: string) {
    var URL = window.URL || window.webkitURL,
      byteChars = atob(pdfInBase64),
      bytes = [],
      i = 0;

    for (; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);

    var blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });

    var downloadUrl = URL.createObjectURL(blob);

    var newWin = window.open(
      downloadUrl,
      "_blank",
      "width=500,height=300,menubar=yes,scrollbars=yes,status=yes,resizable=yes"
    );

    URL.revokeObjectURL(downloadUrl);
  }

  return (
    <section className={styles["delivery"]}>
      {isPreloader && <Preloader />}
      <div className={styles["delivery__container"]}>
        <h2 className={styles["delivery-title"]}>Доставка</h2>
        {OrderData.order.comment !== "" && (
          <>
            <h4>Комментарий</h4>
            <p className={styles["delivery-span"]}>{OrderData.order.comment}</p>
          </>
        )}
        {OrderData.order._id !== "" && (
          <>
            <h4>Внутренний номер заказа</h4>
            <p className={styles["delivery-copy"]} onClick={copyNumberId}>
              {OrderData.order._id}{" "}
              <svg
                x="0px"
                y="0px"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                focusable="false"
                fill="currentColor"
              >
                <path d="M3.9,12c0-1.7,1.4-3.1,3.1-3.1h4V7H7c-2.8,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.3,15.1,3.9,13.7,3.9,12z M8,13h8v-2H8V13zM17,7h-4v1.9h4c1.7,0,3.1,1.4,3.1,3.1s-1.4,3.1-3.1,3.1h-4V17h4c2.8,0,5-2.2,5-5S19.8,7,17,7z"></path>
              </svg>
            </p>
          </>
        )}
        {OrderData.order.poizonCode !== "" && (
          <>
            <h4>Номер Poizon</h4>
            <p className={styles["delivery-copy"]} onClick={copyNumberPoizon}>
              {OrderData.order.poizonCode}{" "}
              <svg
                x="0px"
                y="0px"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                focusable="false"
                fill="currentColor"
              >
                <path d="M3.9,12c0-1.7,1.4-3.1,3.1-3.1h4V7H7c-2.8,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.3,15.1,3.9,13.7,3.9,12z M8,13h8v-2H8V13zM17,7h-4v1.9h4c1.7,0,3.1,1.4,3.1,3.1s-1.4,3.1-3.1,3.1h-4V17h4c2.8,0,5-2.2,5-5S19.8,7,17,7z"></path>
              </svg>
            </p>
          </>
        )}
        {OrderData.order.deliveryCode !== "" && (
          <>
            <h4>Номер CDEK</h4>
            <p className={styles["delivery-copy"]} onClick={copyNumberCDEK}>
              {OrderData.order.deliveryCode}{" "}
              <svg
                x="0px"
                y="0px"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                focusable="false"
                fill="currentColor"
              >
                <path d="M3.9,12c0-1.7,1.4-3.1,3.1-3.1h4V7H7c-2.8,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.3,15.1,3.9,13.7,3.9,12z M8,13h8v-2H8V13zM17,7h-4v1.9h4c1.7,0,3.1,1.4,3.1,3.1s-1.4,3.1-3.1,3.1h-4V17h4c2.8,0,5-2.2,5-5S19.8,7,17,7z"></path>
              </svg>
            </p>
          </>
        )}
        <h4>Cпособ доставки</h4>
        <p>{OrderData.order.deliveryMethod}</p>
        <h4>Адрес доставки</h4>
        {OrderData.order.deliveryAddress !== "" && (
          <div className={styles["delivery__adress-input-container"]}>
            {!isChangeAddress && <p>{OrderData.order.deliveryAddress}</p>}
            {isChangeAddress && (
              <input
                className={styles["delivery__adress-input"]}
                type="text"
                name="delivery_address"
                value={data.delivery_address}
                onChange={handleChange}
                readOnly={!isChangeAddress}
              />
            )}
            {!isChangeAddress && (
              <button
                className={styles["delivery__adress-change"]}
                onClick={handleChangeAddress}
              >
                {"Изм."}
              </button>
            )}
            {isChangeAddress && (
              <button
                className={styles["delivery__adress-change"]}
                onClick={openSubmitChangeAddressPopup}
              >
                {"Сохр."}
              </button>
            )}
          </div>
        )}
        <h4>ФИО получателя</h4>
        <p>{OrderData.order.deliveryNameRecipient}</p>
        <h4>Номер телефона получателя</h4>
        <p className={styles["delivery-copy"]} onClick={copyTelegram}>
          {OrderData.order.deliveryPhone}
        </p>
        {OrderData.order.deliveryAddress !== "" &&
          OrderData.order.deliveryEntity !== "" && (
            <button
              onClick={openPDFHandler}
              disabled={isPreloader}
              className={styles["delivery-receipt"]}
            >
              Получить квитанцию
              <svg
                width="18px"
                height="18px"
                viewBox="0 0 48 48"
                focusable="false"
                fill="black"
              >
                <path fill="none" d="M0 0h48v48H0V0z"></path>
                <path d="M40 24l-2.82-2.82L26 32.34V8h-4v24.34L10.84 21.16 8 24l16 16 16-16z"></path>
              </svg>
            </button>
          )}
        {(UserData.userData.position === "Администратор" ||
          UserData.userData.position === "Создатель") && (
          <form
            onSubmit={openSubmitChangePopup}
            className={styles["delivery-form"]}
          >
            <h2 className={styles["delivery-title"]}>Управление доставкой</h2>
            <TextInput
              label="Трек-номер CDEK"
              name="delivery_code"
              value={data.delivery_code}
              required={false}
              handleChange={handleChange}
            />
            <button className={styles["delivery__submit-button"]} type="submit">
              {OrderData.order.status === "На складе в РФ"
                ? "Отправлено"
                : "Сохранить CDEK"}
            </button>
          </form>
        )}
        {OrderData.order.status === "Закуплен" &&
          (UserData.userData.position === "Администратор" ||
            UserData.userData.position === "Создатель") && (
            <button
              onClick={openSubmitPopup}
              className={`${styles["delivery__submit-button"]} ${styles["delivery__submit-button_status"]}`}
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
              className={styles["delivery__submit-button"]}
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
      <SubmitPopup
        isSubmitPopup={isSubmitChangePopup}
        submitText="Сохранить код или изменить статус на Доставляется"
        onSubmit={handleOrderSent}
        closeSubmitPopup={closeSubmitChangePopup}
      />
      <SubmitPopup
        isSubmitPopup={isSubmitChangeAddressPopup}
        submitText="Изменить адрес доставки"
        onSubmit={handleUpdateDeliveryAddress}
        closeSubmitPopup={closeSubmitChangeAddressPopup}
      />
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
