import styles from "./AcceptPayment.module.css";
import OrderData from "../../store/order";
import UserData from "../../store/user";
import { BASE_URL } from "../../utils/constants";
import ImagePopup from "../ImagePopup/ImagePopup";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import { useState } from "react";
import { acceptPayment, orderResume } from "../../utils/Order";

const AcceptPayment = () => {
  const [isImagePaymentPopupOpen, setIsImagePaymentPopupOpen] =
    useState<boolean>(false);

  const [isSubmitPaymentPopupOpen, setIsSubmitPaymentPopupOpen] =
    useState<boolean>(false);

  function openImagePopup() {
    setIsImagePaymentPopupOpen(true);
  }

  function closeImagePopup() {
    setIsImagePaymentPopupOpen(false);
  }

  function openSubmitPopup() {
    setIsSubmitPaymentPopupOpen(true);
  }

  function closeSubmitPopup() {
    setIsSubmitPaymentPopupOpen(false);
  }

  function handlePaymentSubmit() {
    acceptPayment(OrderData.order._id).then((order) => {
      OrderData.setOrder(order);
    });
  }

  function handleResumeSubmit() {
    orderResume(OrderData.order._id).then((order) => {
      OrderData.setOrder(order);
    });
  }

  return (
    <div className={styles["accept-payment"]}>
      <h4>Cпособ оплаты</h4>
      <p className={styles["accept-payment__text"]}>
        {OrderData.order.payment}
      </p>
      {OrderData.order.payProofImages.length !== 0 && (
        <>
          <h4>Подтверждение оплаты</h4>
          <div className={styles["accept-payment__image-container"]}>
            <img
              src={`${BASE_URL}${OrderData.order.payProofImages[0].path}`}
              className={styles["accept-payment__image"]}
              crossOrigin="anonymous"
              onClick={openImagePopup}
            />
          </div>
        </>
      )}
      {OrderData.order.status === "Черновик" &&
        Math.ceil(
          Math.round(
            new Date(OrderData.order.overudeAfter).getTime() -
              new Date(Date.now()).getTime()
          ) / 1000
        ) <= 0 && (
          <>
            <h4>Оплата просрочена</h4>
            <button
              className={styles["accept-payment__resume"]}
              onClick={openSubmitPopup}
            >
              Возобновить
            </button>
          </>
        )}
      {OrderData.order.status === "Проверка оплаты" &&
        UserData.userData.position !== "Менеджер" && (
          <button
            className={styles["accept-payment__submit"]}
            onClick={openSubmitPopup}
          >
            Принять оплату
          </button>
        )}
      {OrderData.order.payProofImages.length !== 0 && (
        <ImagePopup
          isImagePopupOpen={isImagePaymentPopupOpen}
          currentImage={`${BASE_URL}${OrderData.order.payProofImages[0].path}`}
          closePopup={closeImagePopup}
        />
      )}
      {OrderData.order.status === "Проверка оплаты" && (
        <SubmitPopup
          onSubmit={handlePaymentSubmit}
          isSubmitPopup={isSubmitPaymentPopupOpen}
          closeSubmitPopup={closeSubmitPopup}
          submitText="Принять оплату"
        />
      )}
      {OrderData.order.status === "Черновик" && (
        <SubmitPopup
          onSubmit={handleResumeSubmit}
          isSubmitPopup={isSubmitPaymentPopupOpen}
          closeSubmitPopup={closeSubmitPopup}
          submitText="Возобновить оплату заказа"
        />
      )}
    </div>
  );
};

export default AcceptPayment;
