import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import TextInput from "../UI/TextInput/TextInput";
import OrderData from "../../store/order";
import UserData from "../../store/user";
import styles from "./Purchase.module.css";
import { BASE_URL, MAX_SIZE } from "../../utils/constants";
import {
  deletePurchaseImage,
  inPurchase,
  updatePurchaseData,
  updatePurchaseImages,
  uploadImages,
  cancelPurchase,
  notLegit,
} from "../../utils/Order";
import ImagePopup from "../ImagePopup/ImagePopup";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import { IOrderImages } from "../../types/interfaces";
import Preloader from "../UI/Preloader/Preloader";

const Purchase = () => {
  const [data, setData] = useState({
    poizon_code: OrderData.order.poizonCode,
  });

  const [uploading, setUploading] = useState<boolean>(false);

  const [isImagePopupOpen, setIsImagePopupOpen] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>("");

  const [isSubmitPopupOpen, setIsSubmitPopupOpen] = useState<boolean>(false);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState<boolean>(false);
  const [isLegitPopupOpen, setIsLegitPopupOpen] = useState<boolean>(false);

  const [isDrag, setIsDrag] = useState(false);

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: value,
    });
  }

  function dragHandler() {
    setIsDrag(true);
  }

  function dragLeaveHandler() {
    setIsDrag(false);
  }

  function openSubmitPopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsSubmitPopupOpen(true);
  }

  function closeSubmitPopup() {
    setIsSubmitPopupOpen(false);
  }

  function openCancelPopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsCancelPopupOpen(true);
  }

  function closeCancelPopup() {
    setIsCancelPopupOpen(false);
    setIsSubmitPopupOpen(false);
  }

  function openLegitPopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsLegitPopupOpen(true);
  }

  function closeLegitPopup() {
    setIsLegitPopupOpen(false);
    setIsSubmitPopupOpen(false);
  }

  function openImagePopup(imageSrc: string) {
    setCurrentImage(imageSrc);
    setIsImagePopupOpen(true);
  }

  function closeImagePopup() {
    setIsImagePopupOpen(false);
  }

  const uploadFileHandler = async (
    e: any, // Костыль!
    folder: string,
    setUploading: React.Dispatch<React.SetStateAction<boolean>>,
    multiple = true
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
            paidAt: OrderData.order.paidAt,
            buyAt: OrderData.order.buyAt,
            inChinaStockAt: OrderData.order.inChinaStockAt,
            deliveredAt: OrderData.order.deliveredAt,
            orderId: OrderData.order.orderId,
            combinedOrder: OrderData.order.combinedOrder,
            status: OrderData.order.status,
            link: OrderData.order.link,
            payLink: OrderData.order.payLink,
            paymentUUID: OrderData.order.paymentUUID,
            category: OrderData.order.category,
            subcategory: OrderData.order.subcategory,
            brand: OrderData.order.brand,
            model: OrderData.order.model,
            size: OrderData.order.size,
            orderImages: OrderData.order.orderImages,
            payProofImages: OrderData.order.payProofImages,
            buyProofImages: OrderData.order.buyProofImages.concat(data.data),
            receiptImages: OrderData.order.receiptImages,
            uploadedBuyProofImages: OrderData.order.uploadedBuyProofImages,
            uploadedReceiptImages: OrderData.order.uploadedReceiptImages,
            isReceiptImages: OrderData.order.isReceiptImages,
            payment: OrderData.order.payment,
            currentRate: OrderData.order.currentRate,
            priceCNY: OrderData.order.priceCNY,
            priceDeliveryChina: OrderData.order.priceDeliveryChina,
            priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
            commission: OrderData.order.commission,
            promoCodePercent: OrderData.order.promoCodePercent,
            comment: OrderData.order.comment,
            poizonCode: data.poizon_code,
            filledPoizonCode: OrderData.order.filledPoizonCode,
            deliveryCode: OrderData.order.deliveryCode,
            deliveryName: OrderData.order.deliveryName,
            deliveryNameRecipient: OrderData.order.deliveryNameRecipient,
            deliveryPhone: OrderData.order.deliveryPhone,
            deliveryPhoneRecipient: OrderData.order.deliveryPhoneRecipient,
            deliveryMethod: OrderData.order.deliveryMethod,
            deliveryAddress: OrderData.order.deliveryAddress,
            deliveryEntity: OrderData.order.deliveryEntity,
            deliveryRelatedEntities: OrderData.order.deliveryRelatedEntities,
            reorder: OrderData.order.reorder,
            __v: OrderData.order.__v,
          });
        })
        .then(() => {
          setUploading(false);
          dragLeaveHandler();
        });
    } catch (error) {
      dragLeaveHandler();
      console.error(error);
    }

    await updatePurchaseImages(
      OrderData.order._id,
      OrderData.order.buyProofImages,
      UserData.userData.name
    ).then((order) => OrderData.setOrder(order));
  };

  function deleteImageHandler(imageName: string) {
    deletePurchaseImage(imageName, OrderData.order._id)
      .then(() => {
        OrderData.setOrder({
          _id: OrderData.order._id,
          creater: OrderData.order.creater,
          buyer: OrderData.order.buyer,
          stockman: OrderData.order.stockman,
          createdAt: OrderData.order.createdAt,
          overudeAfter: OrderData.order.overudeAfter,
          paidAt: OrderData.order.paidAt,
          buyAt: OrderData.order.buyAt,
          inChinaStockAt: OrderData.order.inChinaStockAt,
          deliveredAt: OrderData.order.deliveredAt,
          orderId: OrderData.order.orderId,
          combinedOrder: OrderData.order.combinedOrder,
          status: OrderData.order.status,
          link: OrderData.order.link,
          payLink: OrderData.order.payLink,
          paymentUUID: OrderData.order.paymentUUID,
          category: OrderData.order.category,
          subcategory: OrderData.order.subcategory,
          brand: OrderData.order.brand,
          model: OrderData.order.model,
          size: OrderData.order.size,
          orderImages: OrderData.order.orderImages,
          payProofImages: OrderData.order.payProofImages,
          buyProofImages: OrderData.order.buyProofImages.filter(
            (imageItem) => imageItem.name !== imageName
          ),
          receiptImages: OrderData.order.receiptImages,
          uploadedBuyProofImages: OrderData.order.uploadedBuyProofImages,
          uploadedReceiptImages: OrderData.order.uploadedReceiptImages,
          isReceiptImages: OrderData.order.isReceiptImages,
          payment: OrderData.order.payment,
          currentRate: OrderData.order.currentRate,
          priceCNY: OrderData.order.priceCNY,
          priceDeliveryChina: OrderData.order.priceDeliveryChina,
          priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
          commission: OrderData.order.commission,
          promoCodePercent: OrderData.order.promoCodePercent,
          comment: OrderData.order.comment,
          poizonCode: data.poizon_code,
          filledPoizonCode: OrderData.order.filledPoizonCode,
          deliveryCode: OrderData.order.deliveryCode,
          deliveryName: OrderData.order.deliveryName,
          deliveryNameRecipient: OrderData.order.deliveryNameRecipient,
          deliveryPhone: OrderData.order.deliveryPhone,
          deliveryPhoneRecipient: OrderData.order.deliveryPhoneRecipient,
          deliveryMethod: OrderData.order.deliveryMethod,
          deliveryAddress: OrderData.order.deliveryAddress,
          deliveryEntity: OrderData.order.deliveryEntity,
          deliveryRelatedEntities: OrderData.order.deliveryRelatedEntities,
          reorder: OrderData.order.reorder,
          __v: OrderData.order.__v,
        });
      })
      .then(() => {
        updatePurchaseImages(
          OrderData.order._id,
          OrderData.order.buyProofImages,
          UserData.userData.name
        );
      })
      .catch(console.error);
  }

  function handlePurchaseSubmit() {
    if (OrderData.order.buyProofImages.length !== 0) {
      updatePurchaseData(
        OrderData.order._id,
        OrderData.order.poizonCode,
        UserData.userData.name
      )
        .then((order) => {
          OrderData.setOrder(order);
        })
        .then(() => closeSubmitPopup());
    } else {
      alert("Необходимо прикрепить скриншоты чеков закупки");
    }
  }

  function handleAcceptPurchaseSubmit() {
    inPurchase(OrderData.order._id, UserData.userData.name)
      .then((order) => {
        OrderData.setOrder(order);
      })
      .then(() => closeSubmitPopup());
  }

  function handleReorder() {
    cancelPurchase(OrderData.order._id)
      .then((order) => {
        if (order.buyProofImages.length !== 0) {
          order.buyProofImages.forEach((item: IOrderImages) => {
            deleteImageHandler(item.name);
          });
        }

        return order;
      })
      .then((updatedOrder) => {
        OrderData.setOrder(updatedOrder);
      })
      .then(() => setIsCancelPopupOpen(false))
      .then(() => closeCancelPopup());
  }

  function handleNotLegit() {
    notLegit(OrderData.order._id)
      .then((updatedOrder) => {
        OrderData.setOrder(updatedOrder);
      })
      .then(() => {
        setIsCancelPopupOpen(false);
        setIsSubmitPopupOpen(false);
      })
      .then(() => closeCancelPopup());
  }

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
              await uploadImages(formData, "/order-purchase")
                .then((data) => {
                  OrderData.setOrder({
                    _id: OrderData.order._id,
                    creater: OrderData.order.creater,
                    buyer: OrderData.order.buyer,
                    stockman: OrderData.order.stockman,
                    createdAt: OrderData.order.createdAt,
                    overudeAfter: OrderData.order.overudeAfter,
                    paidAt: OrderData.order.paidAt,
                    buyAt: OrderData.order.buyAt,
                    inChinaStockAt: OrderData.order.inChinaStockAt,
                    deliveredAt: OrderData.order.deliveredAt,
                    orderId: OrderData.order.orderId,
                    combinedOrder: OrderData.order.combinedOrder,
                    status: OrderData.order.status,
                    link: OrderData.order.link,
                    payLink: OrderData.order.payLink,
                    paymentUUID: OrderData.order.paymentUUID,
                    category: OrderData.order.category,
                    subcategory: OrderData.order.subcategory,
                    brand: OrderData.order.brand,
                    model: OrderData.order.model,
                    size: OrderData.order.size,
                    orderImages: OrderData.order.orderImages,
                    payProofImages: OrderData.order.payProofImages,
                    buyProofImages: OrderData.order.buyProofImages.concat(
                      data.data
                    ),
                    receiptImages: OrderData.order.receiptImages,
                    uploadedBuyProofImages:
                      OrderData.order.uploadedBuyProofImages,
                    uploadedReceiptImages:
                      OrderData.order.uploadedReceiptImages,
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
                    deliveryPhoneRecipient:
                      OrderData.order.deliveryPhoneRecipient,
                    deliveryMethod: OrderData.order.deliveryMethod,
                    deliveryAddress: OrderData.order.deliveryAddress,
                    deliveryEntity: OrderData.order.deliveryEntity,
                    deliveryRelatedEntities:
                      OrderData.order.deliveryRelatedEntities,
                    reorder: OrderData.order.reorder,
                    __v: OrderData.order.__v,
                  });
                })
                .then(() => {
                  setUploading(false);
                  dragLeaveHandler();
                });
            } catch (error) {
              setUploading(false);
              dragLeaveHandler();
              console.error(error);
            }

            await updatePurchaseImages(
              OrderData.order._id,
              OrderData.order.buyProofImages,
              UserData.userData.name
            ).then((order) => OrderData.setOrder(order));
          }
        }
      }
    }
  }

  useEffect(() => {
    document.addEventListener("paste", pasteHandler);
    return () => document.removeEventListener("paste", pasteHandler);
  }, []);

  useEffect(() => {
    OrderData.setOrder({
      _id: OrderData.order._id,
      creater: OrderData.order.creater,
      buyer: OrderData.order.buyer,
      stockman: OrderData.order.stockman,
      createdAt: OrderData.order.createdAt,
      overudeAfter: OrderData.order.overudeAfter,
      paidAt: OrderData.order.paidAt,
      buyAt: OrderData.order.buyAt,
      inChinaStockAt: OrderData.order.inChinaStockAt,
      deliveredAt: OrderData.order.deliveredAt,
      orderId: OrderData.order.orderId,
      combinedOrder: OrderData.order.combinedOrder,
      status: OrderData.order.status,
      link: OrderData.order.link,
      payLink: OrderData.order.payLink,
      paymentUUID: OrderData.order.paymentUUID,
      category: OrderData.order.category,
      subcategory: OrderData.order.subcategory,
      brand: OrderData.order.brand,
      model: OrderData.order.model,
      size: OrderData.order.size,
      orderImages: OrderData.order.orderImages,
      payProofImages: OrderData.order.payProofImages,
      buyProofImages: OrderData.order.buyProofImages,
      receiptImages: OrderData.order.receiptImages,
      uploadedBuyProofImages: OrderData.order.uploadedBuyProofImages,
      uploadedReceiptImages: OrderData.order.uploadedReceiptImages,
      isReceiptImages: OrderData.order.isReceiptImages,
      payment: OrderData.order.payment,
      currentRate: OrderData.order.currentRate,
      priceCNY: OrderData.order.priceCNY,
      priceDeliveryChina: OrderData.order.priceDeliveryChina,
      priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
      commission: OrderData.order.commission,
      promoCodePercent: OrderData.order.promoCodePercent,
      comment: OrderData.order.comment,
      poizonCode: data.poizon_code,
      filledPoizonCode: OrderData.order.filledPoizonCode,
      deliveryCode: OrderData.order.deliveryCode,
      deliveryName: OrderData.order.deliveryName,
      deliveryNameRecipient: OrderData.order.deliveryNameRecipient,
      deliveryPhone: OrderData.order.deliveryPhone,
      deliveryPhoneRecipient: OrderData.order.deliveryPhoneRecipient,
      deliveryMethod: OrderData.order.deliveryMethod,
      deliveryAddress: OrderData.order.deliveryAddress,
      deliveryEntity: OrderData.order.deliveryEntity,
      deliveryRelatedEntities: OrderData.order.deliveryRelatedEntities,
      reorder: OrderData.order.reorder,
      __v: OrderData.order.__v,
    });
  }, [data]);

  return (
    <form onSubmit={openSubmitPopup} className={styles["purchase"]}>
      <TextInput
        label="Номер отправки Poizon"
        name="poizon_code"
        value={OrderData.order.poizonCode}
        handleChange={handleChange}
        required={false}
        disabled={UserData.userData.position === "Работник склада"}
      />
      {OrderData.order.filledPoizonCode !== "" &&
        OrderData.order.filledPoizonCode !== null &&
        OrderData.order.poizonCode !== "" && (
          <p>
            Обновил: <strong>{OrderData.order.filledPoizonCode}</strong>
          </p>
        )}
      {!(
        OrderData.order.status === "Черновик" ||
        OrderData.order.status === "Проверка оплаты" ||
        OrderData.order.status === "Ожидает закупки"
      ) && (
        <p>
          Скриншоты чеков закупки{" "}
          {OrderData.order.uploadedBuyProofImages !== "" &&
            OrderData.order.uploadedBuyProofImages !== null &&
            OrderData.order.buyProofImages.length > 0 && (
              <span>
                загрузил:{" "}
                <strong>{OrderData.order.uploadedBuyProofImages}</strong>
              </span>
            )}
        </p>
      )}
      <ul className={styles["purchase__images-list"]}>
        {OrderData.order.buyProofImages.length > 0 &&
          OrderData.order.buyProofImages
            .slice()
            .reverse()
            .map((image) => {
              return (
                <li key={image.name} className={styles["purchase__image"]}>
                  {OrderData.order.status === "На закупке" &&
                    UserData.userData.position !== "Работник склада" && (
                      <div
                        className={styles["purchase__delete-image"]}
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
                            fill="black"
                          />
                          <path
                            d="M16.7201 1.93002H11.5801V1.27991C11.5801 0.568849 11.0113 0 10.3002 0H7.72009C7.00903 0 6.44018 0.568849 6.44018 1.27991V1.93002H1.27991C0.568849 1.93002 0 2.49887 0 3.20993C0 3.92099 0.568849 4.48984 1.27991 4.48984H16.7201C17.4312 4.48984 18 3.92099 18 3.20993C18 2.49887 17.4312 1.93002 16.7201 1.93002Z"
                            fill="black"
                          />
                        </svg>
                      </div>
                    )}
                  <img
                    className={styles["purchase__image-item"]}
                    src={`${BASE_URL}${image.path}`}
                    alt={image.name}
                    crossOrigin="anonymous"
                    onClick={() => openImagePopup(`${BASE_URL}${image.path}`)}
                  />
                </li>
              );
            })}
      </ul>
      {OrderData.order.status === "На закупке" &&
        UserData.userData.position !== "Менеджер" &&
        UserData.userData.position !== "Работник склада" && (
          <Dropzone
            onDrop={(e: any) =>
              uploadFileHandler(e, "/order-purchase", setUploading)
            }
            onDragEnter={dragHandler}
            onDragLeave={dragLeaveHandler}
            maxSize={MAX_SIZE}
            multiple={true}
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
                    {isDrag ? "Перетащите фото" : "Добавить фото или ctrl + v"}
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
      {UserData.userData.position !== "Менеджер" &&
        UserData.userData.position !== "Работник склада" && (
          <div
            className={`${styles["purchase__buttons-container"]} ${
              UserData.userData.position === "Менеджер" &&
              styles["purchase__button-submit_disable"]
            }`}
          >
            {OrderData.order.status === "Ожидает закупки" && (
              <button
                className={`${styles["purchase__button-submit"]} ${
                  UserData.userData.position === "Менеджер" &&
                  styles["purchase__button-submit_disable"]
                }`}
                type="submit"
              >
                На закупку
              </button>
            )}
            {
              <button
                className={`${styles["purchase__button-submit"]} ${
                  UserData.userData.position === "Менеджер" &&
                  styles["purchase__button-submit_disable"]
                }`}
                type="submit"
              >
                {OrderData.order.status !== "На закупке"
                  ? "Сохранить POIZON"
                  : "Закуплен"}
              </button>
            }
            {(OrderData.order.status === "На закупке" ||
              OrderData.order.status === "Закуплен") && (
              <button
                className={`${styles["purchase__button-submit"]} ${
                  styles["purchase__button-reorder"]
                } ${
                  UserData.userData.position === "Менеджер" &&
                  styles["purchase__button-submit_disable"]
                }`}
                onClick={openCancelPopup}
              >
                Отменить закупку
              </button>
            )}
            {OrderData.order.status !== "Черновик" &&
              OrderData.order.status !== "Проверка оплаты" &&
              OrderData.order.status !== "Завершён" &&
              UserData.userData.position !== "Работник склада" && (
                <button
                  className={`${styles["purchase__button-submit"]} ${
                    styles["purchase__button-reorder"]
                  } ${
                    UserData.userData.position === "Менеджер" &&
                    styles["purchase__button-submit_disable"]
                  }`}
                  onClick={openLegitPopup}
                >
                  Не легит
                </button>
              )}
          </div>
        )}
      <ImagePopup
        isImagePopupOpen={isImagePopupOpen}
        currentImage={currentImage}
        closePopup={closeImagePopup}
      />
      {OrderData.order.status !== "Ожидает закупки" && (
        <SubmitPopup
          onSubmit={handlePurchaseSubmit}
          isSubmitPopup={isSubmitPopupOpen}
          closeSubmitPopup={closeSubmitPopup}
          submitText="Изменить данные заказа или товар закуплен"
        />
      )}
      {OrderData.order.status === "Ожидает закупки" && (
        <SubmitPopup
          onSubmit={handleAcceptPurchaseSubmit}
          isSubmitPopup={isSubmitPopupOpen}
          closeSubmitPopup={closeSubmitPopup}
          submitText="Изменить статус товара На закупке"
        />
      )}
      <SubmitPopup
        onSubmit={handleReorder}
        isSubmitPopup={isCancelPopupOpen}
        closeSubmitPopup={closeCancelPopup}
        submitText="Изменить статус товара Ожидает закупки"
      />
      <SubmitPopup
        onSubmit={handleNotLegit}
        isSubmitPopup={isLegitPopupOpen}
        closeSubmitPopup={closeLegitPopup}
        submitText="Товар не легит"
      />
      {uploading && <Preloader />}
    </form>
  );
};

export default Purchase;
