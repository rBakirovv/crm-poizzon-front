import styles from "./AcceptPayment.module.css";
import OrderData from "../../store/order";
import UserData from "../../store/user";
import { BASE_URL, BASE_URL_FRONT, EXPRESS_PRICE } from "../../utils/constants";
import ImagePopup from "../ImagePopup/ImagePopup";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import { useState } from "react";
import {
  acceptPayment,
  acceptPaymentSplit,
  acceptPaymentSplitSecond,
  addPayLink,
  addPayLinkExpress,
  addPayLinkSplit,
  addPayLinkSplitExpress,
  addPayLinkSplitSecond,
  addPayLinkSplitSecondExpress,
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

  const [isSubmitPayLinkExpressPopup, setIsSubmitPayLinkExpressPopup] =
    useState<boolean>(false);
  const [
    isSubmitPayLinkSplitExpressPopup,
    setIsSubmitPayLinkSplitExpressPopup,
  ] = useState<boolean>(false);
  const [
    isSubmitPayLinkSplitSecondExpressPopup,
    setIsSubmitPayLinkSplitSecondExpressPopup,
  ] = useState<boolean>(false);

  const [isSubmitAcceptPaymentPopup, setIsSubmitAcceptPaymentPopup] =
    useState<boolean>(false);
  const [isSubmitAcceptSplitPopup, setIsSubmitAcceptSplitPopup] =
    useState<boolean>(false);
  const [isSubmitAcceptSplitSecondPopup, setIsSubmitAcceptSplitSecondPopup] =
    useState<boolean>(false);

  const [isPayLinks, setIsPayLinks] = useState(false);
  const [isPayLinksSplit, setIsPayLinksSplit] = useState(false);
  const [isPayLinksSplitSecond, setIsPayLinksSplitSecond] = useState(false);

  const [isPayLinksExpress, setIsPayLinksExpress] = useState(false);
  const [isPayLinksSplitExpress, setIsPayLinksSplitExpress] = useState(false);
  const [isPayLinksSplitSecondExpress, setIsPayLinksSplitSecondExpress] =
    useState(false);

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

  const totalPriceExpress = Math.ceil(
    priceRub +
      parseFloat(OrderData.order.priceDeliveryChina) +
      parseFloat(OrderData.order.priceDeliveryRussia) +
      parseFloat(OrderData.order.commission) -
      OrderData.order.promoCodePercent +
      EXPRESS_PRICE
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

  function openSubmitPayLinkExpressPopup() {
    setIsSubmitPayLinkExpressPopup(true);
  }

  function closeSubmitPayLinkExpressPopup() {
    setIsSubmitPayLinkExpressPopup(false);
  }

  function openSubmitPayLinkSplitExpressPopup() {
    setIsSubmitPayLinkSplitExpressPopup(true);
  }

  function closeSubmitPayLinkSplitExpressPopup() {
    setIsSubmitPayLinkSplitExpressPopup(false);
  }

  function openSubmitPayLinkSplitSecondExpressPopup() {
    setIsSubmitPayLinkSplitSecondExpressPopup(true);
  }

  function closeSubmitPayLinkSplitSecondExpressPopup() {
    setIsSubmitPayLinkSplitSecondExpressPopup(false);
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

  function openPayLinks() {
    setIsPayLinks(!isPayLinks);
  }

  function openPayLinksSplit() {
    setIsPayLinksSplit(!isPayLinksSplit);
  }

  function openPayLinksSplitSecond() {
    setIsPayLinksSplitSecond(!isPayLinksSplitSecond);
  }

  function openPayLinksExpress() {
    setIsPayLinksExpress(!isPayLinksExpress);
  }

  function openPayLinksSplitExpress() {
    setIsPayLinksSplitExpress(!isPayLinksSplitExpress);
  }

  function openPayLinksSplitSecondExpress() {
    setIsPayLinksSplitSecondExpress(!isPayLinksSplitSecondExpress);
  }

  function handlePayLinkSubmit() {
    createPayLink(
      OrderData.order._id,
      `${OrderData.order.orderId.toString()}-full-${Math.ceil(
        Math.random() * 1000
      )}`,
      totalPrice,
      `${BASE_URL_FRONT}/order/${OrderData.order._id}`
    ).then((payment) => {
      if (payment.success === true) {
        updateOrderDraft(
          OrderData.order._id,
          OrderData.order.link,
          payment.data.url,
          payment.data.custom_order_id,
          OrderData.order.payLinkSplit,
          OrderData.order.paymentUUIDSplit,
          OrderData.order.payLinkSplitSecond,
          OrderData.order.paymentUUIDSplitSecond,
          OrderData.order.payLinkExpress,
          OrderData.order.paymentUUIDExpress,
          OrderData.order.payLinkSplitExpress,
          OrderData.order.paymentUUIDSplitExpress,
          OrderData.order.payLinkSplitSecondExpress,
          OrderData.order.paymentUUIDSplitSecondExpress,
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
        ).then(() => {
          addPayLink(OrderData.order._id, payment.data.url).then((order) => {
            OrderData.setOrder(order);
          });
        });
      }
    });
  }

  function handlePayLinkSplitSubmit() {
    createPayLink(
      OrderData.order._id,
      `${OrderData.order.orderId.toString()}-split-${Math.ceil(
        Math.random() * 1000
      )}`,
      Math.ceil(totalPrice / 2),
      `${BASE_URL_FRONT}/order/${OrderData.order._id}`
    ).then((payment) => {
      if (payment.success === true) {
        updateOrderDraft(
          OrderData.order._id,
          OrderData.order.link,
          OrderData.order.payLink,
          OrderData.order.paymentUUID,
          payment.data.url,
          payment.data.custom_order_id,
          OrderData.order.payLinkSplitSecond,
          OrderData.order.paymentUUIDSplitSecond,
          OrderData.order.payLinkExpress,
          OrderData.order.paymentUUIDExpress,
          OrderData.order.payLinkSplitExpress,
          OrderData.order.paymentUUIDSplitExpress,
          OrderData.order.payLinkSplitSecondExpress,
          OrderData.order.paymentUUIDSplitSecondExpress,
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
            OrderData.order._id,
            `${OrderData.order.orderId.toString()}-split-second-${Math.ceil(
              Math.random() * 1000
            )}`,
            Math.ceil(totalPrice / 2),
            `${BASE_URL_FRONT}/order/${OrderData.order._id}`
          ).then((paymentSecond) => {
            if (paymentSecond.success === true) {
              updateOrderDraft(
                OrderData.order._id,
                OrderData.order.link,
                OrderData.order.payLink,
                OrderData.order.paymentUUID,
                orderUpdated.payLinkSplit,
                orderUpdated.paymentUUIDSplit,
                paymentSecond.data.url,
                paymentSecond.data.custom_order_id,
                OrderData.order.payLinkExpress,
                OrderData.order.paymentUUIDExpress,
                OrderData.order.payLinkSplitExpress,
                OrderData.order.paymentUUIDSplitExpress,
                OrderData.order.payLinkSplitSecondExpress,
                OrderData.order.paymentUUIDSplitSecondExpress,
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
              )
                .then(() => {
                  addPayLinkSplit(OrderData.order._id, payment.data.url);
                })
                .then(() => {
                  addPayLinkSplitSecond(
                    OrderData.order._id,
                    paymentSecond.data.url
                  ).then((orderUpdatedSecond) => {
                    OrderData.setOrder(orderUpdatedSecond);
                  });
                });
            }
          });
        });
      }
    });
  }

  function handlePayLinkSplitSecondSubmit() {
    createPayLink(
      OrderData.order._id,
      `${OrderData.order.orderId.toString()}-split-second-${Math.ceil(
        Math.random() * 1000
      )}`,
      Math.ceil(totalPrice / 2),
      `${BASE_URL_FRONT}/order/${OrderData.order._id}`
    ).then((payment) => {
      if (payment.success === true) {
        updateOrderDraft(
          OrderData.order._id,
          OrderData.order.link,
          OrderData.order.payLink,
          OrderData.order.paymentUUID,
          OrderData.order.payLinkSplit,
          OrderData.order.paymentUUIDSplit,
          payment.data.url,
          payment.data.custom_order_id,
          OrderData.order.payLinkExpress,
          OrderData.order.paymentUUIDExpress,
          OrderData.order.payLinkSplitExpress,
          OrderData.order.paymentUUIDSplitExpress,
          OrderData.order.payLinkSplitSecondExpress,
          OrderData.order.paymentUUIDSplitSecondExpress,
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
        ).then(() => {
          addPayLinkSplitSecond(OrderData.order._id, payment.data.url).then(
            (order) => {
              OrderData.setOrder(order);
            }
          );
        });
      }
    });
  }

  function handlePayLinkExpressSubmit() {
    createPayLink(
      OrderData.order._id,
      `${OrderData.order.orderId.toString()}-express-${Math.ceil(
        Math.random() * 1000
      )}`,
      totalPriceExpress,
      `${BASE_URL_FRONT}/order/${OrderData.order._id}`
    ).then((payment) => {
      if (payment.success === true) {
        updateOrderDraft(
          OrderData.order._id,
          OrderData.order.link,
          OrderData.order.payLink,
          OrderData.order.paymentUUID,
          OrderData.order.payLinkSplit,
          OrderData.order.paymentUUIDSplit,
          OrderData.order.payLinkSplitSecond,
          OrderData.order.paymentUUIDSplitSecond,
          payment.data.url,
          payment.data.custom_order_id,
          OrderData.order.payLinkSplitExpress,
          OrderData.order.paymentUUIDSplitExpress,
          OrderData.order.payLinkSplitSecondExpress,
          OrderData.order.paymentUUIDSplitSecondExpress,
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
        ).then(() => {
          addPayLinkExpress(OrderData.order._id, payment.data.url).then(
            (order) => {
              OrderData.setOrder(order);
            }
          );
        });
      }
    });
  }

  function handlePayLinkSplitExpressSubmit() {
    createPayLink(
      OrderData.order._id,
      `${OrderData.order.orderId.toString()}-split-express-${Math.ceil(
        Math.random() * 1000
      )}`,
      Math.ceil(totalPriceExpress / 2),
      `${BASE_URL_FRONT}/order/${OrderData.order._id}`
    ).then((payment) => {
      if (payment.success === true) {
        updateOrderDraft(
          OrderData.order._id,
          OrderData.order.link,
          OrderData.order.payLink,
          OrderData.order.paymentUUID,
          OrderData.order.payLinkSplit,
          OrderData.order.paymentUUIDSplit,
          OrderData.order.payLinkSplitSecond,
          OrderData.order.paymentUUIDSplitSecond,
          OrderData.order.payLinkExpress,
          OrderData.order.paymentUUIDExpress,
          payment.data.url,
          payment.data.custom_order_id,
          OrderData.order.payLinkSplitSecondExpress,
          OrderData.order.paymentUUIDSplitSecondExpress,
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
            OrderData.order._id,
            `${OrderData.order.orderId.toString()}-split-express-second-${Math.ceil(
              Math.random() * 1000
            )}`,
            Math.ceil(totalPriceExpress / 2),
            `${BASE_URL_FRONT}/order/${OrderData.order._id}`
          ).then((paymentSecond) => {
            if (paymentSecond.success === true) {
              updateOrderDraft(
                OrderData.order._id,
                OrderData.order.link,
                OrderData.order.payLink,
                OrderData.order.paymentUUID,
                OrderData.order.payLinkSplit,
                OrderData.order.paymentUUIDSplit,
                OrderData.order.payLinkSplitSecond,
                OrderData.order.paymentUUIDSplitSecond,
                OrderData.order.payLinkExpress,
                OrderData.order.paymentUUIDExpress,
                orderUpdated.payLinkSplitExpress,
                orderUpdated.paymentUUIDSplitExpress,
                paymentSecond.data.url,
                paymentSecond.data.custom_order_id,
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
              ).then(() => {
                addPayLinkSplitExpress(
                  OrderData.order._id,
                  payment.data.url
                ).then(() => {
                  addPayLinkSplitSecondExpress(
                    OrderData.order._id,
                    paymentSecond.data.url
                  ).then((order) => {
                    OrderData.setOrder(order);
                  });
                });
              });
            }
          });
        });
      }
    });
  }

  function handlePayLinkSplitSecondExpressSubmit() {
    createPayLink(
      OrderData.order._id,
      `${OrderData.order.orderId.toString()}-split-express-second-${Math.ceil(
        Math.random() * 1000
      )}`,
      Math.ceil(totalPriceExpress / 2),
      `${BASE_URL_FRONT}/order/${OrderData.order._id}`
    ).then((payment) => {
      if (payment.success === true) {
        updateOrderDraft(
          OrderData.order._id,
          OrderData.order.link,
          OrderData.order.payLink,
          OrderData.order.paymentUUID,
          OrderData.order.payLinkSplit,
          OrderData.order.paymentUUIDSplit,
          OrderData.order.payLinkSplitSecond,
          OrderData.order.paymentUUIDSplitSecond,
          OrderData.order.payLinkExpress,
          OrderData.order.paymentUUIDExpress,
          OrderData.order.payLinkSplitExpress,
          OrderData.order.paymentUUIDSplitExpress,
          payment.data.url,
          payment.data.custom_order_id,
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
        ).then(() => {
          addPayLinkSplitSecondExpress(
            OrderData.order._id,
            payment.data.url
          ).then((order) => {
            OrderData.setOrder(order);
          });
        });
      }
    });
  }

  return (
    <div className={styles["accept-payment"]}>
      <h4>Cпособ оплаты</h4>
      <p className={styles["accept-payment__text"]}>
        {OrderData.order.payment}
        {OrderData.order.payment === "Сплит -" &&
          !OrderData.order.isSplit &&
          " полная оплата"}
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
        (OrderData.order.payment === "Перейти по ссылке -" ||
          OrderData.order.payment === "Сплит -") && (
          <>
            <button
              className={styles["accept-payment__resume"]}
              onClick={openSubmitPayLinkExpressPopup}
            >
              Обновить ссылку на оплату (экспресс)
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
        OrderData.order.payment === "Сплит -" &&
        OrderData.order.isSplit && (
          <>
            <button
              className={styles["accept-payment__resume"]}
              onClick={openSubmitPayLinkSplitSecondPopup}
            >
              Обновить ссылку на оплату (сплит)
            </button>
          </>
        )}
      {OrderData.order.status === "Черновик" &&
        !OrderData.order.isSplitPaid &&
        OrderData.order.payment === "Сплит -" && (
          <>
            <button
              className={styles["accept-payment__resume"]}
              onClick={openSubmitPayLinkSplitExpressPopup}
            >
              Обновить ссылку на оплату (экспресс & сплит)
            </button>
          </>
        )}
      {OrderData.order.status !== "Черновик" &&
        !OrderData.order.isSplitPaidSecond &&
        OrderData.order.payment === "Сплит -" &&
        OrderData.order.isSplit && (
          <>
            <button
              className={styles["accept-payment__resume"]}
              onClick={openSubmitPayLinkSplitSecondExpressPopup}
            >
              Обновить ссылку на оплату (экспресс & сплит)
            </button>
          </>
        )}
      {OrderData.order.payLinksArray &&
        OrderData.order.payLinksArray.length > 0 && (
          <div>
            <h4
              className={styles["accept-payment__links-title"]}
              onClick={openPayLinks}
            >
              Ссылки оплаты
            </h4>
            <div
              className={`${styles["accept-payment__links"]} ${
                isPayLinks && styles["accept-payment__links_active"]
              }`}
            >
              {OrderData.order.payLinksArray.map((link) => {
                return (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className={styles["accept-payment__text"]}
                  >
                    {link}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      {OrderData.order.splitLinksArray &&
        OrderData.order.splitLinksArray.length > 0 && (
          <div>
            <h4
              className={styles["accept-payment__links-title"]}
              onClick={openPayLinksSplit}
            >
              Ссылки оплаты (сплит)
            </h4>
            <div
              className={`${styles["accept-payment__links"]} ${
                isPayLinksSplit && styles["accept-payment__links_active"]
              }`}
            >
              {OrderData.order.splitLinksArray.map((link) => {
                return (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className={styles["accept-payment__text"]}
                  >
                    {link}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      {OrderData.order.splitSecondLinksArray &&
        OrderData.order.splitSecondLinksArray.length > 0 && (
          <div>
            <h4
              className={styles["accept-payment__links-title"]}
              onClick={openPayLinksSplitSecond}
            >
              Ссылки оплаты (сплит вторая часть)
            </h4>
            <div
              className={`${styles["accept-payment__links"]} ${
                isPayLinksSplitSecond && styles["accept-payment__links_active"]
              }`}
            >
              {OrderData.order.splitSecondLinksArray.map((link) => {
                return (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className={styles["accept-payment__text"]}
                  >
                    {link}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      {OrderData.order.payLinksExpressArray &&
        OrderData.order.payLinksExpressArray.length > 0 && (
          <div>
            <h4
              className={styles["accept-payment__links-title"]}
              onClick={openPayLinksExpress}
            >
              Ссылки оплаты (экспресс)
            </h4>
            <div
              className={`${styles["accept-payment__links"]} ${
                isPayLinksExpress && styles["accept-payment__links_active"]
              }`}
            >
              {OrderData.order.payLinksExpressArray.map((link) => {
                return (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className={styles["accept-payment__text"]}
                  >
                    {link}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      {OrderData.order.splitLinksExpressArray &&
        OrderData.order.splitLinksExpressArray.length > 0 && (
          <div>
            <h4
              className={styles["accept-payment__links-title"]}
              onClick={openPayLinksSplitExpress}
            >
              Ссылки оплаты (экспресс & сплит)
            </h4>
            <div
              className={`${styles["accept-payment__links"]} ${
                isPayLinksSplitExpress && styles["accept-payment__links_active"]
              }`}
            >
              {OrderData.order.splitLinksExpressArray.map((link) => {
                return (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className={styles["accept-payment__text"]}
                  >
                    {link}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      {OrderData.order.splitSecondLinksExpressArray &&
        OrderData.order.splitSecondLinksExpressArray.length > 0 && (
          <div>
            <h4
              className={styles["accept-payment__links-title"]}
              onClick={openPayLinksSplitSecondExpress}
            >
              Ссылки оплаты (экспресс & сплит вторая часть)
            </h4>
            <div
              className={`${styles["accept-payment__links"]} ${
                isPayLinksSplitSecondExpress &&
                styles["accept-payment__links_active"]
              }`}
            >
              {OrderData.order.splitSecondLinksExpressArray.map((link) => {
                return (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className={styles["accept-payment__text"]}
                  >
                    {link}
                  </a>
                );
              })}
            </div>
          </div>
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
          (UserData.userData.position === "Создатель" ||
            UserData.userData.position === "Главный администратор") && (
            <button
              className={styles["accept-payment__submit"]}
              onClick={openSubmitAcceptPaymentPopup}
            >
              Принять оплату досрочно
            </button>
          )}
        {OrderData.order.status === "Черновик" &&
          OrderData.order.payment === "Сплит -" &&
          (UserData.userData.position === "Создатель" ||
            UserData.userData.position === "Главный администратор") &&
          !OrderData.order.isSplit && (
            <button
              className={styles["accept-payment__submit"]}
              onClick={openSubmitAcceptPaymentPopup}
            >
              Принять оплату досрочно
            </button>
          )}
        {OrderData.order.status === "Черновик" &&
          OrderData.order.payment === "Сплит -" &&
          (UserData.userData.position === "Создатель" ||
            UserData.userData.position === "Главный администратор") &&
          !OrderData.order.isSplitPaid &&
          OrderData.order.isSplit && (
            <button
              className={styles["accept-payment__submit"]}
              onClick={openSubmitAcceptSplitPopup}
            >
              Принять сплит (1) досрочно
            </button>
          )}
        {OrderData.order.status !== "Черновик" &&
          OrderData.order.payment === "Сплит -" &&
          (UserData.userData.position === "Создатель" ||
            UserData.userData.position === "Главный администратор") &&
          !OrderData.order.isSplitPaidSecond &&
          OrderData.order.isSplit && (
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
        onSubmit={handlePayLinkExpressSubmit}
        isSubmitPopup={isSubmitPayLinkExpressPopup}
        closeSubmitPopup={closeSubmitPayLinkExpressPopup}
        submitText="Сгенерировать новую ссылку на оплату (экспресс)"
      />
      <SubmitPopup
        onSubmit={handlePayLinkSplitExpressSubmit}
        isSubmitPopup={isSubmitPayLinkSplitExpressPopup}
        closeSubmitPopup={closeSubmitPayLinkSplitExpressPopup}
        submitText="Сгенерировать новую ссылку на оплату (экспресс & сплит)"
      />
      <SubmitPopup
        onSubmit={handlePayLinkSplitSecondExpressSubmit}
        isSubmitPopup={isSubmitPayLinkSplitSecondExpressPopup}
        closeSubmitPopup={closeSubmitPayLinkSplitSecondExpressPopup}
        submitText="Сгенерировать новую ссылку на оплату (экспресс & вторая часть)"
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
