import React, { FC, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import styles from "./OrderPay.module.css";
import { BASE_URL, MAX_SIZE } from "../../utils/constants";
import {
  deletePayProofImage,
  updatePaidAt,
  updatePayProofImages,
  uploadImages,
} from "../../utils/Order";
import OrderData from "../../store/order";
import ImagePopup from "../ImagePopup/ImagePopup";
import { useRouter } from "next/router";
import PreloaderClient from "../UI/PreloaderClient/PreloaderClient";

interface IOrderPayProps {}

const OrderPay: FC<IOrderPayProps> = () => {
  const router = useRouter();

  const [isDelivery, setIsDelivery] = useState<boolean>(false);

  const [uploading, setUploading] = useState<boolean>(false);

  const [isCopy, setIsCopy] = useState<boolean>(false);

  const [isImagePopupOpen, setIsImagePopupOpen] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>("");

  const [isDrag, setIsDrag] = useState(false);

  const priceRub = Math.ceil(
    parseFloat(OrderData.order.priceCNY) *
      parseFloat(OrderData.order.currentRate)
  );

  const totalPrice = Math.ceil(
    priceRub +
      parseFloat(OrderData.order.priceDeliveryChina) +
      parseFloat(OrderData.order.priceDeliveryRussia) +
      parseFloat(OrderData.order.commission) -
      OrderData.order.promoCodePercent +
      OrderData.order.expressCost
  );

  function dragHandler() {
    setIsDrag(true);
  }

  function dragLeaveHandler() {
    setIsDrag(false);
  }

  function openImagePopup(imageSrc: string) {
    setCurrentImage(imageSrc);
    setIsImagePopupOpen(true);
  }

  function closeImagePopup() {
    setIsImagePopupOpen(false);
  }

  function handlePaySubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    updatePaidAt(OrderData.order._id).then(() => {
      router.replace(`/order/${OrderData.order._id}`);
    });
  }

  const uploadFileHandler = async (
    e: any, // Костыль!
    folder: string,
    setUploading: React.Dispatch<React.SetStateAction<boolean>>,
    multiple = false
  ) => {
    const formData = new FormData();
    if (multiple) {
      const files = e;

      for (let i = 0; i < files.length; i++) {
        formData.append("imagesUp", files[i]);
      }
    } else {
      const file = e;
      formData.append("imagesUp", file[0]);
    }

    setUploading(true);

    try {
      await uploadImages(formData, folder)
        .then((data) => {
          OrderData.setOrder({
            _id: OrderData.order._id,
            creater: OrderData.order.creater,
            buyer: OrderData.order.buyer,
            stockman: OrderData.order.stockman,
            createdAt: OrderData.order.createdAt,
            overudeAfter: OrderData.order.overudeAfter,
            payBeforeSplit: OrderData.order.payBeforeSplit,
            paidAt: OrderData.order.paidAt,
            buyAt: OrderData.order.buyAt,
            inChinaStockAt: OrderData.order.inChinaStockAt,
            inRussiaStockAt: OrderData.order.inRussiaStockAt,
            deliveredAt: OrderData.order.deliveredAt,
            orderId: OrderData.order.orderId,
            combinedOrder: OrderData.order.combinedOrder,
            status: OrderData.order.status,
            link: OrderData.order.link,
            payLink: OrderData.order.payLink,
            payLinkSplit: OrderData.order.payLinkSplit,
            paymentUUID: OrderData.order.paymentUUID,
            paymentUUIDSplit: OrderData.order.paymentUUIDSplit,
            payLinkSplitSecond: OrderData.order.payLinkSplitSecond,
            paymentUUIDSplitSecond: OrderData.order.paymentUUIDSplitSecond,
            isSplitPaid: OrderData.order.isSplitPaid,
            isSplitPaidSecond: OrderData.order.isSplitPaidSecond,
            paidAtSplit: OrderData.order.paidAtSplit,
            paidAtSplitSecond: OrderData.order.paidAtSplitSecond,
            category: OrderData.order.category,
            subcategory: OrderData.order.subcategory,
            brand: OrderData.order.brand,
            model: OrderData.order.model,
            size: OrderData.order.size,
            orderImages: OrderData.order.orderImages,
            payProofImages: OrderData.order.payProofImages.concat(data.data),
            buyProofImages: OrderData.order.buyProofImages,
            receiptImages: OrderData.order.receiptImages,
            uploadedBuyProofImages: OrderData.order.uploadedBuyProofImages,
            uploadedReceiptImages: OrderData.order.uploadedReceiptImages,
            isReceiptImages: OrderData.order.isReceiptImages,
            isSplit: OrderData.order.isSplit,
            payment: OrderData.order.payment,
            currentRate: OrderData.order.currentRate,
            priceCNY: OrderData.order.priceCNY,
            priceDeliveryChina: OrderData.order.priceDeliveryChina,
            priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
            commission: OrderData.order.commission,
            promoCodePercent: OrderData.order.promoCodePercent,
            comment: OrderData.order.comment,
            poizonCode: OrderData.order.poizonCode,
            filledPoizonCode: OrderData.order.filledPoizonCode,
            deliveryCode: OrderData.order.deliveryCode,
            deliveryName: OrderData.order.deliveryName,
            deliveryNameRecipient: OrderData.order.deliveryNameRecipient,
            deliveryPhone: OrderData.order.deliveryPhone,
            deliveryPhoneRecipient: "",
            deliveryMethod: OrderData.order.deliveryMethod,
            deliveryAddress: OrderData.order.deliveryAddress,
            deliveryEntity: OrderData.order.deliveryEntity,
            deliveryRelatedEntities: OrderData.order.deliveryRelatedEntities,
            reorder: OrderData.order.reorder,
            totalReorder: OrderData.order.totalReorder,
            payLinksArray: OrderData.order.payLinksArray,
            splitLinksArray: OrderData.order.splitLinksArray,
            splitSecondLinksArray: OrderData.order.splitSecondLinksArray,
            isPost: OrderData.order.isPost,
            isPurchaseImagesDisabled: OrderData.order.isPurchaseImagesDisabled,
            expressCost: OrderData.order.expressCost,
            payLinkExpress: OrderData.order.payLinkExpress,
            payLinkSplitExpress: OrderData.order.payLinkSplitExpress,
            payLinkSplitSecondExpress:
              OrderData.order.payLinkSplitSecondExpress,
            paymentUUIDExpress: OrderData.order.paymentUUIDExpress,
            paymentUUIDSplitExpress: OrderData.order.paymentUUIDSplitExpress,
            paymentUUIDSplitSecondExpress:
              OrderData.order.paymentUUIDSplitSecondExpress,
            payLinksExpressArray: OrderData.order.payLinksExpressArray,
            splitLinksExpressArray: OrderData.order.splitLinksExpressArray,
            splitSecondLinksExpressArray:
              OrderData.order.splitSecondLinksExpressArray,
            __v: OrderData.order.__v,
          });
        })
        .then(() => {
          setUploading(false);
          dragLeaveHandler();
        });
    } catch (error) {
      setUploading(false);
      console.error(error);
      dragLeaveHandler();
    }

    await updatePayProofImages(
      OrderData.order._id,
      OrderData.order.payProofImages
    );
  };

  async function pasteHandler(e: any) {
    // Костыль!
    if (e.clipboardData) {
      var items = e.clipboardData.items;
      if (items) {
        for (var i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            setUploading(true);

            const formData = new FormData();

            formData.append("imagesUp", items[0].getAsFile());

            try {
              await uploadImages(formData, "/order-pay")
                .then((data) => {
                  OrderData.setOrder({
                    _id: OrderData.order._id,
                    creater: OrderData.order.creater,
                    buyer: OrderData.order.buyer,
                    stockman: OrderData.order.stockman,
                    createdAt: OrderData.order.createdAt,
                    overudeAfter: OrderData.order.overudeAfter,
                    payBeforeSplit: OrderData.order.payBeforeSplit,
                    paidAt: OrderData.order.paidAt,
                    buyAt: OrderData.order.buyAt,
                    inChinaStockAt: OrderData.order.inChinaStockAt,
                    inRussiaStockAt: OrderData.order.inRussiaStockAt,
                    deliveredAt: OrderData.order.deliveredAt,
                    orderId: OrderData.order.orderId,
                    combinedOrder: OrderData.order.combinedOrder,
                    status: OrderData.order.status,
                    link: OrderData.order.link,
                    payLink: OrderData.order.payLink,
                    payLinkSplit: OrderData.order.payLinkSplit,
                    paymentUUID: OrderData.order.paymentUUID,
                    paymentUUIDSplit: OrderData.order.paymentUUIDSplit,
                    payLinkSplitSecond: OrderData.order.payLinkSplitSecond,
                    paymentUUIDSplitSecond:
                      OrderData.order.paymentUUIDSplitSecond,
                    isSplitPaid: OrderData.order.isSplitPaid,
                    isSplitPaidSecond: OrderData.order.isSplitPaidSecond,
                    paidAtSplit: OrderData.order.paidAtSplit,
                    paidAtSplitSecond: OrderData.order.paidAtSplitSecond,
                    category: OrderData.order.category,
                    subcategory: OrderData.order.subcategory,
                    brand: OrderData.order.brand,
                    model: OrderData.order.model,
                    size: OrderData.order.size,
                    orderImages: OrderData.order.orderImages,
                    payProofImages: OrderData.order.payProofImages.concat(
                      data.data
                    ),
                    buyProofImages: OrderData.order.buyProofImages,
                    receiptImages: OrderData.order.receiptImages,
                    uploadedBuyProofImages:
                      OrderData.order.uploadedBuyProofImages,
                    uploadedReceiptImages:
                      OrderData.order.uploadedReceiptImages,
                    isSplit: OrderData.order.isSplit,
                    isReceiptImages: OrderData.order.isReceiptImages,
                    payment: OrderData.order.payment,
                    currentRate: OrderData.order.currentRate,
                    priceCNY: OrderData.order.priceCNY,
                    priceDeliveryChina: OrderData.order.priceDeliveryChina,
                    priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
                    commission: OrderData.order.commission,
                    promoCodePercent: OrderData.order.promoCodePercent,
                    comment: OrderData.order.comment,
                    poizonCode: OrderData.order.poizonCode,
                    filledPoizonCode: OrderData.order.filledPoizonCode,
                    deliveryCode: OrderData.order.deliveryCode,
                    deliveryName: OrderData.order.deliveryName,
                    deliveryNameRecipient:
                      OrderData.order.deliveryNameRecipient,
                    deliveryPhone: OrderData.order.deliveryPhone,
                    deliveryPhoneRecipient: "",
                    deliveryMethod: OrderData.order.deliveryMethod,
                    deliveryAddress: OrderData.order.deliveryAddress,
                    deliveryEntity: OrderData.order.deliveryEntity,
                    deliveryRelatedEntities:
                      OrderData.order.deliveryRelatedEntities,
                    reorder: OrderData.order.reorder,
                    totalReorder: OrderData.order.totalReorder,
                    payLinksArray: OrderData.order.payLinksArray,
                    splitLinksArray: OrderData.order.splitLinksArray,
                    splitSecondLinksArray:
                      OrderData.order.splitSecondLinksArray,
                    isPost: OrderData.order.isPost,
                    isPurchaseImagesDisabled:
                      OrderData.order.isPurchaseImagesDisabled,
                    expressCost: OrderData.order.expressCost,
                    payLinkExpress: OrderData.order.payLinkExpress,
                    payLinkSplitExpress: OrderData.order.payLinkSplitExpress,
                    payLinkSplitSecondExpress:
                      OrderData.order.payLinkSplitSecondExpress,
                    paymentUUIDExpress: OrderData.order.paymentUUIDExpress,
                    paymentUUIDSplitExpress:
                      OrderData.order.paymentUUIDSplitExpress,
                    paymentUUIDSplitSecondExpress:
                      OrderData.order.paymentUUIDSplitSecondExpress,
                    payLinksExpressArray: OrderData.order.payLinksExpressArray,
                    splitLinksExpressArray:
                      OrderData.order.splitLinksExpressArray,
                    splitSecondLinksExpressArray:
                      OrderData.order.splitSecondLinksExpressArray,
                    __v: OrderData.order.__v,
                  });
                })
                .then(() => {
                  setUploading(false);
                  dragLeaveHandler();
                });
            } catch (error) {
              setUploading(false);
              console.error(error);
              dragLeaveHandler();
            }

            await updatePayProofImages(
              OrderData.order._id,
              OrderData.order.payProofImages
            );
          }
        }
      }
    }
  }

  useEffect(() => {
    document.addEventListener("paste", pasteHandler);
    return () => document.removeEventListener("paste", pasteHandler);
  }, []);

  function deleteImageHandler(imageName: string) {
    deletePayProofImage(imageName, OrderData.order._id)
      .then(() => {
        OrderData.setOrder({
          _id: OrderData.order._id,
          creater: OrderData.order.creater,
          buyer: OrderData.order.buyer,
          stockman: OrderData.order.stockman,
          createdAt: OrderData.order.createdAt,
          overudeAfter: OrderData.order.overudeAfter,
          payBeforeSplit: OrderData.order.payBeforeSplit,
          paidAt: OrderData.order.paidAt,
          buyAt: OrderData.order.buyAt,
          inChinaStockAt: OrderData.order.inChinaStockAt,
          inRussiaStockAt: OrderData.order.inRussiaStockAt,
          deliveredAt: OrderData.order.deliveredAt,
          orderId: OrderData.order.orderId,
          combinedOrder: OrderData.order.combinedOrder,
          status: OrderData.order.status,
          link: OrderData.order.link,
          payLink: OrderData.order.payLink,
          payLinkSplit: OrderData.order.payLinkSplit,
          paymentUUID: OrderData.order.paymentUUID,
          paymentUUIDSplit: OrderData.order.paymentUUIDSplit,
          payLinkSplitSecond: OrderData.order.payLinkSplitSecond,
          paymentUUIDSplitSecond: OrderData.order.paymentUUIDSplitSecond,
          isSplitPaid: OrderData.order.isSplitPaid,
          isSplitPaidSecond: OrderData.order.isSplitPaidSecond,
          paidAtSplit: OrderData.order.paidAtSplit,
          paidAtSplitSecond: OrderData.order.paidAtSplitSecond,
          category: OrderData.order.category,
          subcategory: OrderData.order.subcategory,
          brand: OrderData.order.brand,
          model: OrderData.order.model,
          size: OrderData.order.size,
          orderImages: OrderData.order.orderImages,
          payProofImages: OrderData.order.payProofImages.filter(
            (imageItem) => imageItem.name !== imageName
          ),
          buyProofImages: OrderData.order.buyProofImages,
          receiptImages: OrderData.order.receiptImages,
          uploadedBuyProofImages: OrderData.order.uploadedBuyProofImages,
          uploadedReceiptImages: OrderData.order.uploadedReceiptImages,
          isReceiptImages: OrderData.order.isReceiptImages,
          isSplit: OrderData.order.isSplit,
          payment: OrderData.order.payment,
          currentRate: OrderData.order.currentRate,
          priceCNY: OrderData.order.priceCNY,
          priceDeliveryChina: OrderData.order.priceDeliveryChina,
          priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
          commission: OrderData.order.commission,
          promoCodePercent: OrderData.order.promoCodePercent,
          comment: OrderData.order.comment,
          poizonCode: OrderData.order.poizonCode,
          filledPoizonCode: OrderData.order.filledPoizonCode,
          deliveryCode: OrderData.order.deliveryCode,
          deliveryName: OrderData.order.deliveryName,
          deliveryNameRecipient: OrderData.order.deliveryNameRecipient,
          deliveryPhone: OrderData.order.deliveryPhone,
          deliveryPhoneRecipient: "",
          deliveryMethod: OrderData.order.deliveryMethod,
          deliveryAddress: OrderData.order.deliveryAddress,
          deliveryEntity: OrderData.order.deliveryEntity,
          deliveryRelatedEntities: OrderData.order.deliveryRelatedEntities,
          reorder: OrderData.order.reorder,
          totalReorder: OrderData.order.totalReorder,
          payLinksArray: OrderData.order.payLinksArray,
          splitLinksArray: OrderData.order.splitLinksArray,
          splitSecondLinksArray: OrderData.order.splitSecondLinksArray,
          isPost: OrderData.order.isPost,
          isPurchaseImagesDisabled: OrderData.order.isPurchaseImagesDisabled,
          expressCost: OrderData.order.expressCost,
          payLinkExpress: OrderData.order.payLinkExpress,
          payLinkSplitExpress: OrderData.order.payLinkSplitExpress,
          payLinkSplitSecondExpress: OrderData.order.payLinkSplitSecondExpress,
          paymentUUIDExpress: OrderData.order.paymentUUIDExpress,
          paymentUUIDSplitExpress: OrderData.order.paymentUUIDSplitExpress,
          paymentUUIDSplitSecondExpress:
            OrderData.order.paymentUUIDSplitSecondExpress,
          payLinksExpressArray: OrderData.order.payLinksExpressArray,
          splitLinksExpressArray: OrderData.order.splitLinksExpressArray,
          splitSecondLinksExpressArray:
            OrderData.order.splitSecondLinksExpressArray,
          __v: OrderData.order.__v,
        });
      })
      .then(() => {
        updatePayProofImages(
          OrderData.order._id,
          OrderData.order.payProofImages
        );
      })
      .catch(console.error);
  }

  const link =
    /(?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/gi;

  const numbers = /(\d+(\.\d+)?)/g;

  const result = OrderData.order.payment.match(link);

  function copyLink() {
    navigator.clipboard.writeText(
      OrderData.order.payment.match(numbers)?.join("")!
    );

    setIsCopy(true);

    setTimeout(() => {
      setIsCopy(false);
    }, 2000);
  }

  useEffect(() => {
    if (OrderData.order.status === "Ожидает закупки") {
      router.replace(`/order/${router.query.orderPayId}`);
    }
  }, []);

  return (
    <section className={styles["order-pay"]}>
      {uploading && <PreloaderClient />}
      <div className={styles["order-pay__container"]}>
        {!isDelivery && OrderData.order.payment !== "Перейти по ссылке -" && (
          <>
            <div className={styles["order-pay__text-container"]}>
              <div className={styles["order-pay__number"]}>
                Заказ № {OrderData.order.orderId}
              </div>
              <h4 className={styles["order-pay__title"]}>
                {OrderData.order.brand} {OrderData.order.model}
              </h4>
              <h4 className={styles["order-pay__text"]}>Сумма оплаты</h4>
              <p className={styles["order-pay__title"]}>{totalPrice} ₽</p>

              <h4 className={styles["order-pay__text"]}>Cпособ оплаты</h4>
              {OrderData.order.payment !== "Перейти по ссылке -" &&
                OrderData.order.payment !== undefined &&
                !result && (
                  <div
                    className={`${styles["order-pay__card-container"]} ${
                      OrderData.order.payment.includes("Тинькофф") &&
                      styles["order-pay__card-container_yellow"]
                    } ${
                      OrderData.order.payment.includes("Альфа") &&
                      styles["order-pay__card-container_red"]
                    } ${
                      OrderData.order.payment.includes("Сбер") &&
                      styles["order-pay__card-container_green"]
                    }

                    ${
                      (OrderData.order.payment.includes("Газпром") ||
                        OrderData.order.payment.includes("ВТБ") ||
                        OrderData.order.payment.includes("УралСиб")) &&
                      styles["order-pay__card-container_blue"]
                    }
                    `}
                  >
                    <p className={styles["order-pay__card-text"]}>
                      {OrderData.order.payment}
                    </p>
                    {OrderData.order.payment !== "Уточняйте у менеджера -" &&
                      OrderData.order.payment !== "Перейти по ссылке -" && (
                        <div
                          onClick={copyLink}
                          className={
                            styles["order-change__public-link-text-copy"]
                          }
                        >
                          {isCopy ? "Скопировано" : "Скопировать"}
                          <svg
                            x="0px"
                            y="0px"
                            width="20px"
                            height="20px"
                            viewBox="0 0 24 24"
                            focusable="false"
                            fill="currentColor"
                          >
                            <path d="M3.9,12c0-1.7,1.4-3.1,3.1-3.1h4V7H7c-2.8,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.3,15.1,3.9,13.7,3.9,12z M8,13h8v-2H8V13zM17,7h-4v1.9h4c1.7,0,3.1,1.4,3.1,3.1s-1.4,3.1-3.1,3.1h-4V17h4c2.8,0,5-2.2,5-5S19.8,7,17,7z"></path>
                          </svg>
                        </div>
                      )}
                  </div>
                )}
              {OrderData.order.payment !== "Перейти по ссылке -" &&
                OrderData.order.payment !== undefined &&
                result !== null &&
                result?.length > 0 && (
                  <div className={styles["qr-code__container"]}>
                    <p className={styles["order-pay__text"]}>
                      Вы можете оплатить{" "}
                      <a
                        className={`${styles["order-pay__text"]} ${styles["order-pay__link"]}`}
                        target="_blank"
                        rel="noreferrer"
                        href={result[0]}
                      >
                        по ссылке
                      </a>{" "}
                      или отсканировав QR-код
                    </p>
                    <img
                      className={styles["qr-code"]}
                      src="../../images/qr-code.png"
                      alt="qr-code"
                    />
                  </div>
                )}
              {OrderData.order.payment === "Перейти по ссылке -" && (
                <p className={styles["order-pay__text"]}>
                  Вы можете оплатить{" "}
                  <a
                    className={`${styles["order-pay__text"]} ${styles["order-pay__link"]}`}
                    target="_blank"
                    rel="noreferrer"
                    href={OrderData.order.payLink}
                  >
                    по ссылке
                  </a>{" "}
                </p>
              )}
            </div>
            {OrderData.order.payment !== "Перейти по ссылке -" && (
              <form className={styles["order-pay__images-container"]}>
                <h4 className={styles["order-pay__title"]}>
                  Загрузите скриншот оплаты
                </h4>
                {OrderData.order.payment !== "Перейти по ссылке -" &&
                  OrderData.order.payProofImages.length !== 0 && (
                    <ul className={styles["order-pay__images-list"]}>
                      {OrderData.order.payProofImages
                        .slice()
                        .reverse()
                        .map((image) => {
                          return (
                            <li
                              key={image.name}
                              className={styles["order-pay__image"]}
                            >
                              {OrderData.order.status === "Черновик" && (
                                <div
                                  className={styles["order-pay__delete-image"]}
                                  onClick={() => deleteImageHandler(image.name)}
                                >
                                  <svg
                                    width="18"
                                    height="20"
                                    viewBox="0 0 18 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M2.45763 18.1422C2.51857 18.8126 3.06711 19.3002 3.73754 19.3002H14.2612C14.9317 19.3002 15.4802 18.7923 15.5411 18.1422L16.7195 5.79004H1.2793L2.45763 18.1422Z"
                                      fill="white"
                                    />
                                    <path
                                      d="M16.7201 1.93002H11.5801V1.27991C11.5801 0.568849 11.0113 0 10.3002 0H7.72009C7.00903 0 6.44018 0.568849 6.44018 1.27991V1.93002H1.27991C0.568849 1.93002 0 2.49887 0 3.20993C0 3.92099 0.568849 4.48984 1.27991 4.48984H16.7201C17.4312 4.48984 18 3.92099 18 3.20993C18 2.49887 17.4312 1.93002 16.7201 1.93002Z"
                                      fill="white"
                                    />
                                  </svg>
                                </div>
                              )}
                              <img
                                className={styles["order-pay__image-item"]}
                                src={`${BASE_URL}${image.path}`}
                                alt={image.name}
                                crossOrigin="anonymous"
                                onClick={() =>
                                  openImagePopup(`${BASE_URL}${image.path}`)
                                }
                              />
                            </li>
                          );
                        })}
                    </ul>
                  )}
                {OrderData.order.payment !== "Перейти по ссылке -" &&
                  OrderData.order.payProofImages.length === 0 &&
                  Math.ceil(
                    Math.round(
                      new Date(OrderData.order.overudeAfter).getTime() -
                        new Date(Date.now()).getTime()
                    ) / 1000
                  ) > 0 && (
                    <Dropzone
                      onDrop={(e: any) =>
                        uploadFileHandler(e, "/order-pay", setUploading)
                      }
                      onDragEnter={dragHandler}
                      onDragLeave={dragLeaveHandler}
                      maxSize={MAX_SIZE}
                      multiple={false}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div
                          className={`${styles["drag-n-drop-container"]} ${
                            isDrag && styles["drag-n-drop-container_active"]
                          }`}
                        >
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p className={styles["drag-n-drop-text"]}>
                              {isDrag
                                ? "Перетащите фото"
                                : "Добавить фото или ctrl + v"}
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
                            </p>
                          </div>
                        </div>
                      )}
                    </Dropzone>
                  )}
                {OrderData.order.payment !== "Перейти по ссылке -" && (
                  <>
                    <button
                      type="button"
                      className={`${styles["order-pay__pay-submit"]} ${
                        OrderData.order.payProofImages.length === 0 &&
                        styles["order-pay__pay-submit_disabled"]
                      }`}
                      disabled={OrderData.order.payProofImages.length === 0}
                      onClick={handlePaySubmit}
                    >
                      Готово
                    </button>
                  </>
                )}
              </form>
            )}
          </>
        )}
      </div>
      <ImagePopup
        isImagePopupOpen={isImagePopupOpen}
        currentImage={currentImage}
        closePopup={closeImagePopup}
      />
    </section>
  );
};

export default OrderPay;
