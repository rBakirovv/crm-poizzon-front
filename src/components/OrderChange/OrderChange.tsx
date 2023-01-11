import React, { FC, useEffect, useState } from "react";
import { BASE_URL_FRONT } from "../../utils/constants";
import TextInput from "../UI/TextInput/TextInput";
import styles from "./OrderChange.styles.module.css";
import { IOrder, IPayments } from "../../types/interfaces";
import OrderData from "../../store/order";
import PromoCodeData from "../../store/promo-code";
import { updateOrderDraft } from "../../utils/Order";
import SubmitPopup from "../SubmitPopup/SubmitPopup";

interface IOrderChangeProps {
  order: IOrder;
  payments: Array<IPayments>;
}

const OrderChange: FC<IOrderChangeProps> = ({ order, payments }) => {
  const [data, setData] = useState({
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

  const priceRub =
    parseFloat(OrderData.order.priceCNY) *
    parseFloat(OrderData.order.currentRate);
  const totalPrice =
    priceRub +
    parseFloat(OrderData.order.priceDeliveryChina) +
    parseFloat(OrderData.order.priceDeliveryRussia) +
    parseFloat(OrderData.order.commission);
  const totalPriceWithPromo =
    (priceRub +
      parseFloat(OrderData.order.priceDeliveryChina) +
      parseFloat(OrderData.order.priceDeliveryRussia) +
      parseFloat(OrderData.order.commission)) *
    ((100 - data.promoCodePercent) / 100);

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
  }

  useEffect(() => {
    OrderData.setOrder({
      _id: OrderData.order._id,
      creater: OrderData.order.creater,
      createdAt: OrderData.order.createdAt,
      overudeAfter: OrderData.order.overudeAfter,
      orderId: OrderData.order.orderId,
      status: OrderData.order.status,
      link: data.link,
      category: data.category,
      subcategory: data.subcategory,
      brand: data.brand,
      model: data.model,
      size: data.size,
      // images
      payment: data.payment,
      currentRate: OrderData.order.currentRate,
      priceCNY: data.priceCNY,
      priceDeliveryChina: data.priceDeliveryChina,
      priceDeliveryRussia: data.priceDeliveryRussia,
      commission: data.commission,
      promoCodePercent: data.promoCodePercent,
      comment: data.comment,
      __v: OrderData.order.__v,
    });
  }, [data]);

  return (
    <section className={styles["order-change"]}>
      <h2 className={styles["order-change__title"]}>Заказ #{order.orderId}</h2>
      <p className={styles["order-change__status"]}>Статус: {order.status}</p>
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
              href={`${BASE_URL_FRONT}/order/${order._id}`}
              target="_blank"
              rel="noreferrer"
            >
              {BASE_URL_FRONT}/order/{order._id}
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
              required={true}
            />
            <div className={styles["order-change__input-container"]}>
              <label>
                Категория<span className={styles["red-star"]}>*</span>
              </label>
              <select
                className={styles["order-change__select"]}
                name="category"
                value={OrderData.order.category}
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
                className={styles["order-change__select"]}
                name="subcategory"
                value={OrderData.order.subcategory}
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
              value={OrderData.order.brand}
              handleChange={handleChange}
              required={true}
            />
            <TextInput
              name="model"
              label="Модель"
              value={OrderData.order.model}
              handleChange={handleChange}
              required={true}
            />
            <TextInput
              name="size"
              label="Размер"
              value={OrderData.order.size}
              handleChange={handleChange}
              required={true}
            />
            <h2 className={styles["order-change__order-title"]}>Расчёт</h2>
            <div className={styles["order-change__input-container"]}>
              <label>
                Способ оплаты<span className={styles["red-star"]}>*</span>
              </label>
              <select
                className={styles["order-change__select"]}
                name="payment"
                value={OrderData.order.payment}
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
              value={OrderData.order.currentRate}
              required={true}
              readonly={true}
            />
            <TextInput
              name="priceCNY"
              label="Цена CNY"
              value={OrderData.order.priceCNY}
              handleChange={handleChange}
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
              label="Стоимость доставки POIZZON - Cклад в Китае"
              value={OrderData.order.priceDeliveryChina}
              handleChange={handleChange}
              required={true}
            />
            <TextInput
              name="priceDeliveryRussia"
              label="Стоимость доставки Cклад в Китае - Cклад в РФ"
              value={OrderData.order.priceDeliveryRussia}
              handleChange={handleChange}
              required={true}
            />
            <TextInput
              name="commission"
              label="Комиссия сервиса"
              value={OrderData.order.commission}
              handleChange={handleChange}
              required={true}
            />
            <div className={styles["order-change__input-container"]}>
              <label>Промо-код</label>
              <select
                className={styles["order-change__select"]}
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
                      {promoCodeItem.code} {promoCodeItem.percent}%
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
            <TextInput
              name="comment"
              label="Комментарий"
              value={OrderData.order.comment}
              handleChange={handleChange}
              required={false}
            />
            <button
              className={styles["order-change__order-submit"]}
              type="submit"
            >
              Cохранить
            </button>
          </form>
        </div>
      )}
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
