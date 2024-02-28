import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { IMergedClientOrders, IOrder } from "../../types/interfaces";
import { BASE_URL, BASE_URL_FRONT, EXPRESS_PRICE } from "../../utils/constants";
import Carousel from "../UI/Carousel/Carousel";
import Timer from "../UI/Timer/Timer";
import styles from "./Order.module.css";
import UserDataModal from "../UI/UserDataModal/UserDataModal";
import OverudeOrder from "../UI/OverudeOrder/OverudeOrder";
import {
  addPayLink,
  addPayLinkExpress,
  addPayLinkSplit,
  addPayLinkSplitExpress,
  addPayLinkSplitSecond,
  addPayLinkSplitSecondExpress,
  getPayment,
  setExpressCost,
  updatePayment,
} from "../../utils/Order";
import { createPayLink } from "../../utils/PaySystem";
import PreloaderClient from "../UI/PreloaderClient/PreloaderClient";

interface IOrderProps {
  currentOrder: IOrder;
  mergedData: Array<IMergedClientOrders>;
}

const dayjs = require("dayjs");

var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");
var updateLocale = require("dayjs/plugin/updateLocale");

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Europe/Moscow");

dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  months: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ],
});

const Order: FC<IOrderProps> = ({ currentOrder, mergedData }) => {
  const router = useRouter();

  const [isBrowser, setIsBrowser] = useState<boolean>(false);

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState<boolean>(false);
  const [isPayProofPopupOpen, setIsPayProofPopupOpen] =
    useState<boolean>(false);
  const [isBuyProofPopupOpen, setIsBuyProofPopupOpen] =
    useState<boolean>(false);
  const [isOverudeOrderModalOpen, setIsOverudeOrderModalOpen] =
    useState<boolean>(false);
  const [isReceiptImagesPopupOpen, setIsReceiptImagesPopupOpen] =
    useState<boolean>(false);

  const [timeLeft, setTimeLeft] = useState<number>(
    Math.ceil(
      Math.round(
        new Date(currentOrder.overudeAfter).getTime() -
          new Date(Date.now()).getTime()
      ) / 1000
    )
  );

  const [isSplit, setIsSplit] = useState(currentOrder.isSplit);
  const [isExpress, setIsExpress] = useState(
    currentOrder.expressCost === EXPRESS_PRICE ? true : false
  );

  const [isPreload, setIsPreload] = useState(false);

  const priceRub = Math.ceil(
    parseFloat(currentOrder.priceCNY) * parseFloat(currentOrder.currentRate)
  );

  const totalPrice = Math.ceil(
    priceRub +
      parseFloat(currentOrder.priceDeliveryChina) +
      parseFloat(currentOrder.priceDeliveryRussia) +
      parseFloat(currentOrder.commission) -
      currentOrder.promoCodePercent +
      (isExpress ? EXPRESS_PRICE : 0)
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsBrowser(true);
    }
  });

  function openPopup(index: number) {
    setIsImagePopupOpen(true);
    setCurrentImageIndex(index);
  }

  function closePopup() {
    setIsImagePopupOpen(false);
  }

  function openPayProofPopup(index: number) {
    setIsPayProofPopupOpen(true);
    setCurrentImageIndex(index);
  }

  function closePayProofPopup() {
    setIsPayProofPopupOpen(false);
  }

  function openBuyProofPopup(index: number) {
    setIsBuyProofPopupOpen(true);
    setCurrentImageIndex(index);
  }

  function closeBuyProofPopup() {
    setIsBuyProofPopupOpen(false);
  }

  function openIsReceiptImagesPopup(index: number) {
    setIsReceiptImagesPopupOpen(true);
    setCurrentImageIndex(index);
  }

  function closeIsReceiptImagesPopup() {
    setIsReceiptImagesPopupOpen(false);
  }

  function closeOverudeOrderPopup() {
    setIsOverudeOrderModalOpen(false);
  }

  function nextImage() {
    currentImageIndex === currentOrder.orderImages.length - 1
      ? setCurrentImageIndex(0)
      : setCurrentImageIndex(currentImageIndex + 1);
  }

  function prevImage() {
    currentImageIndex === 0
      ? setCurrentImageIndex(currentOrder.orderImages.length - 1)
      : setCurrentImageIndex(currentImageIndex - 1);
  }

  function handleTimeLeft() {
    if (timeLeft <= 0) {
      setIsOverudeOrderModalOpen(true);
    } else {
      setExpressCost(currentOrder._id, isExpress ? EXPRESS_PRICE : 0).then(() =>
        router.push(`pay/${currentOrder._id}`) 
      );
    }
  }

  function handleIsSplitToggle() {
    setIsSplit(!isSplit);
  }

  function handleIsExpressToggle() {
    setIsExpress(!isExpress);
  }

  function payLinkRedirect() {
    setIsPreload(true);

    getPayment(currentOrder.paymentUUID).then((paymentData) => {
      if (paymentData.data.attributes.payment_status === "cancelled") {
        createPayLink(
          currentOrder.orderId.toString(),
          totalPrice,
          `${BASE_URL_FRONT}/order/${currentOrder._id}`,
          `${BASE_URL}/pay/link/${currentOrder._id}`
        )
          .then((payment) => {
            if (payment.data.id) {
              updatePayment(
                currentOrder._id,
                payment.data.attributes.url,
                payment.data.attributes.uuid,
                currentOrder.payLinkSplit,
                currentOrder.paymentUUIDSplit,
                currentOrder.payLinkSplitSecond,
                currentOrder.paymentUUIDSplitSecond,
                currentOrder.payLinkExpress,
                currentOrder.payLinkSplitExpress,
                currentOrder.payLinkSplitSecondExpress,
                currentOrder.paymentUUIDExpress,
                currentOrder.paymentUUIDSplitExpress,
                currentOrder.paymentUUIDSplitSecondExpress
              )
                .then(() => {
                  addPayLink(currentOrder._id, payment.data.attributes.url);
                })
                .then(() => {
                  setIsPreload(false);
                  router.replace(payment.data.attributes.url);
                })
                .catch(() => {
                  setIsPreload(false);
                });
            }
          })
          .catch(() => {
            setIsPreload(false);
          });
      } else {
        router.replace(currentOrder.payLink);
      }
    });
  }

  function payLinkSplitRedirect() {
    setIsPreload(true);

    getPayment(currentOrder.paymentUUIDSplit).then((paymentData) => {
      if (paymentData.data.attributes.payment_status === "cancelled") {
        createPayLink(
          currentOrder.orderId.toString(),
          Math.ceil(totalPrice / 2),
          `${BASE_URL_FRONT}/order/${currentOrder._id}`,
          `${BASE_URL}/pay/link/${currentOrder._id}`
        )
          .then((payment) => {
            if (payment.data.id) {
              updatePayment(
                currentOrder._id,
                currentOrder.payLink,
                currentOrder.paymentUUID,
                payment.data.attributes.url,
                payment.data.attributes.uuid,
                currentOrder.payLinkSplitSecond,
                currentOrder.paymentUUIDSplitSecond,
                currentOrder.payLinkExpress,
                currentOrder.payLinkSplitExpress,
                currentOrder.payLinkSplitSecondExpress,
                currentOrder.paymentUUIDExpress,
                currentOrder.paymentUUIDSplitExpress,
                currentOrder.paymentUUIDSplitSecondExpress
              )
                .then(() => {
                  addPayLinkSplit(
                    currentOrder._id,
                    payment.data.attributes.url
                  );
                })
                .then(() => {
                  setIsPreload(false);
                  router.replace(payment.data.attributes.url);
                })
                .catch(() => {
                  setIsPreload(false);
                });
            }
          })
          .catch(() => {
            setIsPreload(false);
          });
      } else {
        router.replace(currentOrder.payLinkSplit);
      }
    });
  }

  function payLinkSplitSecondRedirect() {
    setIsPreload(true);

    getPayment(currentOrder.paymentUUIDSplitSecond).then((paymentData) => {
      if (paymentData.data.attributes.payment_status === "cancelled") {
        createPayLink(
          currentOrder.orderId.toString(),
          Math.ceil(totalPrice / 2),
          `${BASE_URL_FRONT}/order/${currentOrder._id}`,
          `${BASE_URL}/pay/link/${currentOrder._id}`
        )
          .then((payment) => {
            if (payment.data.id) {
              updatePayment(
                currentOrder._id,
                currentOrder.payLink,
                currentOrder.paymentUUID,
                currentOrder.payLinkSplit,
                currentOrder.paymentUUIDSplit,
                payment.data.attributes.url,
                payment.data.attributes.uuid,
                currentOrder.payLinkExpress,
                currentOrder.payLinkSplitExpress,
                currentOrder.payLinkSplitSecondExpress,
                currentOrder.paymentUUIDExpress,
                currentOrder.paymentUUIDSplitExpress,
                currentOrder.paymentUUIDSplitSecondExpress
              )
                .then(() => {
                  addPayLinkSplitSecond(
                    currentOrder._id,
                    payment.data.attributes.url
                  );
                })
                .then(() => {
                  setIsPreload(false);
                  router.replace(payment.data.attributes.url);
                })
                .catch(() => {
                  setIsPreload(false);
                });
            }
          })
          .catch(() => {
            setIsPreload(false);
          });
      } else {
        router.replace(currentOrder.payLinkSplitSecond);
      }
    });
  }

  function payLinkExpressRedirect() {
    setIsPreload(true);

    getPayment(currentOrder.paymentUUIDExpress).then((paymentData) => {
      if (paymentData.data.attributes.payment_status === "cancelled") {
        createPayLink(
          currentOrder.orderId.toString(),
          totalPrice,
          `${BASE_URL_FRONT}/order/${currentOrder._id}`,
          `${BASE_URL}/pay/link/${currentOrder._id}`
        )
          .then((payment) => {
            if (payment.data.id) {
              updatePayment(
                currentOrder._id,
                currentOrder.payLink,
                currentOrder.paymentUUID,
                currentOrder.payLinkSplit,
                currentOrder.paymentUUIDSplit,
                currentOrder.payLinkSplitSecond,
                currentOrder.paymentUUIDSplitSecond,
                payment.data.attributes.url,
                currentOrder.payLinkSplitExpress,
                currentOrder.payLinkSplitSecondExpress,
                payment.data.attributes.uuid,
                currentOrder.paymentUUIDSplitExpress,
                currentOrder.paymentUUIDSplitSecondExpress
              )
                .then(() => {
                  addPayLinkExpress(currentOrder._id, payment.data.attributes.url);
                })
                .then(() => {
                  setIsPreload(false);
                  router.replace(payment.data.attributes.url);
                })
                .catch(() => {
                  setIsPreload(false);
                });
            }
          })
          .catch(() => {
            setIsPreload(false);
          });
      } else {
        router.replace(currentOrder.payLinkExpress);
      }
    });
  }

  function payLinkSplitExpressRedirect() {
    setIsPreload(true);

    getPayment(currentOrder.paymentUUIDSplitExpress).then((paymentData) => {
      if (paymentData.data.attributes.payment_status === "cancelled") {
        createPayLink(
          currentOrder.orderId.toString(),
          Math.ceil(totalPrice / 2),
          `${BASE_URL_FRONT}/order/${currentOrder._id}`,
          `${BASE_URL}/pay/link/${currentOrder._id}`
        )
          .then((payment) => {
            if (payment.data.id) {
              updatePayment(
                currentOrder._id,
                currentOrder.payLink,
                currentOrder.paymentUUID,
                currentOrder.payLinkSplit,
                currentOrder.paymentUUIDSplit,
                currentOrder.payLinkSplitSecond,
                currentOrder.paymentUUIDSplitSecond,
                currentOrder.payLinkExpress,
                payment.data.attributes.url,
                currentOrder.payLinkSplitSecondExpress,
                currentOrder.paymentUUIDExpress,
                payment.data.attributes.uuid,
                currentOrder.paymentUUIDSplitSecondExpress
              )
                .then(() => {
                  addPayLinkSplitExpress(
                    currentOrder._id,
                    payment.data.attributes.url
                  );
                })
                .then(() => {
                  setIsPreload(false);
                  router.replace(payment.data.attributes.url);
                })
                .catch(() => {
                  setIsPreload(false);
                });
            }
          })
          .catch(() => {
            setIsPreload(false);
          });
      } else {
        router.replace(currentOrder.payLinkSplitExpress);
      }
    });
  }

  function payLinkSplitExpressSecondRedirect() {
    setIsPreload(true);

    getPayment(currentOrder.paymentUUIDSplitSecondExpress).then(
      (paymentData) => {
        if (paymentData.data.attributes.payment_status === "cancelled") {
          createPayLink(
            currentOrder.orderId.toString(),
            Math.ceil(totalPrice / 2),
            `${BASE_URL_FRONT}/order/${currentOrder._id}`,
            `${BASE_URL}/pay/link/${currentOrder._id}`
          )
            .then((payment) => {
              if (payment.data.id) {
                updatePayment(
                  currentOrder._id,
                  currentOrder.payLink,
                  currentOrder.paymentUUID,
                  currentOrder.payLinkSplit,
                  currentOrder.paymentUUIDSplit,
                  currentOrder.payLinkSplitSecond,
                  currentOrder.paymentUUIDSplitSecond,
                  currentOrder.payLinkExpress,
                  currentOrder.payLinkSplitExpress,
                  payment.data.attributes.url,
                  currentOrder.paymentUUIDExpress,
                  currentOrder.paymentUUIDSplitExpress,
                  payment.data.attributes.uuid
                )
                  .then(() => {
                    addPayLinkSplitSecondExpress(
                      currentOrder._id,
                      payment.data.attributes.url
                    );
                  })
                  .then(() => {
                    setIsPreload(false);
                    router.replace(payment.data.attributes.url);
                  })
                  .catch(() => {
                    setIsPreload(false);
                  });
              }
            })
            .catch(() => {
              setIsPreload(false);
            });
        } else {
          router.replace(currentOrder.payLinkSplitSecondExpress);
        }
      }
    );
  }

  return (
    <section className={styles["order"]}>
      <div className={styles["order__container"]}>
        <div className={styles["order__head-container"]}>
          <div className={styles["order__head-content-container"]}>
            <a
              className={styles["order__social-container"]}
              href="https://t.me/poizonqq"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="31"
                height="31"
                viewBox="0 0 31 31"
                fill="none"
              >
                <circle cx="15.5" cy="15.5" r="15.5" fill="white" />
                <path
                  d="M15.5 5C9.704 5 5 9.704 5 15.5C5 21.296 9.704 26 15.5 26C21.296 26 26 21.296 26 15.5C26 9.704 21.296 5 15.5 5ZM20.372 12.14C20.2145 13.799 19.532 17.831 19.1855 19.6895C19.0385 20.477 18.7445 20.7395 18.4715 20.771C17.8625 20.8235 17.4005 20.372 16.8125 19.9835C15.8885 19.3745 15.3635 18.9965 14.471 18.4085C13.4315 17.726 14.1035 17.348 14.702 16.739C14.8595 16.5815 17.5475 14.135 17.6 13.9145C17.6073 13.8811 17.6063 13.8464 17.5972 13.8135C17.588 13.7806 17.571 13.7504 17.5475 13.7255C17.4845 13.673 17.4005 13.694 17.327 13.7045C17.2325 13.7255 15.7625 14.702 12.896 16.634C12.476 16.9175 12.098 17.0645 11.762 17.054C11.384 17.0435 10.67 16.844 10.1345 16.6655C9.473 16.4555 8.9585 16.34 9.0005 15.9725C9.0215 15.7835 9.284 15.5945 9.7775 15.395C12.8435 14.0615 14.8805 13.1795 15.899 12.7595C18.818 11.5415 19.4165 11.3315 19.8155 11.3315C19.8995 11.3315 20.099 11.3525 20.225 11.4575C20.33 11.5415 20.3615 11.657 20.372 11.741C20.3615 11.804 20.3825 11.993 20.372 12.14Z"
                  fill="url(#paint0_linear_114_104)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_114_104"
                    x1="5"
                    y1="15.5"
                    x2="26"
                    y2="15.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#12C2E9" />
                    <stop offset="0.5" stopColor="#C471ED" />
                    <stop offset="1" stopColor="#F64F59" />
                  </linearGradient>
                </defs>
              </svg>
              <p className={styles["order__social-text"]}>@poizonqq</p>
            </a>
          </div>
        </div>
        <div className={styles["order__images-container"]}>
          <a
            className={styles["order__shoes-poizon-link"]}
            href={currentOrder.link}
            target="_blank"
            rel="noreferrer"
          >
            Открыть в Poizon
            <svg
              width="12"
              height="12"
              viewBox="0 0 20 20"
              fill="#4e7fea"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.4545 1V2.45455H15.5L6.56818 11.3864L7.61364 12.4318L16.5455 3.5V7.54545H18V1.72727V1H17.2727H11.4545ZM2 3.90909V17H15.0909V7.54545L13.6364 9V15.5455H3.45455V5.36364H10L11.4545 3.90909H2Z"
                fill="#4e7fea"
              ></path>
            </svg>
          </a>
          <div className={styles["order__shoes-image-container"]}>
            <div className={styles["order__shoes-image-inner"]}>
              {currentOrder.orderImages.length > 0 && (
                <img
                  className={styles["order__shoes-image"]}
                  src={`${BASE_URL}${currentOrder.orderImages[0].path}`}
                  alt={currentOrder.model}
                  crossOrigin="anonymous"
                  onClick={() => openPopup(0)}
                />
              )}
            </div>
          </div>
          <div className={styles["order__shoes-title-container"]}>
            <h2 className={styles["order__shoes-title"]}>
              {currentOrder.brand} {currentOrder.model}
            </h2>
            <p className={styles["order__shoes-size"]}>
              Размер: {currentOrder.size}
            </p>
          </div>
          {currentOrder.orderImages.length > 1 && (
            <ul className={styles["order__shoes-image-collection"]}>
              {currentOrder.orderImages.length > 1 &&
                currentOrder.orderImages.slice(1).map((image, index) => {
                  return (
                    <li
                      key={image.name}
                      className={styles["order__shoes-image-collection-item"]}
                    >
                      <img
                        src={`${BASE_URL}${image.path}`}
                        crossOrigin="anonymous"
                        onClick={() => openPopup(index + 1)}
                      />
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
        <div className={styles["order__content-container"]}>
          <h2
            className={`${styles["order__title"]} ${
              styles["order__price-title"]
            } ${isSplit && styles["order__price-title_disabled"]}`}
          >
            {totalPrice} ₽
          </h2>
          <div className={styles["order__number-container"]}>
            Заказ № {currentOrder.orderId}
          </div>

          <div className={styles["order__status-box-container"]}>
            <div
              className={`${styles["order__status-box"]} ${
                styles["order__status-box_paid"]
              } ${
                (currentOrder.status === "Ожидает закупки" ||
                  currentOrder.status === "На закупке") &&
                styles["order__status-box_active"]
              }`}
            >
              <span>Оплачен</span>
              <svg
                className={styles["order__status-box-image"]}
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 40 40"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19.9999 5.83337C12.1759 5.83337 5.83325 12.176 5.83325 20C5.83325 27.824 12.1759 34.1667 19.9999 34.1667C27.8239 34.1667 34.1666 27.824 34.1666 20C34.1666 12.176 27.8239 5.83337 19.9999 5.83337ZM3.33325 20C3.33325 10.7953 10.7952 3.33337 19.9999 3.33337C29.2046 3.33337 36.6666 10.7953 36.6666 20C36.6666 29.2047 29.2046 36.6667 19.9999 36.6667C10.7952 36.6667 3.33325 29.2047 3.33325 20ZM25.8838 15.7828C26.3719 16.271 26.3719 17.0624 25.8838 17.5505L19.2171 24.2172C18.7289 24.7054 17.9376 24.7054 17.4494 24.2172L14.116 20.8839C13.6279 20.3957 13.6279 19.6044 14.116 19.1162C14.6042 18.628 15.3957 18.628 15.8838 19.1162L18.3333 21.5655L24.1161 15.7828C24.6043 15.2947 25.3956 15.2947 25.8838 15.7828Z"
                  fill="#3B2746"
                />
              </svg>
            </div>

            <div
              className={`${styles["order__status-box"]} ${
                styles["order__status-box_purchased"]
              } ${
                currentOrder.status === "Закуплен" &&
                Math.ceil(
                  new Date(currentOrder.inChinaStockAt).getTime() -
                    new Date(Date.now()).getTime()
                ) /
                  1000 >=
                  -43200 &&
                currentOrder.inChinaStockAt !== null &&
                styles["order__status-box_active"]
              }`}
            >
              <span>Закуплен</span>
              <svg
                className={styles["order__status-box-image"]}
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 40 40"
                fill="none"
              >
                <path
                  d="M32.4999 9.66667L22.6666 4C20.9999 3 18.9999 3 17.4999 4L7.49992 9.66667C5.83325 10.6667 4.83325 12.3333 4.83325 14.1667V25.6667C4.83325 27.5 5.83325 29.3333 7.49992 30.1667L17.3333 35.8333C18.1666 36.3333 18.9999 36.5 19.9999 36.5C20.9999 36.5 21.8333 36.3333 22.6666 35.8333L32.4999 30.1667C34.1666 29.1667 35.1666 27.5 35.1666 25.6667V14.3333C35.1666 12.5 34.1666 10.6667 32.4999 9.66667ZM18.6666 6.16667C19.1666 6 19.4999 5.83333 19.9999 5.83333C20.4999 5.83333 20.9999 6 21.3333 6.16667L30.8333 11.6667L26.8333 14.1667L16.4999 7.33333L18.6666 6.16667ZM14.1666 8.83333L24.6666 15.6667L19.9999 18.5L8.66658 11.8333L14.1666 8.83333ZM8.66658 28.1667C7.83325 27.6667 7.33325 26.8333 7.33325 25.8333V14.3333C7.33325 14.1667 7.33325 14.1667 7.33325 14L18.6666 20.6667V33.8333C18.6666 33.8333 18.6666 33.8333 18.4999 33.8333L8.66658 28.1667ZM21.3333 33.8333L21.1666 20.6667L25.3333 18V31.3333L21.3333 33.8333ZM32.6666 25.6667C32.6666 26.6667 32.1666 27.5 31.3333 28L27.9999 29.8333V16.5L32.4999 13.6667C32.4999 13.8333 32.6666 14.1667 32.6666 14.3333V25.6667Z"
                  fill="#3B2746"
                />
              </svg>
            </div>

            <div
              className={`${styles["order__status-box"]} ${
                styles["order__status-box_delivery"]
              } ${
                currentOrder.status !== "Завершён" &&
                Math.ceil(
                  new Date(currentOrder.inChinaStockAt).getTime() -
                    new Date(Date.now()).getTime()
                ) /
                  1000 <
                  -43200 &&
                currentOrder.inChinaStockAt !== null &&
                styles["order__status-box_active"]
              } ${
                (currentOrder.status === "На складе в РФ" ||
                  currentOrder.status === "Доставляется") &&
                styles["order__status-box_active"]
              }`}
            >
              <span>В доставке</span>
              <svg
                className={styles["order__status-box-image"]}
                width="60"
                height="60"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_17_1266)">
                  <path
                    d="M30.21 23.7815C27.4298 23.7815 25.168 26.0433 25.168 28.8235C25.168 31.6038 27.4298 33.8656 30.21 33.8656C32.9907 33.8656 35.252 31.6038 35.252 28.8235C35.252 26.0433 32.9902 23.7815 30.21 23.7815ZM30.21 31.3445C28.8197 31.3445 27.689 30.2138 27.689 28.8235C27.689 27.4332 28.8197 26.3025 30.21 26.3025C31.6003 26.3025 32.731 27.4332 32.731 28.8235C32.731 30.2139 31.6003 31.3445 30.21 31.3445Z"
                    fill="#3B2746"
                  />
                  <path
                    d="M12.9832 23.7815C10.203 23.7815 7.94116 26.0433 7.94116 28.8235C7.94116 31.6038 10.203 33.8656 12.9832 33.8656C15.7634 33.8656 18.0252 31.6038 18.0252 28.8235C18.0252 26.0433 15.7634 23.7815 12.9832 23.7815ZM12.9832 31.3445C11.5929 31.3445 10.4622 30.2138 10.4622 28.8235C10.4622 27.4332 11.5929 26.3025 12.9832 26.3025C14.3731 26.3025 15.5042 27.4332 15.5042 28.8235C15.5042 30.2139 14.3735 31.3445 12.9832 31.3445Z"
                    fill="#3B2746"
                  />
                  <path
                    d="M33.6055 9.34966C33.3912 8.92403 32.9555 8.65552 32.479 8.65552H25.8403V11.1765H31.7017L35.134 18.0034L37.387 16.8706L33.6055 9.34966Z"
                    fill="#3B2746"
                  />
                  <path
                    d="M26.4287 27.6051H16.8909V30.1261H26.4287V27.6051Z"
                    fill="#3B2746"
                  />
                  <path
                    d="M9.20169 27.6051H4.832C4.13575 27.6051 3.57153 28.1694 3.57153 28.8656C3.57153 29.5618 4.13583 30.126 4.832 30.126H9.20177C9.89802 30.126 10.4622 29.5617 10.4622 28.8656C10.4622 28.1693 9.89794 27.6051 9.20169 27.6051Z"
                    fill="#3B2746"
                  />
                  <path
                    d="M39.7354 19.8991L37.256 16.7058C37.0178 16.3982 36.6501 16.2184 36.2606 16.2184H27.1009V7.39487C27.1009 6.69862 26.5366 6.1344 25.8404 6.1344H4.832C4.13575 6.1344 3.57153 6.6987 3.57153 7.39487C3.57153 8.09104 4.13583 8.65534 4.832 8.65534H24.5799V17.4789C24.5799 18.1751 25.1442 18.7393 25.8404 18.7393H35.6433L37.479 21.104V27.6049H33.9916C33.2954 27.6049 32.7311 28.1692 32.7311 28.8653C32.7311 29.5616 33.2954 30.1258 33.9916 30.1258H38.7395C39.4358 30.1258 40 29.5615 40 28.8653V20.6722C40 20.3924 39.9068 20.1201 39.7354 19.8991Z"
                    fill="#3B2746"
                  />
                  <path
                    d="M9.11767 21.2185H3.31931C2.62306 21.2185 2.05884 21.7828 2.05884 22.479C2.05884 23.1752 2.62313 23.7394 3.31931 23.7394H9.11759C9.81384 23.7394 10.3781 23.1751 10.3781 22.479C10.3781 21.7828 9.81384 21.2185 9.11767 21.2185Z"
                    fill="#3B2746"
                  />
                  <path
                    d="M12.0168 16.2605H1.26047C0.564297 16.2605 0 16.8248 0 17.521C0 18.2173 0.564297 18.7815 1.26047 18.7815H12.0168C12.713 18.7815 13.2773 18.2172 13.2773 17.521C13.2773 16.8249 12.713 16.2605 12.0168 16.2605Z"
                    fill="#3B2746"
                  />
                  <path
                    d="M14.0756 11.3025H3.31931C2.62306 11.3025 2.05884 11.8668 2.05884 12.563C2.05884 13.2592 2.62313 13.8234 3.31931 13.8234H14.0756C14.7719 13.8234 15.3361 13.2591 15.3361 12.563C15.3362 11.8668 14.7719 11.3025 14.0756 11.3025Z"
                    fill="#3B2746"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_17_1266">
                    <rect width="40" height="40" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>

            <div
              className={`${styles["order__status-box"]} ${
                styles["order__status-box_finish"]
              } ${
                currentOrder.status === "Завершён" &&
                styles["order__status-box_active"]
              }`}
            >
              <span>Завершен</span>
              <svg
                className={styles["order__status-box-image"]}
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 40 40"
                fill="none"
              >
                <g clipPath="url(#clip0_17_1268)">
                  <path
                    d="M34.1699 7.57326L17.5 1.6205V1.24998C17.5 0.559066 16.9409 0 16.25 0C15.5591 0 15 0.559066 15 1.24998C15 1.24998 14.9998 2.57121 15 2.57396V33.75C15 34.4409 15.5591 35 16.25 35C16.9409 35 17.5 34.4409 17.5 33.75V32.5C24.0612 32.5 27.5 34.358 27.5 35C27.5 35.6421 24.0613 37.5 17.5 37.5C10.9386 37.5 7.49996 35.6421 7.49996 35C7.49996 34.5497 9.22694 33.5115 12.5 32.9256V30.3782C8.36788 31.0258 5 32.525 5 35C5 38.435 11.4795 40 17.5 40C23.5204 40 30 38.435 30 35C30 31.5649 23.5204 30 17.5 30V18.2727L34.3091 9.86817C34.757 9.64361 35.028 9.17478 34.9976 8.67436C34.9671 8.175 34.6423 7.74166 34.1699 7.57326ZM17.5 15.4773V4.27396L30.5713 8.9416L17.5 15.4773Z"
                    fill="#3B2746"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_17_1268">
                    <rect width="40" height="40" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          {currentOrder.deliveryAddress !== "" && (
            <div className={styles["order__address"]}>
              Адрес доставки: <br /> {currentOrder.deliveryAddress}
            </div>
          )}
          <div className={styles["order__options-container"]}>
            {currentOrder.payment === "Сплит -" && (
              <div className={styles["order__split-container"]}>
                <div className={styles["checkbox__container"]}>
                  <input
                    className={styles["checkbox__button"]}
                    type="checkbox"
                    disabled={
                      currentOrder.status !== "Черновик" || timeLeft <= 0
                    }
                    checked={isSplit}
                    onChange={handleIsSplitToggle}
                  />
                  <label className={styles["checkbox__title"]}>
                    <strong>Оплатить в сплит</strong>
                  </label>
                </div>
                <div className={styles["order__split-price-container"]}>
                  <div>
                    <span className={styles["order__split-price-title"]}>
                      Сейчас
                    </span>
                    <p
                      className={`${styles["order__split-price"]} ${
                        isSplit && styles["order__split-price_active"]
                      }`}
                    >
                      {Math.ceil(totalPrice / 2)} ₽
                    </p>
                  </div>
                  <div>
                    <span className={styles["order__split-price-title"]}>
                      Через 3 недели
                    </span>
                    <p
                      className={`${styles["order__split-price"]} ${
                        isSplit && styles["order__split-price_active"]
                      }`}
                    >
                      {Math.ceil(totalPrice / 2)} ₽
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className={styles["order__express-container"]}>
              <div className={styles["checkbox__container"]}>
                <input
                  className={styles["checkbox__button"]}
                  type="checkbox"
                  disabled={currentOrder.status !== "Черновик" || timeLeft <= 0}
                  checked={isExpress}
                  onChange={handleIsExpressToggle}
                />
                <label className={styles["checkbox__title"]}>
                  <strong>Экспресс-доставка</strong>{" "}
                  <a
                    className={styles["order__express-link"]}
                    href="https://teletype.in/@stefanboltzman/K_YGAf5f5mI"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="16"
                      height="16"
                      viewBox="0 0 22 22"
                      fill="#4e7fea"
                      style={{ transform: "translateY(3px)" }}
                    >
                      <path d="M 12 2 C 6.4889941 2 2 6.4889982 2 12 C 2 17.511002 6.4889941 22 12 22 C 17.511006 22 22 17.511002 22 12 C 22 6.4889982 17.511006 2 12 2 z M 12 4 C 16.430126 4 20 7.5698765 20 12 C 20 16.430123 16.430126 20 12 20 C 7.5698737 20 4 16.430123 4 12 C 4 7.5698765 7.5698737 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z"></path>
                    </svg>
                  </a>
                </label>
              </div>
              <p className={styles["order__express-text"]}>
                Доставка за 7-10 дней + {EXPRESS_PRICE} ₽
              </p>
            </div>
          </div>
          <ul className={styles["order__status-bar-container"]}>
            {currentOrder.payment !== "Перейти по ссылке -" && (
              <li
                className={`${styles["order__status-bar-item"]} ${
                  currentOrder.status !== "Черновик" &&
                  styles["order__status-bar-item_active"]
                }`}
              >
                Проверка оплаты
              </li>
            )}
            {currentOrder.payProofImages.length > 0 && (
              <div
                className={styles["order-typography-screen-link"]}
                onClick={() => openPayProofPopup(0)}
              >
                Скриншот оплаты
              </div>
            )}
            <li
              className={`${styles["order__status-bar-item"]} ${
                currentOrder.status !== "Черновик" &&
                currentOrder.status !== "Проверка оплаты" &&
                styles["order__status-bar-item_active"]
              }`}
            >
              Оплачен{" "}
              <div className={styles["order__status-bar-dates"]}>
                {currentOrder.status !== "Черновик" &&
                  currentOrder.status !== "Проверка оплаты" && (
                    <span>
                      {currentOrder.paidAt &&
                        dayjs
                          .tz(new Date(currentOrder.paidAt!))
                          .format("DD MMM.")}
                    </span>
                  )}
                {currentOrder.status !== "Черновик" &&
                  currentOrder.status !== "Проверка оплаты" &&
                  currentOrder.payment === "Сплит -" &&
                  currentOrder.isSplitPaid && (
                    <span>
                      Первая часть:{" "}
                      {currentOrder.paidAtSplit &&
                        dayjs
                          .tz(new Date(currentOrder.paidAtSplit!))
                          .format("DD MMM.")}
                    </span>
                  )}
                {currentOrder.status !== "Черновик" &&
                  currentOrder.status !== "Проверка оплаты" &&
                  currentOrder.payment === "Сплит -" &&
                  currentOrder.isSplitPaidSecond && (
                    <span>
                      Вторая часть:{" "}
                      {currentOrder.paidAtSplitSecond &&
                        dayjs
                          .tz(new Date(currentOrder.paidAtSplitSecond!))
                          .format("DD MMM.")}
                    </span>
                  )}
              </div>
            </li>
            <li
              className={`${styles["order__status-bar-item"]} ${
                currentOrder.status !== "Черновик" &&
                currentOrder.status !== "Проверка оплаты" &&
                currentOrder.status !== "Ожидает закупки" &&
                currentOrder.status !== "На закупке" &&
                styles["order__status-bar-item_active"]
              }`}
            >
              Закуплен
              <span>
                {currentOrder.buyAt &&
                  dayjs.tz(new Date(currentOrder.buyAt!)).format("DD MMM.")}
              </span>
            </li>
            {!currentOrder.isPurchaseImagesDisabled &&
              currentOrder.buyProofImages.length > 0 &&
              currentOrder.buyProofImages.map((image, index) => {
                return (
                  <div
                    key={image.name}
                    onClick={() => openBuyProofPopup(index)}
                    className={styles["order-typography-screen-link"]}
                  >
                    Чек закупки №{index + 1}
                  </div>
                );
              })}
            <li
              className={`${styles["order__status-bar-item"]} ${
                (currentOrder.status === "На складе в Китае" ||
                  currentOrder.status === "Доставка в Москву" ||
                  currentOrder.status === "На складе в РФ" ||
                  currentOrder.status === "Доставляется" ||
                  currentOrder.status === "Завершён" ||
                  (Math.ceil(
                    new Date(currentOrder.inChinaStockAt).getTime() -
                      new Date(Date.now()).getTime()
                  ) /
                    1000 <
                    0 &&
                    currentOrder.inChinaStockAt !== null)) &&
                styles["order__status-bar-item_active"]
              }`}
            >
              На складе в Китае
            </li>
            <li
              className={`${styles["order__status-bar-item"]} ${
                (currentOrder.status === "На складе в РФ" ||
                  currentOrder.status === "Доставляется" ||
                  currentOrder.status === "Завершён" ||
                  (Math.ceil(
                    new Date(currentOrder.inChinaStockAt).getTime() -
                      new Date(Date.now()).getTime()
                  ) /
                    1000 <
                    -43200 &&
                    currentOrder.inChinaStockAt !== null)) &&
                styles["order__status-bar-item_active"]
              }`}
            >
              Отправлено в РФ
            </li>
            <li
              className={`${styles["order__status-bar-item"]} ${
                (currentOrder.status === "На складе в РФ" ||
                  currentOrder.status === "Доставляется" ||
                  currentOrder.status === "Завершён") &&
                styles["order__status-bar-item_active"]
              }`}
            >
              Принято в Москве
              <span>
                {currentOrder.inRussiaStockAt &&
                  dayjs
                    .tz(new Date(currentOrder.inRussiaStockAt!))
                    .format("DD MMM.")}
              </span>
            </li>
            {currentOrder.isReceiptImages &&
              currentOrder.receiptImages.length > 0 &&
              currentOrder.receiptImages.map((image, index) => {
                return (
                  <div
                    key={image.name}
                    onClick={() => openIsReceiptImagesPopup(index)}
                    className={styles["order-typography-screen-link"]}
                  >
                    Квитанция
                  </div>
                );
              })}
            <li
              className={`${styles["order__status-bar-item"]} ${
                (currentOrder.status === "Доставляется" ||
                  currentOrder.status === "Завершён") &&
                styles["order__status-bar-item_active"]
              }`}
            >
              Передан в доставку
            </li>
            {currentOrder.deliveryCode !== "" && (
              <a
                href={`https://www.cdek.ru/ru/tracking?order_id=${currentOrder.deliveryCode}`}
                className={styles["order-typography-link"]}
                target="_blank"
                rel="noreferrer"
              >
                Трек-номер CDEK:
                <span
                  className={`${styles["order-span"]} ${styles["order-span-link"]}`}
                >
                  {currentOrder.deliveryCode}
                </span>
              </a>
            )}
            <li
              className={`${styles["order__status-bar-item"]} ${
                currentOrder.status === "Завершён" &&
                styles["order__status-bar-item_active"]
              }`}
            >
              Завершен
              <span>
                {currentOrder.deliveredAt &&
                  dayjs
                    .tz(new Date(currentOrder.deliveredAt!))
                    .format("DD MMM.")}
              </span>
            </li>
          </ul>
          {currentOrder.status === "Черновик" &&
            currentOrder.payment !== "Перейти по ссылке -" &&
            currentOrder.payment !== "Сплит -" && (
              <button
                className={styles["order__pay-button"]}
                onClick={handleTimeLeft}
              >
                {isBrowser && (
                  <Timer
                    createdAt={currentOrder.createdAt}
                    dedline={currentOrder.overudeAfter}
                    timeLeft={timeLeft}
                    setTimeLeft={setTimeLeft}
                  />
                )}
                <span className={styles["order__pay-button-span"]}>
                  Оплатить
                </span>
                <span>{totalPrice} ₽</span>
              </button>
            )}
          {currentOrder.status === "Черновик" &&
            currentOrder.payment === "Перейти по ссылке -" &&
            !isExpress &&
            timeLeft >= 0 && (
              <button
                className={`${styles["order__pay-button"]}`}
                onClick={payLinkRedirect}
              >
                {isBrowser && (
                  <Timer
                    createdAt={currentOrder.createdAt}
                    dedline={currentOrder.overudeAfter}
                    timeLeft={timeLeft}
                    setTimeLeft={setTimeLeft}
                  />
                )}
                <span className={styles["order__pay-button-span"]}>
                  Оплатить
                </span>
                <span>{totalPrice} ₽</span>
              </button>
            )}
          {currentOrder.status === "Черновик" &&
            currentOrder.payment === "Перейти по ссылке -" &&
            isExpress &&
            timeLeft >= 0 && (
              <button
                className={`${styles["order__pay-button"]}`}
                onClick={payLinkExpressRedirect}
              >
                {isBrowser && (
                  <Timer
                    createdAt={currentOrder.createdAt}
                    dedline={currentOrder.overudeAfter}
                    timeLeft={timeLeft}
                    setTimeLeft={setTimeLeft}
                  />
                )}
                <span className={styles["order__pay-button-span"]}>
                  Оплатить
                </span>
                <span>{totalPrice} ₽</span>
              </button>
            )}
          {currentOrder.status === "Черновик" &&
            currentOrder.payment === "Перейти по ссылке -" &&
            timeLeft <= 0 && (
              <button
                className={styles["order__pay-button"]}
                onClick={handleTimeLeft}
              >
                {isBrowser && (
                  <Timer
                    createdAt={currentOrder.createdAt}
                    dedline={currentOrder.overudeAfter}
                    timeLeft={timeLeft}
                    setTimeLeft={setTimeLeft}
                  />
                )}
                <span className={styles["order__pay-button-span"]}>
                  Оплатить
                </span>
                <span>{totalPrice} ₽</span>
              </button>
            )}
          {currentOrder.status === "Черновик" &&
            currentOrder.payment === "Сплит -" &&
            !isSplit &&
            !currentOrder.isSplitPaid &&
            !isExpress &&
            timeLeft > 0 && (
              <button
                className={`${styles["order__pay-button"]}`}
                onClick={payLinkRedirect}
              >
                {isBrowser && (
                  <Timer
                    createdAt={currentOrder.createdAt}
                    dedline={currentOrder.overudeAfter}
                    timeLeft={timeLeft}
                    setTimeLeft={setTimeLeft}
                  />
                )}
                <span className={styles["order__pay-button-span"]}>
                  Оплатить
                </span>
                <span>{totalPrice} ₽</span>
              </button>
            )}
          {currentOrder.status === "Черновик" &&
            currentOrder.payment === "Сплит -" &&
            !isSplit &&
            !currentOrder.isSplitPaid &&
            isExpress &&
            timeLeft > 0 && (
              <button
                className={`${styles["order__pay-button"]}`}
                onClick={payLinkExpressRedirect}
              >
                {isBrowser && (
                  <Timer
                    createdAt={currentOrder.createdAt}
                    dedline={currentOrder.overudeAfter}
                    timeLeft={timeLeft}
                    setTimeLeft={setTimeLeft}
                  />
                )}
                <span className={styles["order__pay-button-span"]}>
                  Оплатить
                </span>
                <span>{totalPrice} ₽</span>
              </button>
            )}
          {currentOrder.status === "Черновик" &&
            currentOrder.payment === "Сплит -" &&
            !isSplit &&
            timeLeft <= 0 && (
              <button
                className={styles["order__pay-button"]}
                onClick={handleTimeLeft}
              >
                {isBrowser && (
                  <Timer
                    createdAt={currentOrder.createdAt}
                    dedline={currentOrder.overudeAfter}
                    timeLeft={timeLeft}
                    setTimeLeft={setTimeLeft}
                  />
                )}
                <span className={styles["order__pay-button-span"]}>
                  Оплатить
                </span>
                <span>{totalPrice} ₽</span>
              </button>
            )}
          {currentOrder.status === "Черновик" &&
            currentOrder.payment === "Сплит -" &&
            isSplit &&
            !currentOrder.isSplitPaid &&
            !isExpress &&
            timeLeft > 0 && (
              <button
                className={`${styles["order__pay-button"]}`}
                onClick={payLinkSplitRedirect}
              >
                {isBrowser && (
                  <Timer
                    createdAt={currentOrder.createdAt}
                    dedline={currentOrder.overudeAfter}
                    timeLeft={timeLeft}
                    setTimeLeft={setTimeLeft}
                  />
                )}
                <span className={styles["order__pay-button-span"]}>
                  Оплатить
                </span>
                <span>{Math.ceil(totalPrice / 2)} ₽</span>
              </button>
            )}
          {currentOrder.status === "Черновик" &&
            currentOrder.payment === "Сплит -" &&
            isSplit &&
            !currentOrder.isSplitPaid &&
            isExpress &&
            timeLeft > 0 && (
              <button
                className={`${styles["order__pay-button"]}`}
                onClick={payLinkSplitExpressRedirect}
              >
                {isBrowser && (
                  <Timer
                    createdAt={currentOrder.createdAt}
                    dedline={currentOrder.overudeAfter}
                    timeLeft={timeLeft}
                    setTimeLeft={setTimeLeft}
                  />
                )}
                <span className={styles["order__pay-button-span"]}>
                  Оплатить
                </span>
                <span>{Math.ceil(totalPrice / 2)} ₽</span>
              </button>
            )}
          {currentOrder.status === "Черновик" &&
            currentOrder.payment === "Сплит -" &&
            isSplit &&
            timeLeft <= 0 && (
              <button
                className={styles["order__pay-button"]}
                onClick={handleTimeLeft}
              >
                {isBrowser && (
                  <Timer
                    createdAt={currentOrder.createdAt}
                    dedline={currentOrder.overudeAfter}
                    timeLeft={timeLeft}
                    setTimeLeft={setTimeLeft}
                  />
                )}
                <span className={styles["order__pay-button-span"]}>
                  Оплатить
                </span>
                <span>{Math.ceil(totalPrice / 2)} ₽</span>
              </button>
            )}
          {currentOrder.status !== "Черновик" &&
            currentOrder.payment === "Сплит -" &&
            !currentOrder.isSplitPaidSecond &&
            isExpress &&
            currentOrder.isSplit && (
              <button
                className={`${styles["order__pay-button"]}`}
                onClick={payLinkSplitExpressSecondRedirect}
              >
                <span className={styles["order__pay-button-span"]}>
                  Оплатить вторую часть
                </span>
                <span>{Math.ceil(totalPrice / 2)} ₽</span>
              </button>
            )}
          {currentOrder.status !== "Черновик" &&
            currentOrder.payment === "Сплит -" &&
            !currentOrder.isSplitPaidSecond &&
            !isExpress &&
            currentOrder.isSplit && (
              <button
                className={`${styles["order__pay-button"]}`}
                onClick={payLinkSplitSecondRedirect}
              >
                <span className={styles["order__pay-button-span"]}>
                  Оплатить вторую часть
                </span>
                <span>{Math.ceil(totalPrice / 2)} ₽</span>
              </button>
            )}
          {mergedData.length > 0 && (
            <div className={styles["order__orders-pull-container"]}>
              <h2
                className={`${styles["order__title"]} ${styles["order__orders-pull-title"]}`}
              >
                К остальным заказам
              </h2>
              <div className={styles["combined-order__links"]}>
                {mergedData &&
                  mergedData.map((item: IMergedClientOrders) => {
                    return (
                      item.orderId !== currentOrder.orderId && (
                        <a
                          className={styles["combined-order__link"]}
                          href={`${BASE_URL_FRONT}/order/${item._id}`}
                          key={item.orderId}
                        >
                          {item.subcategory} {item.model}
                        </a>
                      )
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
      <Carousel
        isImagePopupOpen={isImagePopupOpen}
        images={currentOrder.orderImages}
        currentImageIndex={currentImageIndex}
        closePopup={closePopup}
        nextImage={nextImage}
        prevImage={prevImage}
      />
      <Carousel
        isImagePopupOpen={isPayProofPopupOpen}
        images={currentOrder.payProofImages}
        currentImageIndex={currentImageIndex}
        closePopup={closePayProofPopup}
        nextImage={nextImage}
        prevImage={prevImage}
      />
      <Carousel
        isImagePopupOpen={isBuyProofPopupOpen}
        images={currentOrder.buyProofImages}
        currentImageIndex={currentImageIndex}
        closePopup={closeBuyProofPopup}
        nextImage={nextImage}
        prevImage={prevImage}
      />
      <Carousel
        isImagePopupOpen={isReceiptImagesPopupOpen}
        images={currentOrder.receiptImages}
        currentImageIndex={currentImageIndex}
        closePopup={closeIsReceiptImagesPopup}
        nextImage={nextImage}
        prevImage={prevImage}
      />
      {timeLeft <= 0 && (
        <OverudeOrder
          isOverudeOrderModalOpen={isOverudeOrderModalOpen}
          closePopup={closeOverudeOrderPopup}
        />
      )}
      {currentOrder.deliveryAddress === "" &&
        currentOrder.status !== "Черновик" &&
        currentOrder.status !== "Проверка оплаты" &&
        currentOrder.status !== "Завершён" && (
          <UserDataModal
            _id={currentOrder._id}
            orderId={currentOrder.orderId}
            comment={currentOrder.model}
            combinedOrder={currentOrder.combinedOrder}
          />
        )}
      {isPreload && <PreloaderClient />}
    </section>
  );
};

export default Order;
