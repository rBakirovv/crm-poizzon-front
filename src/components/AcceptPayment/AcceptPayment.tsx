import styles from "./AcceptPayment.module.css";
import OrderData from "../../store/order";
import UserData from "../../store/user";
import { BASE_URL, BASE_URL_FRONT } from "../../utils/constants";
import ImagePopup from "../ImagePopup/ImagePopup";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import { useState } from "react";
import {
  acceptPayment,
  acceptPaymentSplit,
  acceptPaymentSplitSecond,
  orderResume,
  updateOrderDraft,
} from "../../utils/Order";
import { createPayLink } from "../../utils/PaySystem";

const AcceptPayment = () => {
  const [isImagePaymentPopupOpen, setIsImagePaymentPopupOpen] =
    useState<boolean>(false);

  const [isSubmitPaymentPopupOpen, setIsSubmitPaymentPopupOpen] =
    useState<boolean>(false);

  const [isSubmitPayLinkPopup, setIsSubmitPayLinkPopup] =
    useState<boolean>(false);

  const [isSubmitPayLinkSplitPopup, setIsSubmitPayLinkSplitPopup] =
    useState<boolean>(false);

  const [isSubmitPayLinkSplitSecondPopup, setIsSubmitPayLinkSplitSecondPopup] =
    useState<boolean>(false);
  const [isSubmitAcceptPaymentPopup, setIsSubmitAcceptPaymentPopup] =
    useState<boolean>(false);
  const [isSubmitAcceptSplitPopup, setIsSubmitAcceptSplitPopup] =
    useState<boolean>(false);
  const [isSubmitAcceptSplitSecondPopup, setIsSubmitAcceptSplitSecondPopup] =
    useState<boolean>(false);

  const priceRub = Math.ceil(
    parseFloat(OrderData.order.priceCNY) *
      parseFloat(OrderData.order.currentRate)
  );

  const totalPrice = Math.ceil(
    priceRub +
      parseFloat(OrderData.order.priceDeliveryChina) +
      parseFloat(OrderData.order.priceDeliveryRussia) +
      parseFloat(OrderData.order.commission) -
      OrderData.order.promoCodePercent
  );

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

  function openSubmitPayLinkPopup() {
    setIsSubmitPayLinkPopup(true);
  }

  function closeSubmitPayLinkPopup() {
    setIsSubmitPayLinkPopup(false);
  }

  function openSubmitPayLinkSplitPopup() {
    setIsSubmitPayLinkSplitPopup(true);
  }

  function closeSubmitPayLinkSplitPopup() {
    setIsSubmitPayLinkSplitPopup(false);
  }

  function openSubmitPayLinkSplitSecondPopup() {
    setIsSubmitPayLinkSplitSecondPopup(true);
  }

  function closeSubmitPayLinkSplitSecondPopup() {
    setIsSubmitPayLinkSplitSecondPopup(false);
  }

  function openSubmitAcceptPaymentPopup() {
    setIsSubmitAcceptPaymentPopup(true);
  }

  function closeSubmitAcceptPaymentPopup() {
    setIsSubmitAcceptPaymentPopup(false);
  }

  function openSubmitAcceptSplitPopup() {
    setIsSubmitAcceptSplitPopup(true);
  }

  function closeSubmitAcceptSplitPopup() {
    setIsSubmitAcceptSplitPopup(false);
  }

  function openSubmitAcceptSplitSecondPopup() {
    setIsSubmitAcceptSplitSecondPopup(true);
  }

  function closeSubmitAcceptSplitSecondPopup() {
    setIsSubmitAcceptSplitSecondPopup(false);
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

  function handleAccept() {
    acceptPayment(OrderData.order._id).then((order) => {
      OrderData.setOrder(order);
    });
  }

  function handleSplitAccept() {
    acceptPaymentSplit(OrderData.order._id).then((order) => {
      OrderData.setOrder(order);
    });
  }

  function handleSplitSecondAccept() {
    acceptPaymentSplitSecond(OrderData.order._id).then((order) => {
      OrderData.setOrder(order);
    });
  }

  function handlePayLinkSubmit() {
    createPayLink(
      OrderData.order.orderId.toString(),
      totalPrice,
      `${BASE_URL_FRONT}/order/${OrderData.order._id}`,
      `${BASE_URL}/pay/link/${OrderData.order._id}`
    ).then((payment) => {
      if (payment.data.id) {
        updateOrderDraft(
          OrderData.order._id,
          OrderData.order.link,
          payment.data.attributes.url,
          payment.data.attributes.uuid,
          OrderData.order.payLinkSplit,
          OrderData.order.paymentUUIDSplit,
          OrderData.order.payLinkSplitSecond,
          OrderData.order.paymentUUIDSplitSecond,
          OrderData.order.category,
          OrderData.order.subcategory,
          OrderData.order.brand,
          OrderData.order.model,
          OrderData.order.size,
          OrderData.order.payment,
          OrderData.order.priceCNY,
          OrderData.order.priceDeliveryChina,
          OrderData.order.priceDeliveryRussia,
          OrderData.order.commission,
          OrderData.order.promoCodePercent,
          OrderData.order.comment
        ).then((order) => {
          OrderData.setOrder(order);
        });
      }
    });
  }

  function handlePayLinkSplitSubmit() {
    createPayLink(
      OrderData.order.orderId.toString(),
      Math.ceil(totalPrice / 2),
      `${BASE_URL_FRONT}/order/${OrderData.order._id}`,
      `${BASE_URL}/pay/link/${OrderData.order._id}`
    ).then((payment) => {
      if (payment.data.id) {
        updateOrderDraft(
          OrderData.order._id,
          OrderData.order.link,
          OrderData.order.payLink,
          OrderData.order.paymentUUID,
          payment.data.attributes.url,
          payment.data.attributes.uuid,
          OrderData.order.payLinkSplitSecond,
          OrderData.order.paymentUUIDSplitSecond,
          OrderData.order.category,
          OrderData.order.subcategory,
          OrderData.order.brand,
          OrderData.order.model,
          OrderData.order.size,
          OrderData.order.payment,
          OrderData.order.priceCNY,
          OrderData.order.priceDeliveryChina,
          OrderData.order.priceDeliveryRussia,
          OrderData.order.commission,
          OrderData.order.promoCodePercent,
          OrderData.order.comment
        ).then((orderUpdated) => {
          createPayLink(
            OrderData.order.orderId.toString(),
            Math.ceil(totalPrice / 2),
            `${BASE_URL_FRONT}/order/${OrderData.order._id}`,
            `${BASE_URL}/pay/link/${OrderData.order._id}`
          ).then((paymentSecond) => {
            if (payment.data.id) {
              updateOrderDraft(
                OrderData.order._id,
                OrderData.order.link,
                OrderData.order.payLink,
                OrderData.order.paymentUUID,
                orderUpdated.payLinkSplit,
                orderUpdated.paymentUUIDSplit,
                paymentSecond.data.attributes.url,
                paymentSecond.data.attributes.uuid,
                OrderData.order.category,
                OrderData.order.subcategory,
                OrderData.order.brand,
                OrderData.order.model,
                OrderData.order.size,
                OrderData.order.payment,
                OrderData.order.priceCNY,
                OrderData.order.priceDeliveryChina,
                OrderData.order.priceDeliveryRussia,
                OrderData.order.commission,
                OrderData.order.promoCodePercent,
                OrderData.order.comment
              ).then((orderUpdatedSecond) => {
                OrderData.setOrder(orderUpdatedSecond);
              });
            }
          });
        });
      }
    });
  }

  function handlePayLinkSplitSecondSubmit() {
    createPayLink(
      OrderData.order.orderId.toString(),
      Math.ceil(totalPrice / 2),
      `${BASE_URL_FRONT}/order/${OrderData.order._id}`,
      `${BASE_URL}/pay/link/${OrderData.order._id}`
    ).then((payment) => {
      if (payment.data.id) {
        updateOrderDraft(
          OrderData.order._id,
          OrderData.order.link,
          OrderData.order.payLink,
          OrderData.order.paymentUUID,
          OrderData.order.payLinkSplit,
          OrderData.order.paymentUUIDSplit,
          payment.data.attributes.url,
          payment.data.attributes.uuid,
          OrderData.order.category,
          OrderData.order.subcategory,
          OrderData.order.brand,
          OrderData.order.model,
          OrderData.order.size,
          OrderData.order.payment,
          OrderData.order.priceCNY,
          OrderData.order.priceDeliveryChina,
          OrderData.order.priceDeliveryRussia,
          OrderData.order.commission,
          OrderData.order.promoCodePercent,
          OrderData.order.comment
        ).then((order) => {
          OrderData.setOrder(order);
        });
      }
    });
  }

  return (
    <div className={styles["accept-payment"]}>
      <h4>Cпособ оплаты</h4>
      <p className={styles["accept-payment__text"]}>
        {OrderData.order.payment}
        {OrderData.order.payment === "Сплит -" && !OrderData.order.isSplit && " полная оплата"}
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
      {OrderData.order.status === "Черновик" &&
        (OrderData.order.payment === "Перейти по ссылке -" ||
          OrderData.order.payment === "Сплит -") && (
          <>
            <button
              className={styles["accept-payment__resume"]}
              onClick={openSubmitPayLinkPopup}
            >
              Обновить ссылку на оплату
            </button>
          </>
        )}
      {OrderData.order.status === "Черновик" &&
        !OrderData.order.isSplitPaid &&
        OrderData.order.payment === "Сплит -" && (
          <>
            <button
              className={styles["accept-payment__resume"]}
              onClick={openSubmitPayLinkSplitPopup}
            >
              Обновить ссылку на оплату (сплит)
            </button>
          </>
        )}
      {OrderData.order.status !== "Черновик" &&
        !OrderData.order.isSplitPaidSecond &&
        OrderData.order.payment === "Сплит -" && OrderData.order.isSplit && (
          <>
            <button
              className={styles["accept-payment__resume"]}
              onClick={openSubmitPayLinkSplitSecondPopup}
            >
              Обновить ссылку на оплату (сплит)
            </button>
          </>
        )}
      <div className={styles["accept-payment__buttons"]}>
        {OrderData.order.status === "Проверка оплаты" &&
          UserData.userData.position !== "Менеджер" && (
            <button
              className={styles["accept-payment__submit"]}
              onClick={openSubmitPopup}
            >
              Принять оплату
            </button>
          )}
        {OrderData.order.status === "Черновик" &&
          OrderData.order.payment === "Перейти по ссылке -" &&
          UserData.userData.position === "Создатель" && (
            <button
              className={styles["accept-payment__submit"]}
              onClick={openSubmitAcceptPaymentPopup}
            >
              Принять оплату досрочно
            </button>
          )}
        {OrderData.order.status === "Черновик" &&
          OrderData.order.payment === "Сплит -" &&
          UserData.userData.position === "Создатель" &&
          !OrderData.order.isSplitPaid && (
            <button
              className={styles["accept-payment__submit"]}
              onClick={openSubmitAcceptSplitPopup}
            >
              Принять сплит (1) досрочно
            </button>
          )}
        {OrderData.order.status !== "Черновик" &&
          OrderData.order.payment === "Сплит -" &&
          UserData.userData.position === "Создатель" &&
          !OrderData.order.isSplitPaidSecond && OrderData.order.isSplit && (
            <button
              className={styles["accept-payment__submit"]}
              onClick={openSubmitAcceptSplitSecondPopup}
            >
              Принять сплит (2) досрочно
            </button>
          )}
      </div>
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
      <SubmitPopup
        onSubmit={handlePayLinkSubmit}
        isSubmitPopup={isSubmitPayLinkPopup}
        closeSubmitPopup={closeSubmitPayLinkPopup}
        submitText="Сгенерировать новую ссылку на оплату"
      />
      <SubmitPopup
        onSubmit={handlePayLinkSplitSubmit}
        isSubmitPopup={isSubmitPayLinkSplitPopup}
        closeSubmitPopup={closeSubmitPayLinkSplitPopup}
        submitText="Сгенерировать новую ссылку на оплату (сплит)"
      />
      <SubmitPopup
        onSubmit={handlePayLinkSplitSecondSubmit}
        isSubmitPopup={isSubmitPayLinkSplitSecondPopup}
        closeSubmitPopup={closeSubmitPayLinkSplitSecondPopup}
        submitText="Сгенерировать новую ссылку на оплату (вторая часть)"
      />
      <SubmitPopup
        onSubmit={handleAccept}
        isSubmitPopup={isSubmitAcceptPaymentPopup}
        closeSubmitPopup={closeSubmitAcceptPaymentPopup}
        submitText="Принять оплату досрочно"
      />
      <SubmitPopup
        onSubmit={handleSplitAccept}
        isSubmitPopup={isSubmitAcceptSplitPopup}
        closeSubmitPopup={closeSubmitAcceptSplitPopup}
        submitText="Принять сплит (1) досрочно"
      />
      <SubmitPopup
        onSubmit={handleSplitSecondAccept}
        isSubmitPopup={isSubmitAcceptSplitSecondPopup}
        closeSubmitPopup={closeSubmitAcceptSplitSecondPopup}
        submitText="Принять сплит (2) досрочно"
      />
    </div>
  );
};

export default AcceptPayment;
