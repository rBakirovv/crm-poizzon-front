import React, { FC, useState } from "react";
import Dropzone from "react-dropzone";
import styles from "./OrderPay.module.css";
import { BASE_URL, BASE_URL_FRONT, MAX_SIZE } from "../../utils/constants";
import {
  deletePayProofImage,
  updateDeliveryData,
  updatePayProofImages,
  uploadImages,
} from "../../utils/Order";
import OrderData from "../../store/order";
import ImagePopup from "../ImagePopup/ImagePopup";
import TextInput from "../UI/TextInput/TextInput";
import { useRouter } from "next/router";

interface IOrderPayProps {}

const OrderPay: FC<IOrderPayProps> = () => {
  const router = useRouter();

  const [isDelivery, setIsDelivery] = useState<boolean>(false);

  const [uploading, setUploading] = useState<boolean>(false);

  const [isCopy, setIsCopy] = useState<boolean>(false);

  const [isImagePopupOpen, setIsImagePopupOpen] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>("");

  const [data, setData] = useState({
    name: "",
    phone: "",
    name_recipient: "",
    phone_recipient: "",
    delivery_method: "",
    delivery_address: "",
  });

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

  function openDelivery() {
    setIsDelivery(true);
  }

  function openImagePopup(imageSrc: string) {
    setCurrentImage(imageSrc);
    setIsImagePopupOpen(true);
  }

  function closeImagePopup() {
    setIsImagePopupOpen(false);
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
            payProofImages: OrderData.order.payProofImages.concat(data.data),
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
        .then(() => setUploading(false));
    } catch (error) {
      console.error(error);
    }

    await updatePayProofImages(
      OrderData.order._id,
      OrderData.order.payProofImages
    );
  };

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
          payProofImages: OrderData.order.payProofImages.filter(
            (imageItem) => imageItem.name !== imageName
          ),
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
        updatePayProofImages(
          OrderData.order._id,
          OrderData.order.payProofImages
        );
      })
      .catch(console.error);
  }

  function handleSubmitDeliveyData(e: React.SyntheticEvent) {
    e.preventDefault();

    updateDeliveryData(
      OrderData.order._id,
      data.name,
      data.name_recipient,
      data.phone,
      data.phone_recipient,
      data.delivery_method,
      data.delivery_address
    ).then(() => {
      router.replace(`/order/${router.query.orderPayId}`);
    });
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
  return (
    <section className={styles["order-pay"]}>
      <div className={styles["order-pay__container"]}>
        {!isDelivery && (
          <>
            <div className={styles["order-pay__payment-container"]}>
              <h4 className={styles["order-pay__title"]}>
                {OrderData.order.brand} {OrderData.order.model}
              </h4>
            </div>
            <div className={styles["order-pay__payment-container"]}>
              <h4 className={styles["order-pay__title"]}>Сумма оплаты</h4>
              <p className={styles["order-pay__text"]}>{totalPrice} ₽</p>
            </div>
            <div className={styles["order-pay__payment-container"]}>
              <h4 className={styles["order-pay__title"]}>Cпособ оплаты</h4>
              {OrderData.order.payment !== undefined && !result && (
                <>
                  <p className={styles["order-pay__text"]}>
                    {OrderData.order.payment}
                    <div
                      onClick={copyLink}
                      className={styles["order-change__public-link-text-copy"]}
                    >
                      {!isCopy ? "Скопировать" : "Cкопировано в буфер обмена"}{" "}
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
                    </div>
                  </p>
                </>
              )}
              {OrderData.order.payment !== undefined &&
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
            </div>
            <form>
              <h4 className={styles["order-pay__title"]}>
                Загрузите скриншот оплаты
              </h4>
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
              {OrderData.order.payProofImages.length === 0 &&
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
                    maxSize={MAX_SIZE}
                    multiple={false}
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
              <button
                type="button"
                className={`${styles["order-pay__pay-submit"]} ${
                  OrderData.order.payProofImages.length === 0 &&
                  styles["order-pay__pay-submit_disabled"]
                }`}
                disabled={OrderData.order.payProofImages.length === 0}
                onClick={openDelivery}
              >
                Готово
              </button>
            </form>
          </>
        )}
        {isDelivery && OrderData.order.status === "Черновик" && (
          <>
            <form className={styles["order-pay__form"]}>
              <h4 className={styles["order-pay__title"]}>
                {OrderData.order.brand} {OrderData.order.model}
              </h4>
              <TextInput
                name="name"
                label="Ваш Телеграм в формате @Telegram"
                value={data.name}
                handleChange={handleChange}
                readonly={OrderData.order.status !== "Черновик"}
                required={true}
              />
              <TextInput
                name="phone"
                label="Ваш номер телефона"
                value={data.phone}
                handleChange={handleChange}
                readonly={OrderData.order.status !== "Черновик"}
                required={true}
              />
              <TextInput
                name="name_recipient"
                label="ФИО получателя"
                value={data.name_recipient}
                handleChange={handleChange}
                readonly={OrderData.order.status !== "Черновик"}
                required={true}
              />
              <TextInput
                name="phone_recipient"
                label="Номер телефона получателя"
                value={data.phone_recipient}
                handleChange={handleChange}
                readonly={OrderData.order.status !== "Черновик"}
                required={true}
              />
              <div className={styles["order-pay__select-container"]}>
                <label>
                  Тип доставки<span className={styles["red-star"]}>*</span>
                </label>
                <select
                  className={styles["order-pay__select"]}
                  name="delivery_method"
                  onChange={handleChange}
                  disabled={OrderData.order.status !== "Черновик"}
                  required
                >
                  <option value="" selected disabled>
                    -- Выберите --
                  </option>
                  <option value="Самовывоз из пункта выдачи CDEK">
                    Самовывоз из пункта выдачи CDEK
                  </option>
                  <option value="Курьером CDEK">Курьером CDEK</option>
                </select>
              </div>
              {data.delivery_method === "Курьером CDEK" && (
                <TextInput
                  name="delivery_address"
                  label="Адрес доставки"
                  value={data.delivery_address}
                  handleChange={handleChange}
                  readonly={OrderData.order.status !== "Черновик"}
                  required={true}
                />
              )}
              {data.delivery_method === "Самовывоз из пункта выдачи CDEK" && (
                <TextInput
                  name="delivery_address"
                  label="Адрес ближайшего пункта выдачи СDEK"
                  value={data.delivery_address}
                  handleChange={handleChange}
                  readonly={OrderData.order.status !== "Черновик"}
                  required={true}
                />
              )}
              <span className={styles["order-pay__personal-data"]}>
                Нажимая кнопку "Отправить" вы соглашаетесь на обработку
                персональных данных
              </span>
              <button
                className={styles["order-pay__pay-submit"]}
                type="submit"
                onClick={handleSubmitDeliveyData}
              >
                Отправить
              </button>
            </form>
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
