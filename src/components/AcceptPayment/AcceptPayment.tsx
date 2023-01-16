import styles from "./AcceptPayment.module.css";
import OrderData from "../../store/order";
import { BASE_URL } from "../../utils/constants";
import ImagePopup from "../ImagePopup/ImagePopup";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import { useState } from "react";
import { acceptPayment } from "../../utils/Order";

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

  return (
    <div className={styles["accept-payment"]}>
      <h4>Cпособ оплаты</h4>
      <p>{OrderData.order.payment}</p>
      <h4>Подтверждение оплаты</h4>
      {OrderData.order.payProofImages.length !== 0 && (
        <div className={styles["accept-payment__image-container"]}>
          <img
            src={`${BASE_URL}${OrderData.order.payProofImages[0].path}`}
            className={styles["accept-payment__image"]}
            crossOrigin="anonymous"
            onClick={openImagePopup}
          />
        </div>
      )}
      {OrderData.order.status === "Проверка оплаты" && (
        <button
          className={styles["accept-payment__submit"]}
          onClick={openSubmitPopup}
        >
          Принять оплату
        </button>
      )}
      <ImagePopup
        isImagePopupOpen={isImagePaymentPopupOpen}
        currentImage={`${BASE_URL}${OrderData.order.payProofImages[0].path}`}
        closePopup={closeImagePopup}
      />
      <SubmitPopup
        onSubmit={handlePaymentSubmit}
        isSubmitPopup={isSubmitPaymentPopupOpen}
        closeSubmitPopup={closeSubmitPopup}
        submitText="Принять оплату"
      />
    </div>
  );
};

export default AcceptPayment;
