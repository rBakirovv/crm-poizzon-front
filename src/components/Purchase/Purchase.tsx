import React, { useState } from "react";
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
} from "../../utils/Order";
import ImagePopup from "../ImagePopup/ImagePopup";
import SubmitPopup from "../SubmitPopup/SubmitPopup";

const Purchase = () => {
  const [data, setData] = useState({
    poizon_code: OrderData.order.poizonCode,
  });

  const [uploading, setUploading] = useState<boolean>(false);

  const [isImagePopupOpen, setIsImagePopupOpen] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>("");

  const [isSubmitPopupOpen, setIsSubmitPopupOpen] = useState<boolean>(false);
  const [isPurchasePopupOpen, setIsPurchasePopupOpen] =
    useState<boolean>(false);

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: value,
    });
  }

  function openSubmitPopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsSubmitPopupOpen(true);
  }

  function closeSubmitPopup() {
    setIsSubmitPopupOpen(false);
  }

  /*
  function closePurchasePopup() {
    setIsPurchasePopupOpen(false);
  }
  */

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
            buyAt: OrderData.order.buyAt,
            inChinaStockAt: OrderData.order.inChinaStockAt,
            orderId: OrderData.order.orderId,
            combinedOrder: OrderData.order.combinedOrder,
            status: OrderData.order.status,
            link: OrderData.order.link,
            category: OrderData.order.category,
            subcategory: OrderData.order.subcategory,
            brand: OrderData.order.brand,
            model: OrderData.order.model,
            size: OrderData.order.size,
            orderImages: OrderData.order.orderImages,
            payProofImages: OrderData.order.payProofImages,
            buyProofImages: OrderData.order.buyProofImages.concat(data.data),
            payment: OrderData.order.payment,
            currentRate: OrderData.order.currentRate,
            priceCNY: OrderData.order.priceCNY,
            priceDeliveryChina: OrderData.order.priceDeliveryChina,
            priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
            commission: OrderData.order.commission,
            promoCodePercent: OrderData.order.promoCodePercent,
            comment: OrderData.order.comment,
            poizonCode: OrderData.order.poizonCode,
            deliveryCode: OrderData.order.deliveryCode,
            deliveryName: OrderData.order.deliveryName,
            deliveryNameRecipient: OrderData.order.deliveryNameRecipient,
            deliveryPhone: OrderData.order.deliveryPhone,
            deliveryPhoneRecipient: OrderData.order.deliveryPhoneRecipient,
            deliveryMethod: OrderData.order.deliveryMethod,
            deliveryAddress: OrderData.order.deliveryAddress,
            __v: OrderData.order.__v,
          });
        })
        .then(() => setUploading(false));
    } catch (error) {
      console.error(error);
    }

    await updatePurchaseImages(
      OrderData.order._id,
      OrderData.order.buyProofImages
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
          buyAt: OrderData.order.buyAt,
          inChinaStockAt: OrderData.order.inChinaStockAt,
          orderId: OrderData.order.orderId,
          combinedOrder: OrderData.order.combinedOrder,
          status: OrderData.order.status,
          link: OrderData.order.link,
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
          payment: OrderData.order.payment,
          currentRate: OrderData.order.currentRate,
          priceCNY: OrderData.order.priceCNY,
          priceDeliveryChina: OrderData.order.priceDeliveryChina,
          priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
          commission: OrderData.order.commission,
          promoCodePercent: OrderData.order.promoCodePercent,
          comment: OrderData.order.comment,
          poizonCode: OrderData.order.poizonCode,
          deliveryCode: OrderData.order.deliveryCode,
          deliveryName: OrderData.order.deliveryName,
          deliveryNameRecipient: OrderData.order.deliveryNameRecipient,
          deliveryPhone: OrderData.order.deliveryPhone,
          deliveryPhoneRecipient: OrderData.order.deliveryPhoneRecipient,
          deliveryMethod: OrderData.order.deliveryMethod,
          deliveryAddress: OrderData.order.deliveryAddress,
          __v: OrderData.order.__v,
        });
      })
      .then(() => {
        updatePurchaseImages(
          OrderData.order._id,
          OrderData.order.buyProofImages
        );
      })
      .catch(console.error);
  }

  function handlePurchaseSubmit() {
    if (OrderData.order.buyProofImages.length !== 0) {
      updatePurchaseData(OrderData.order._id, data.poizon_code)
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

  return (
    <form onSubmit={openSubmitPopup} className={styles["purchase"]}>
      <TextInput
        label="Номер отправки Poizon"
        name="poizon_code"
        value={data.poizon_code}
        handleChange={handleChange}
        required={false}
      />
      {!(
        OrderData.order.status === "Черновик" ||
        OrderData.order.status === "Проверка оплаты" ||
        OrderData.order.status === "Ожидает закупки"
      ) && <p>Скриншоты чеков закупки</p>}
      <ul className={styles["purchase__images-list"]}>
        {OrderData.order.buyProofImages.length > 0 &&
          OrderData.order.buyProofImages
            .slice()
            .reverse()
            .map((image) => {
              return (
                <li key={image.name} className={styles["purchase__image"]}>
                  {OrderData.order.status === "На закупке" && (
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
        UserData.userData.position !== "Менеджер" && (
          <Dropzone
            onDrop={(e: any) =>
              uploadFileHandler(e, "/order-purchase", setUploading)
            }
            maxSize={MAX_SIZE}
            multiple={true}
          >
            {({ getRootProps, getInputProps }) => (
              <div className={styles["drag-n-drop-container"]}>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p className={styles["drag-n-drop-text"]}>
                    Добавить фото
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
      <div
        className={`${styles["purchase__buttons-container"]} ${
          UserData.userData.position === "Менеджер" &&
          styles["purchase__button-submit_disable"]
        }`}
      >
        {OrderData.order.status === "Ожидает закупки" &&
          UserData.userData.position !== "Менеджер" && (
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
        {OrderData.order.status !== "Ожидает закупки" && (
          <button
            className={`${styles["purchase__button-submit"]} ${
              UserData.userData.position === "Менеджер" &&
              styles["purchase__button-submit_disable"]
            }`}
            type="submit"
          >
            Сохранить
          </button>
        )}
      </div>
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
    </form>
  );
};

export default Purchase;
