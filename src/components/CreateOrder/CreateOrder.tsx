import { FC, useState } from "react";
import TextInput from "../UI/TextInput/TextInput";
import styles from "./CreateOrder.module.css";
import PromoCodeData from "../../store/promo-code";
import RateData from "../../store/rate";
import UserData from "../../store/user";
import OrderData from "../../store/order";
import { IOrderImages, IPayments } from "../../types/interfaces";
import Dropzone from "react-dropzone";
import { BASE_URL, MAX_SIZE } from "../../utils/constants";
import { createOrder, uploadImages } from "../../utils/Order";
import ImagePopup from "../ImagePopup/ImagePopup";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import { useRouter } from "next/router";

interface ICreateOrderProps {
  payments: Array<IPayments>;
}

const CreateOrder: FC<ICreateOrderProps> = ({ payments }) => {
  const router = useRouter();

  const [data, setData] = useState({
    link: "",
    category: "",
    subcategory: "",
    brand: "",
    model: "",
    size: "",
    payment: "",
    currentRate: RateData.rate.rate,
    priceCNY: "0",
    priceDeliveryChina: "0",
    priceDeliveryRussia: "0",
    commission: "0",
    promoCodePercent: 0,
    comment: "",
  });

  const [images, setImages] = useState<Array<IOrderImages>>([]);

  const [uploading, setUploading] = useState<boolean>(false);

  const [isSubmitPopup, setIsSubmitPopup] = useState<boolean>(false);

  const [currentImage, setCurrentImage] = useState<string>("");
  const [isImagePopupOpen, setIsImagePopupOpen] = useState<boolean>(false);

  const priceRub = Math.ceil(
    parseFloat(data.priceCNY) * parseFloat(data.currentRate)
  );
  const totalPrice = Math.ceil(
    priceRub +
      parseFloat(data.priceDeliveryChina) +
      parseFloat(data.priceDeliveryRussia) +
      parseFloat(data.commission)
  );

  const totalPriceWithPromo = Math.ceil(
    priceRub +
      parseFloat(data.priceDeliveryChina) +
      parseFloat(data.priceDeliveryRussia) +
      parseFloat(data.commission) -
      data.promoCodePercent
  );

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
        setImages(images.concat(data.data));
      });
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  function deleteImageHandler(imageName: string) {
    setImages(images.filter((item) => item.name !== imageName));
  }

  function openImagePopup(imageSrc: string) {
    setCurrentImage(imageSrc);
    setIsImagePopupOpen(true);
  }

  function closeImagePopup() {
    setIsImagePopupOpen(false);
  }

  function openSubmitPopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsSubmitPopup(true);
  }

  function closeSubmitPopup() {
    setIsSubmitPopup(false);
  }

  function handleSubmitCreate() {
    createOrder(
      UserData.userData.name,
      data.link,
      data.category,
      data.subcategory,
      data.brand,
      data.model,
      data.size,
      images,
      data.payment,
      RateData.rate.rate,
      data.priceCNY,
      data.priceDeliveryChina,
      data.priceDeliveryRussia,
      data.commission,
      data.promoCodePercent,
      data.comment
    )
      .then((order) => {
        OrderData.setOrder(order);
      })
      .then(() => {
        setData({
          link: "",
          category: "",
          subcategory: "",
          brand: "",
          model: "",
          size: "",
          payment: "",
          currentRate: RateData.rate.rate,
          priceCNY: "0",
          priceDeliveryChina: "0",
          priceDeliveryRussia: "0",
          commission: "0",
          promoCodePercent: 0,
          comment: "",
        });

        setImages([]);
        setUploading(false);
      })
      .then(() => {
        router.replace(`/order/change/${OrderData.order._id}`);
      });
  }

  return (
    <section className={styles["create-order"]}>
      <div className={styles["create-order__container"]}>
        <form
          onSubmit={openSubmitPopup}
          className={styles["order-change__order-form"]}
        >
          <h2 className={styles["order-change__order-title"]}>Заказ</h2>
          <TextInput
            name="link"
            label="Cсылка"
            value={data.link}
            handleChange={handleChange}
            required={true}
          />
          <div className={styles["order-change__input-container"]}>
            <label>
              Категория<span className={styles["red-star"]}>*</span>
            </label>
            <select
              className={`${styles["order-change__select"]}`}
              name="category"
              value={data.category}
              onChange={handleChange}
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
              className={`${styles["order-change__select"]}`}
              name="subcategory"
              value={data.subcategory}
              onChange={handleChange}
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
            value={data.brand}
            handleChange={handleChange}
            required={true}
          />
          <TextInput
            name="model"
            label="Модель"
            value={data.model}
            handleChange={handleChange}
            required={true}
          />
          <TextInput
            name="size"
            label="Размер"
            value={data.size}
            handleChange={handleChange}
            required={true}
          />
          <label>
            Изображения товара<span className={styles["red-star"]}>*</span>
          </label>
          <ul className={styles["order-change__images-list"]}>
            {images
              .slice()
              .reverse()
              .map((image) => {
                return (
                  <li
                    key={image.name}
                    className={styles["order-change__image"]}
                  >
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

                    <img
                      className={styles["order-change__image-item"]}
                      src={`${BASE_URL}${image.path}`}
                      alt={image.name}
                      crossOrigin="anonymous"
                      onClick={() => openImagePopup(`${BASE_URL}${image.path}`)}
                    />
                  </li>
                );
              })}
          </ul>
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
          <h2 className={styles["order-change__order-title"]}>Расчёт</h2>
          <div className={styles["order-change__input-container"]}>
            <label>
              Способ оплаты<span className={styles["red-star"]}>*</span>
            </label>
            <select
              className={`${styles["order-change__select"]}`}
              name="payment"
              value={data.payment}
              onChange={handleChange}
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
            value={data.currentRate}
            required={true}
            readonly={true}
          />
          <TextInput
            name="priceCNY"
            label="Цена CNY"
            value={data.priceCNY}
            handleChange={handleChange}
            required={true}
          />
          <TextInput
            name="priceRUB"
            label="Цена RUB"
            value={priceRub.toString()}
            required={true}
            readonly={true}
          />
          <TextInput
            name="priceDeliveryChina"
            label="Стоимость доставки POIZON - Cклад в Китае"
            value={data.priceDeliveryChina}
            handleChange={handleChange}
            required={true}
          />
          <TextInput
            name="priceDeliveryRussia"
            label="Стоимость доставки Cклад в Китае - Cклад в РФ"
            value={data.priceDeliveryRussia}
            handleChange={handleChange}
            required={true}
          />
          <TextInput
            name="commission"
            label="Комиссия сервиса"
            value={data.commission}
            handleChange={handleChange}
            required={true}
          />
          <div className={styles["order-change__input-container"]}>
            <label>Промо-код</label>
            <select
              className={`${styles["order-change__select"]}`}
              name="promoCodePercent"
              value={data.promoCodePercent > 0 ? data.promoCodePercent : ""}
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
            {data.promoCodePercent > 0 && (
              <span className={styles["order-change__promo-code_active"]}>
                Промо-код применён
              </span>
            )}
            {data.promoCodePercent === 0 && (
              <span className={styles["order-change__promo-code_not-active"]}>
                Промо-код НЕ применён
              </span>
            )}
          </div>
          <TextInput
            name="totalPrice"
            label="Общая стоимость"
            value={
              data.promoCodePercent > 0
                ? totalPriceWithPromo.toString()
                : totalPrice.toString()
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
              value={data.comment}
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
      <ImagePopup
        isImagePopupOpen={isImagePopupOpen}
        currentImage={currentImage}
        closePopup={closeImagePopup}
      />
      <SubmitPopup
        submitText="Создать заказ"
        isSubmitPopup={isSubmitPopup}
        closeSubmitPopup={closeSubmitPopup}
        onSubmit={handleSubmitCreate}
      />
    </section>
  );
};

export default CreateOrder;