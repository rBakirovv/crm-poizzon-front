import { FC, useEffect, useState } from "react";
import TextInput from "../UI/TextInput/TextInput";
import styles from "./CreateOrder.module.css";
import PromoCodeData from "../../store/promo-code";
import RateData from "../../store/rate";
import UserData from "../../store/user";
import OrderData from "../../store/order";
import CommissionData from "../../store/commission";
import { IOrderImages, IPayments } from "../../types/interfaces";
import Dropzone from "react-dropzone";
import { BASE_URL, BASE_URL_FRONT, MAX_SIZE } from "../../utils/constants";
import {
  addPayLink,
  addPayLinkSplit,
  addPayLinkSplitSecond,
  createOrder,
  createOrderSplit,
  deleteDraftImage,
  updateOrderDraft,
  uploadImages,
} from "../../utils/Order";
import ImagePopup from "../ImagePopup/ImagePopup";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import { useRouter } from "next/router";
import Preloader from "../UI/Preloader/Preloader";
import { createPayLink } from "../../utils/PaySystem";

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
    commission: CommissionData.commission.commission,
    promoCodePercent: 0,
    comment: "",
  });

  const [images, setImages] = useState<Array<IOrderImages>>([]);

  const [uploading, setUploading] = useState<boolean>(false);

  const [isSubmitPopup, setIsSubmitPopup] = useState<boolean>(false);

  const [currentImage, setCurrentImage] = useState<string>("");
  const [isImagePopupOpen, setIsImagePopupOpen] = useState<boolean>(false);

  const [isDrag, setIsDrag] = useState(false);

  const [isReorder, setIsReorder] = useState(false);

  const priceRub = Math.ceil(
    parseFloat(data.priceCNY) * parseFloat(RateData.rate.rate)
  );
  const totalPrice = Math.ceil(
    priceRub +
      parseFloat(data.priceDeliveryChina) +
      parseFloat(data.priceDeliveryRussia) +
      parseFloat(data.commission) -
      data.promoCodePercent
  );

  const totalPriceWithPromo = Math.ceil(
    priceRub +
      parseFloat(data.priceDeliveryChina) +
      parseFloat(data.priceDeliveryRussia) +
      parseFloat(data.commission) -
      data.promoCodePercent
  );

  function dragHandler() {
    setIsDrag(true);
  }

  function dragLeaveHandler() {
    setIsDrag(false);
  }

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: value,
    });

    if (target.value === "Кроссовки") {
      setData({
        ...data,
        subcategory: "Кроссовки",
        priceDeliveryRussia: CommissionData.commission.sneakersRussia,
        priceDeliveryChina: CommissionData.commission.sneakersChina,
      });
    }

    if (target.value === "Зимняя обувь") {
      setData({
        ...data,
        subcategory: "Зимняя обувь",
        priceDeliveryRussia: CommissionData.commission.winterShoesRussia,
        priceDeliveryChina: CommissionData.commission.winterShoesChina,
      });
    }

    if (target.value === "Куртка") {
      setData({
        ...data,
        subcategory: "Куртка",
        priceDeliveryRussia: CommissionData.commission.jacketRussia,
        priceDeliveryChina: CommissionData.commission.jacketChina,
      });
    }

    if (target.value === "Толстовка") {
      setData({
        ...data,
        subcategory: "Толстовка",
        priceDeliveryRussia: CommissionData.commission.sweatshirtRussia,
        priceDeliveryChina: CommissionData.commission.sweatshirtChina,
      });
    }

    if (target.value === "Футболка") {
      setData({
        ...data,
        subcategory: "Футболка",
        priceDeliveryRussia: CommissionData.commission.tShirtRussia,
        priceDeliveryChina: CommissionData.commission.tShirtChina,
      });
    }

    if (target.value === "Носки") {
      setData({
        ...data,
        subcategory: "Носки",
        priceDeliveryRussia: CommissionData.commission.socksRussia,
        priceDeliveryChina: CommissionData.commission.socksChina,
      });
    }

    if (target.value === "Сумка") {
      setData({
        ...data,
        subcategory: "Сумка",
        priceDeliveryRussia: CommissionData.commission.bagRussia,
        priceDeliveryChina: CommissionData.commission.bagChina,
      });
    }

    if (target.value === "Духи") {
      setData({
        ...data,
        subcategory: "Духи",
        priceDeliveryRussia: CommissionData.commission.perfumeRussia,
        priceDeliveryChina: CommissionData.commission.perfumeChina,
      });
    }

    if (target.value === "Штаны") {
      setData({
        ...data,
        subcategory: "Штаны",
        priceDeliveryRussia: CommissionData.commission.pantsRussia,
        priceDeliveryChina: CommissionData.commission.pantsChina,
      });
    }

    if (target.value === "Головной убор") {
      setData({
        ...data,
        subcategory: "Головной убор",
        priceDeliveryRussia: CommissionData.commission.headdressRussia,
        priceDeliveryChina: CommissionData.commission.headdressChina,
      });
    }

    if (target.value === "Техника") {
      setData({
        ...data,
        subcategory: "Техника",
        priceDeliveryRussia: CommissionData.commission.techniqueRussia,
        priceDeliveryChina: CommissionData.commission.techniqueChina,
      });
    }

    if (target.value === "Прочее") {
      setData({
        ...data,
        subcategory: "Прочее",
        priceDeliveryRussia: CommissionData.commission.otherRussia,
        priceDeliveryChina: CommissionData.commission.otherChina,
      });
    }
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
        setUploading(false);
        dragLeaveHandler();
      });
    } catch (error) {
      console.error(error);
      setUploading(false);
      dragLeaveHandler();
    }
  };

  function deleteImageHandler(imageName: string) {
    deleteDraftImage(imageName, OrderData.order._id);

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
    if (data.payment === "Сплит -") {
      createOrderSplit(
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
        data.comment,
        isReorder
      )
        .then((order) => {
          OrderData.setOrder(order);
          return order;
        })
        .then((order) => {
          createPayLink(
            order.orderId.toString(),
            totalPrice,
            `${BASE_URL_FRONT}/order/${order._id}`,
            `${BASE_URL}/pay/link/${order._id}`
          )
            .then((payment) => {
              if (payment.data.id) {
                updateOrderDraft(
                  order._id,
                  order.link,
                  payment.data.attributes.url,
                  payment.data.attributes.uuid,
                  "",
                  "",
                  "",
                  "",
                  order.category,
                  order.subcategory,
                  order.brand,
                  order.model,
                  order.size,
                  order.payment,
                  order.priceCNY,
                  order.priceDeliveryChina,
                  order.priceDeliveryRussia,
                  order.commission,
                  order.promoCodePercent,
                  order.comment
                )
                  .then((orderUpdated) => {
                    createPayLink(
                      order.orderId.toString(),
                      Math.ceil(totalPrice / 2),
                      `${BASE_URL_FRONT}/order/${order._id}`,
                      `${BASE_URL}/pay/link/${order._id}`
                    )
                      .then((splitPayment) => {
                        if (splitPayment.data.id) {
                          updateOrderDraft(
                            order._id,
                            order.link,
                            orderUpdated.payLink,
                            orderUpdated.paymentUUID,
                            splitPayment.data.attributes.url,
                            splitPayment.data.attributes.uuid,
                            "",
                            "",
                            order.category,
                            order.subcategory,
                            order.brand,
                            order.model,
                            order.size,
                            order.payment,
                            order.priceCNY,
                            order.priceDeliveryChina,
                            order.priceDeliveryRussia,
                            order.commission,
                            order.promoCodePercent,
                            order.comment
                          )
                            .then((orderUpdatedSecond) => {
                              createPayLink(
                                order.orderId.toString(),
                                Math.ceil(totalPrice / 2),
                                `${BASE_URL_FRONT}/order/${order._id}`,
                                `${BASE_URL}/pay/link/${order._id}`
                              )
                                .then((splitPaymentSecond) => {
                                  if (splitPaymentSecond.data.id) {
                                    updateOrderDraft(
                                      order._id,
                                      order.link,
                                      orderUpdated.payLink,
                                      orderUpdated.paymentUUID,
                                      orderUpdatedSecond.payLinkSplit,
                                      orderUpdatedSecond.paymentUUIDSplit,
                                      splitPaymentSecond.data.attributes.url,
                                      splitPaymentSecond.data.attributes.uuid,
                                      order.category,
                                      order.subcategory,
                                      order.brand,
                                      order.model,
                                      order.size,
                                      order.payment,
                                      order.priceCNY,
                                      order.priceDeliveryChina,
                                      order.priceDeliveryRussia,
                                      order.commission,
                                      order.promoCodePercent,
                                      order.comment
                                    )
                                      .then(() => {
                                        addPayLink(
                                          order._id,
                                          payment.data.attributes.url
                                        ).catch((err) => {
                                          console.log(err);
                                        });
                                      })
                                      .then(() => {
                                        addPayLinkSplit(
                                          order._id,
                                          splitPayment.data.attributes.url
                                        ).catch((err) => {
                                          console.log(err);
                                        });
                                      })
                                      .then(() => {
                                        addPayLinkSplitSecond(
                                          order._id,
                                          splitPaymentSecond.data.attributes.url
                                        ).catch((err) => {
                                          console.log(err);
                                        });
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
                                        router.replace(
                                          `/order/change/${OrderData.order._id}`
                                        );
                                      })
                                      .catch((err) => {
                                        console.log(err);
                                      });
                                  }
                                })
                                .catch((err) => {
                                  console.log(err);
                                });
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
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
        data.comment,
        isReorder
      )
        .then((order) => {
          OrderData.setOrder(order);

          if (data.payment === "Перейти по ссылке -") {
            createPayLink(
              order.orderId.toString(),
              totalPrice,
              `${BASE_URL_FRONT}/order/${order._id}`,
              `${BASE_URL}/pay/link/${order._id}`
            )
              .then((paymentFullPrice) => {
                if (paymentFullPrice.data.id) {
                  updateOrderDraft(
                    order._id,
                    order.link,
                    paymentFullPrice.data.attributes.url,
                    paymentFullPrice.data.attributes.uuid,
                    "",
                    "",
                    "",
                    "",
                    order.category,
                    order.subcategory,
                    order.brand,
                    order.model,
                    order.size,
                    order.payment,
                    order.priceCNY,
                    order.priceDeliveryChina,
                    order.priceDeliveryRussia,
                    order.commission,
                    order.promoCodePercent,
                    order.comment
                  )
                    .then(() => {
                      addPayLink(
                        order._id,
                        paymentFullPrice.data.attributes.url
                      )
                        .then((orderUpdated) => {
                          OrderData.setOrder(orderUpdated);
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
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
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  useEffect(() => {
    if (data.priceCNY.length > 1) {
      if (data.priceCNY[0] === "0" && data.priceCNY[1] !== ".") {
        setData({
          link: data.link,
          category: "",
          subcategory: data.subcategory,
          brand: "",
          model: data.model,
          size: data.size,
          payment: data.payment,
          currentRate: RateData.rate.rate,
          priceCNY: "0",
          priceDeliveryChina: data.priceDeliveryChina,
          priceDeliveryRussia: data.priceDeliveryRussia,
          commission: data.commission,
          promoCodePercent: data.promoCodePercent,
          comment: data.comment,
        });
      }
    }

    if (data.priceDeliveryChina.length > 1) {
      if (
        data.priceDeliveryChina[0] === "0" &&
        data.priceDeliveryChina[1] !== "."
      ) {
        setData({
          link: data.link,
          category: "",
          subcategory: data.subcategory,
          brand: "",
          model: data.model,
          size: data.size,
          payment: data.payment,
          currentRate: RateData.rate.rate,
          priceCNY: data.priceCNY,
          priceDeliveryChina: "0",
          priceDeliveryRussia: data.priceDeliveryRussia,
          commission: data.commission,
          promoCodePercent: data.promoCodePercent,
          comment: data.comment,
        });
      }
    }

    if (data.priceDeliveryRussia.length > 1) {
      if (
        data.priceDeliveryRussia[0] === "0" &&
        data.priceDeliveryRussia[1] !== "."
      ) {
        setData({
          link: data.link,
          category: "",
          subcategory: data.subcategory,
          brand: "",
          model: data.model,
          size: data.size,
          payment: data.payment,
          currentRate: RateData.rate.rate,
          priceCNY: data.priceCNY,
          priceDeliveryChina: data.priceDeliveryChina,
          priceDeliveryRussia: "0",
          commission: data.commission,
          promoCodePercent: data.promoCodePercent,
          comment: data.comment,
        });
      }
    }

    if (data.commission.length > 1) {
      if (data.commission[0] === "0" && data.commission[1] !== ".") {
        setData({
          link: data.link,
          category: "",
          subcategory: data.subcategory,
          brand: "",
          model: data.model,
          size: data.size,
          payment: data.payment,
          currentRate: RateData.rate.rate,
          priceCNY: data.priceCNY,
          priceDeliveryChina: data.priceDeliveryChina,
          priceDeliveryRussia: data.priceDeliveryRussia,
          commission: "0",
          promoCodePercent: data.promoCodePercent,
          comment: data.comment,
        });
      }
    }
  }, [
    data.priceCNY,
    data.priceDeliveryChina,
    data.priceDeliveryRussia,
    data.commission,
  ]);

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
              await uploadImages(formData, "/order-images").then((data) => {
                setImages(images.concat(data.data));
                setUploading(false);
                dragLeaveHandler();
              });
            } catch (error) {
              console.error(error);
              setUploading(false);
              dragLeaveHandler();
            }
          }
        }
      }
    }
  }

  const sortCards = (a: IPayments, b: IPayments) => {
    if (a.paymentOrder > b.paymentOrder) {
      return 1;
    } else {
      return -1;
    }
  };

  function reorderHandler() {
    setIsReorder(!isReorder);
  }

  useEffect(() => {
    document.addEventListener("paste", pasteHandler);
    return () => document.removeEventListener("paste", pasteHandler);
  }, []);

  return (
    <section className={styles["create-order"]}>
      {uploading && <Preloader />}
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
              <option value="Духи">Духи</option>
              <option value="Штаны">Штаны</option>
              <option value="Головной убор">Головной убор</option>
              <option value="Техника">Техника</option>
              <option value="Прочее">Прочее</option>
            </select>
          </div>
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
            onDragEnter={dragHandler}
            onDragLeave={dragLeaveHandler}
            maxSize={MAX_SIZE}
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
              {payments.sort(sortCards).map((paymentItem) => {
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
            value={RateData.rate.rate}
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
          <div className={styles["order-change__reorder-checkbox"]}>
            <input
              type="checkbox"
              checked={isReorder}
              onChange={reorderHandler}
            />
            <label>Перезаказ</label>
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
