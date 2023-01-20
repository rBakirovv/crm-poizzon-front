import React, { FC, useEffect, useState } from "react";
import { BASE_URL_FRONT } from "../../utils/constants";
import TextInput from "../UI/TextInput/TextInput";
import styles from "./OrderChange.styles.module.css";
import { IPayments } from "../../types/interfaces";
import OrderData from "../../store/order";
import PromoCodeData from "../../store/promo-code";
import {
  updateOrderDraft,
  updateOrderImages,
  uploadImages,
  deleteOrderImage,
} from "../../utils/Order";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import { BASE_URL } from "../../utils/constants";
import Dropzone from "react-dropzone";
import ImagePopup from "../ImagePopup/ImagePopup";
import AcceptPayment from "../AcceptPayment/AcceptPayment";
import Client from "../Client/Client";
import Purchase from "../Purchase/Purchase";
import Delivery from "../Delivery/Delivery";

interface IOrderChangeProps {
  payments: Array<IPayments>;
}

const OrderChange: FC<IOrderChangeProps> = ({ payments }) => {
  const [data, setData] = useState({
    _id: OrderData.order._id,
    link: OrderData.order.link,
    category: OrderData.order.category,
    subcategory: OrderData.order.subcategory,
    brand: OrderData.order.brand,
    model: OrderData.order.model,
    size: OrderData.order.size,
    payment: OrderData.order.payment,
    priceCNY: OrderData.order.priceCNY,
    priceDeliveryChina: OrderData.order.priceDeliveryChina,
    priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
    commission: OrderData.order.commission,
    promoCodePercent: OrderData.order.promoCodePercent,
    comment: OrderData.order.comment,
  });

  const [orderСhapter, setOrderСhapter] = useState<string>("Order");

  const [isSubmitPopup, setIsSubmitPopup] = useState<boolean>(false);

  const [uploading, setUploading] = useState<boolean>(false);

  const [isImagePopupOpen, setIsImagePopupOpen] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>("");

  const priceRub = Math.ceil(
    parseFloat(OrderData.order.priceCNY) *
      parseFloat(OrderData.order.currentRate)
  );
  const totalPrice = Math.ceil(
    priceRub +
      parseFloat(OrderData.order.priceDeliveryChina) +
      parseFloat(OrderData.order.priceDeliveryRussia) +
      parseFloat(OrderData.order.commission)
  );
  const totalPriceWithPromo = Math.ceil(
    priceRub +
      parseFloat(OrderData.order.priceDeliveryChina) +
      parseFloat(OrderData.order.priceDeliveryRussia) +
      parseFloat(OrderData.order.commission) -
      data.promoCodePercent
  );

  const MAX_SIZE = 5242880;

  data._id !== OrderData.order._id &&
    setData({
      _id: OrderData.order._id,
      link: OrderData.order.link,
      category: OrderData.order.category,
      subcategory: OrderData.order.subcategory,
      brand: OrderData.order.brand,
      model: OrderData.order.model,
      size: OrderData.order.size,
      payment: OrderData.order.payment,
      priceCNY: OrderData.order.priceCNY,
      priceDeliveryChina: OrderData.order.priceDeliveryChina,
      priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
      commission: OrderData.order.commission,
      promoCodePercent: OrderData.order.promoCodePercent,
      comment: OrderData.order.comment,
    });

  function openImagePopup(imageSrc: string) {
    setCurrentImage(imageSrc);
    setIsImagePopupOpen(true);
  }

  function closeImagePopup() {
    setIsImagePopupOpen(false);
  }

  function closeSubmitPopup() {
    setIsSubmitPopup(false);
  }

  function openSubmitPopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsSubmitPopup(true);
  }

  function openOrder() {
    setOrderСhapter("Order");
  }

  function openPayment() {
    setOrderСhapter("Pay");
  }

  function openClientData() {
    setOrderСhapter("Client");
  }

  function openPurchaseData() {
    setOrderСhapter("Purchase");
  }

  function openDelivery() {
    setOrderСhapter("Delivery");
  }

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: value,
    });
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
      formData.append("imagesUp", e.target.files[0]);
    }

    setUploading(true);

    try {
      await uploadImages(formData, folder).then((data) => {
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
          orderImages: OrderData.order.orderImages.concat(data.data),
          payProofImages: OrderData.order.payProofImages,
          buyProofImages: OrderData.order.buyProofImages,
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
      });
    } catch (error) {
      console.error(error);
      setUploading(false);
    }

    await updateOrderImages(OrderData.order._id, OrderData.order.orderImages);
  };

  function deleteImageHandler(imageName: string) {
    deleteOrderImage(imageName, OrderData.order._id)
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
          orderImages: OrderData.order.orderImages.filter(
            (imageItem) => imageItem.name !== imageName
          ),
          payProofImages: OrderData.order.payProofImages,
          buyProofImages: OrderData.order.buyProofImages,
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
        updateOrderImages(OrderData.order._id, OrderData.order.orderImages);
      })
      .catch(console.error);
  }

  function handleSubmitUpdate() {
    updateOrderDraft(
      OrderData.order._id,
      OrderData.order.link,
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

    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth",
    });
  }

  useEffect(() => {
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
      link: data.link,
      category: data.category,
      subcategory: data.subcategory,
      brand: data.brand,
      model: data.model,
      size: data.size,
      orderImages: OrderData.order.orderImages,
      payProofImages: OrderData.order.payProofImages,
      buyProofImages: OrderData.order.buyProofImages,
      payment: data.payment,
      currentRate: OrderData.order.currentRate,
      priceCNY: data.priceCNY,
      priceDeliveryChina: data.priceDeliveryChina,
      priceDeliveryRussia: data.priceDeliveryRussia,
      commission: data.commission,
      promoCodePercent: data.promoCodePercent,
      comment: data.comment,
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
  }, [data]);

  return (
    <section className={styles["order-change"]}>
      <h2 className={styles["order-change__title"]}>
        Заказ #{OrderData.order.orderId}
      </h2>
      <p className={styles["order-change__status"]}>
        Статус: {OrderData.order.status}
      </p>
      <div className={styles["order-change__nav-bar"]}>
        <p
          className={`${styles["order-change__nav-item"]} ${
            orderСhapter === "Order" && styles["order-change__nav-item_active"]
          }`}
          onClick={openOrder}
        >
          Заказ
        </p>
        <p
          className={`${styles["order-change__nav-item"]} ${
            orderСhapter === "Pay" && styles["order-change__nav-item_active"]
          }`}
          onClick={openPayment}
        >
          Оплата
        </p>
        <p
          className={`${styles["order-change__nav-item"]} ${
            orderСhapter === "Client" && styles["order-change__nav-item_active"]
          }`}
          onClick={openClientData}
        >
          Клиент
        </p>
        <p
          className={`${styles["order-change__nav-item"]} ${
            orderСhapter === "Purchase" &&
            styles["order-change__nav-item_active"]
          }`}
          onClick={openPurchaseData}
        >
          Закупка
        </p>
        <p
          className={`${styles["order-change__nav-item"]} ${
            orderСhapter === "Delivery" &&
            styles["order-change__nav-item_active"]
          }`}
          onClick={openDelivery}
        >
          Доставка
        </p>
      </div>
      {orderСhapter === "Order" && (
        <div className={styles["order-change__order-container"]}>
          <div className={styles["order-change__public-link-container"]}>
            <p className={styles["order-change__public-link-text"]}>
              Публичная ссылка
            </p>
            <a
              className={styles["order-change__public-link"]}
              href={`${BASE_URL_FRONT}/order/${OrderData.order._id}`}
              target="_blank"
              rel="noreferrer"
            >
              {BASE_URL_FRONT}/order/{OrderData.order._id}
            </a>
          </div>
          <form
            onSubmit={openSubmitPopup}
            className={styles["order-change__order-form"]}
          >
            <h2 className={styles["order-change__order-title"]}>Товар</h2>
            <TextInput
              name="link"
              label="Cсылка"
              value={OrderData.order.link}
              handleChange={handleChange}
              readonly={OrderData.order.status !== "Черновик"}
              required={true}
            />
            <div className={styles["order-change__input-container"]}>
              <label>
                Категория<span className={styles["red-star"]}>*</span>
              </label>
              <select
                className={`${styles["order-change__select"]} ${
                  OrderData.order.status !== "Черновик" &&
                  styles["order-change__select_disabled"]
                }`}
                name="category"
                value={OrderData.order.category}
                onChange={handleChange}
                disabled={OrderData.order.status !== "Черновик"}
                required
              >
                <option value="" selected disabled>
                  -- Выберите --
                </option>
                <option value="Обувь">Обувь</option>
                <option value="Одежда">Одежда</option>
                <option value="Аксесуары">Аксесуары</option>
                <option value="Прочее">Прочее</option>
              </select>
            </div>
            <div className={styles["order-change__input-container"]}>
              <label>
                Подкатегория<span className={styles["red-star"]}>*</span>
              </label>
              <select
                className={`${styles["order-change__select"]} ${
                  OrderData.order.status !== "Черновик" &&
                  styles["order-change__select_disabled"]
                }`}
                name="subcategory"
                value={OrderData.order.subcategory}
                onChange={handleChange}
                disabled={OrderData.order.status !== "Черновик"}
                required
              >
                <option value="" selected disabled>
                  -- Выберите --
                </option>
                <option value="Кроссовки">Кроссовки</option>
                <option value="Зимняя обувь">Зимняя обувь</option>
                <option value="Куртка">Куртка</option>
                <option value="Толстовка">Толстовка</option>
                <option value="Футболка">Футболка</option>
                <option value="Носки">Носки</option>
                <option value="Сумка">Сумка</option>
                <option value="Техника">Техника</option>
                <option value="Прочее">Прочее</option>
              </select>
            </div>
            <TextInput
              name="brand"
              label="Брэнд"
              value={OrderData.order.brand}
              handleChange={handleChange}
              readonly={OrderData.order.status !== "Черновик"}
              required={true}
            />
            <TextInput
              name="model"
              label="Модель"
              value={OrderData.order.model}
              handleChange={handleChange}
              readonly={OrderData.order.status !== "Черновик"}
              required={true}
            />
            <TextInput
              name="size"
              label="Размер"
              value={OrderData.order.size}
              handleChange={handleChange}
              readonly={OrderData.order.status !== "Черновик"}
              required={true}
            />
            <label>
              Изображения товара<span className={styles["red-star"]}>*</span>
            </label>
            <ul className={styles["order-change__images-list"]}>
              {OrderData.order.orderImages
                .slice()
                .reverse()
                .map((image) => {
                  return (
                    <li
                      key={image.name}
                      className={styles["order-change__image"]}
                    >
                      {OrderData.order.status === "Черновик" && (
                        <div
                          className={styles["order-change__delete-image"]}
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
                        className={styles["order-change__image-item"]}
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
            {OrderData.order.status === "Черновик" && (
              <Dropzone
                onDrop={(e: any) =>
                  uploadFileHandler(e, "/order-images", setUploading)
                }
                maxSize={MAX_SIZE}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className={styles["drag-n-drop-container"]}>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p className={styles["drag-n-drop-text"]}>
                        Добавить фото{" "}
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
            <h2 className={styles["order-change__order-title"]}>Расчёт</h2>
            <div className={styles["order-change__input-container"]}>
              <label>
                Способ оплаты<span className={styles["red-star"]}>*</span>
              </label>
              <select
                className={`${styles["order-change__select"]} ${
                  OrderData.order.status !== "Черновик" &&
                  styles["order-change__select_disabled"]
                }`}
                name="payment"
                value={OrderData.order.payment}
                onChange={handleChange}
                disabled={OrderData.order.status !== "Черновик"}
                required
              >
                <option value="" selected disabled>
                  -- Выберите --
                </option>
                {payments.map((paymentItem) => {
                  return (
                    <option
                      key={paymentItem._id}
                      value={`${paymentItem.title} ${paymentItem.number}`}
                    >
                      {paymentItem.title} {paymentItem.number}
                    </option>
                  );
                })}
              </select>
            </div>
            <TextInput
              name="currentRate"
              label="Курс RUB/CNY"
              value={OrderData.order.currentRate}
              required={true}
              readonly={true}
            />
            <TextInput
              name="priceCNY"
              label="Цена CNY"
              value={OrderData.order.priceCNY}
              handleChange={handleChange}
              readonly={OrderData.order.status !== "Черновик"}
              required={true}
            />
            <TextInput
              name="priceRUB"
              label="Цена RUB"
              value={priceRub.toFixed(2).toString()}
              required={true}
              readonly={true}
            />
            <TextInput
              name="priceDeliveryChina"
              label="Стоимость доставки POIZON - Cклад в Китае"
              value={OrderData.order.priceDeliveryChina}
              handleChange={handleChange}
              readonly={OrderData.order.status !== "Черновик"}
              required={true}
            />
            <TextInput
              name="priceDeliveryRussia"
              label="Стоимость доставки Cклад в Китае - Cклад в РФ"
              value={OrderData.order.priceDeliveryRussia}
              handleChange={handleChange}
              readonly={OrderData.order.status !== "Черновик"}
              required={true}
            />
            <TextInput
              name="commission"
              label="Комиссия сервиса"
              value={OrderData.order.commission}
              handleChange={handleChange}
              readonly={OrderData.order.status !== "Черновик"}
              required={true}
            />
            <div className={styles["order-change__input-container"]}>
              <label>Промо-код</label>
              <select
                className={`${styles["order-change__select"]} ${
                  (OrderData.order.status !== "Черновик" ||
                    OrderData.order.promoCodePercent > 0) &&
                  styles["order-change__select_disabled"]
                }`}
                name="promoCodePercent"
                disabled={
                  data.promoCodePercent > 0 ||
                  OrderData.order.promoCodePercent > 0
                }
                value={
                  data.promoCodePercent > 0 ||
                  OrderData.order.promoCodePercent > 0
                    ? OrderData.order.promoCodePercent
                    : ""
                }
                onChange={handleChange}
              >
                <option value="" selected disabled>
                  -- Выберите --
                </option>
                {PromoCodeData.promoCodeList.map((promoCodeItem) => {
                  return (
                    <option
                      key={promoCodeItem._id}
                      value={`${promoCodeItem.percent}`}
                    >
                      {promoCodeItem.code} {promoCodeItem.percent}₽
                    </option>
                  );
                })}
              </select>
              {OrderData.order.promoCodePercent > 0 && (
                <span className={styles["order-change__promo-code_active"]}>
                  Промо-код применён
                </span>
              )}
              {OrderData.order.promoCodePercent === 0 && (
                <span className={styles["order-change__promo-code_not-active"]}>
                  Промо-код НЕ применён
                </span>
              )}
            </div>
            <TextInput
              name="totalPrice"
              label="Общая стоимость"
              value={
                data.promoCodePercent > 0 ||
                OrderData.order.promoCodePercent > 0
                  ? totalPriceWithPromo.toFixed(2).toString()
                  : totalPrice.toFixed(2).toString()
              }
              required={true}
              readonly={true}
            />
            <div className={styles["order-change__input-container"]}>
              <label>Комментарий</label>
              <textarea
                className={`${styles["order-change__textarea"]}`}
                name="comment"
                onChange={handleChange}
                value={OrderData.order.comment}
              ></textarea>
            </div>
            <button
              className={`${styles["order-change__order-submit"]}`}
              type="submit"
            >
              Cохранить
            </button>
          </form>
        </div>
      )}
      {orderСhapter === "Pay" && <AcceptPayment />}
      {orderСhapter === "Client" && <Client />}
      {orderСhapter === "Purchase" && <Purchase />}
      {orderСhapter === "Delivery" && <Delivery />}
      <ImagePopup
        isImagePopupOpen={isImagePopupOpen}
        currentImage={currentImage}
        closePopup={closeImagePopup}
      />
      <SubmitPopup
        submitText="Обновить данные в заказе"
        isSubmitPopup={isSubmitPopup}
        closeSubmitPopup={closeSubmitPopup}
        onSubmit={handleSubmitUpdate}
      />
    </section>
  );
};

export default OrderChange;
