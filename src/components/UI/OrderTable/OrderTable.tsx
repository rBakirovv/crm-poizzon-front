import Link from "next/link";
import OrderData from "../../../store/order";
import styles from "./OrderTable.module.css";
import { FC, useState } from "react";
import SubmitPopup from "../../SubmitPopup/SubmitPopup";
import {
  deleteOrder,
  getCurrentOrder,
  deleteOrderImage,
  inPurchase,
  getOrders,
  deletePayProofImage,
} from "../../../utils/Order";
import { IOrderImages } from "../../../types/interfaces";
import { useRouter } from "next/router";
import UserData from "../../../store/user";
import PaymentsData from "../../../store/payments";

const dayjs = require("dayjs");

interface IOrderTable {
  status: string;
}

const OrderTable: FC<IOrderTable> = ({ status }) => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [isDeleteDraft, setIsDeleteDraft] = useState<boolean>(false);

  const [isDeletePaidOrder, setIsDeletePaidOrder] = useState<boolean>(false);

  const [isPurchase, setIsPurchase] = useState<boolean>(false);

  const [orderNumber, setOrderNumber] = useState<number>(0);
  const [orderId, setOrderId] = useState<string>("");
  const [isSubmitPopup, setIsSubmitPopup] = useState<boolean>(false);

  const [filterPurchased, setFilterPurchased] = useState("");
  const [filterPayment, setFilterPayment] = useState("");

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;

  const lastPageIndex = Math.ceil(
    OrderData.orders.filter((item) => {
      return (
        (status === "Ожидает данные"
          ? item.deliveryMethod === "" &&
            item.deliveryAddress === "" &&
            Math.ceil(
              new Date(item.inChinaStockAt).getTime() -
                new Date(Date.now()).getTime()
            ) /
              1000 <
              -43200 &&
            item.inChinaStockAt !== null &&
            item.status !== "Завершён"
          : item.status === status || status === "Ожидает данные") &&
        (status === "Закуплен"
          ? filterPurchased !== ""
            ? item.poizonCode === ""
            : item.status === status
          : item.status === status || status === "Ожидает данные") &&
        (status === "Проверка оплаты"
          ? filterPayment === ""
            ? item.status === status
            : item.payment === filterPayment
          : item.status === status || status === "Ожидает данные")
      );
    }).length / itemsPerPage
  );

  function hanfleFilterPurchased(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    setFilterPurchased(target.value);
  }

  function hanfleFilterPayment(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    setFilterPayment(target.value);
  }

  function handleDeleteDraftClick() {
    setIsDeleteDraft(!isDeleteDraft);
  }

  function handleDeletePaidClick() {
    setIsDeletePaidOrder(!isDeletePaidOrder);
  }

  function handlePurchaseClick() {
    setIsPurchase(!isPurchase);
  }

  function nextPage() {
    setCurrentPage(currentPage + 1);
  }

  function prevPage() {
    setCurrentPage(currentPage - 1);
  }

  function openSubmitPopup(orderId: number, _id: string) {
    setOrderNumber(orderId);
    setOrderId(_id);
    setIsSubmitPopup(true);
  }

  function closeSubmitPopup() {
    setIsSubmitPopup(false);
  }

  function onSubmitDeleteDraft() {
    getCurrentOrder(orderId)
      .then((order) => {
        if (order.orderImages.length !== 0) {
          order.orderImages.forEach((item: IOrderImages) => {
            deleteOrderImage(item.name, orderId);
          });
        }
      })
      .then(() => {
        deleteOrder(orderId);
      })
      .then(() => {
        OrderData.deleteOrder(orderId);
      })
      .then(() => {
        setOrderId("");
      })
      .catch((err) => console.log(err));
  }

  function onSubmitDeletePaid() {
    getCurrentOrder(orderId)
      .then((order) => {
        if (order.orderImages.length !== 0) {
          order.orderImages.forEach((item: IOrderImages) => {
            deleteOrderImage(item.name, orderId);
          });
        }

        if (order.payProofImages !== 0) {
          order.orderImages.forEach((item: IOrderImages) => {
            deletePayProofImage(item.name, orderId);
          });
        }
      })
      .then(() => {
        deleteOrder(orderId);
      })
      .then(() => {
        OrderData.deleteOrder(orderId);
      })
      .then(() => {
        setOrderId("");
      })
      .catch((err) => console.log(err));
  }

  function onSubmitPurchase() {
    inPurchase(orderId, UserData.userData.name)
      .then(() => {
        getOrders().then((orders) => OrderData.setOrders(orders));
      })
      .then(() => {
        OrderData.orders.filter((item) => item.status === status);
      })
      .then(() => {
        router.push(`/order/change/${orderId}`);
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <div className={styles["orders-table__container"]}>
        <div className={styles["orders-table__header"]}>
          <div
            className={`${styles["orders-table__header-item"]} ${styles["orders-table__header-item_number"]}`}
          >
            Номер
          </div>
          <div
            className={`${styles["orders-table__header-item"]} ${styles["orders-table__header-item_date"]}`}
          >
            Дата
          </div>
          <div
            className={`${styles["orders-table__header-item"]} ${styles["orders-table__header-item_product"]}`}
          >
            Товар
          </div>
          <div
            className={`${styles["orders-table__header-item"]} ${styles["orders-table__header-item_price"]}`}
          >
            Сумма
          </div>
          {status === "Проверка оплаты" && (
            <div
              className={`${styles["orders-table__header-item"]} ${styles["orders-table__header-item_payment"]}`}
            >
              Оплата
            </div>
          )}
          <div
            className={`${styles["orders-table__header-item"]} ${styles["orders-table__header-item_person"]}`}
          >
            Менеджер
          </div>
          {!(
            status === "Черновик" ||
            status === "Проверка оплаты" ||
            status === "Ожидает закупки"
          ) && (
            <div
              className={`${styles["orders-table__header-item"]} ${styles["orders-table__header-item_person"]}`}
            >
              Байер
            </div>
          )}
          {(status === "На складе в РФ" ||
            status === "Доставляется" ||
            status === "Завершён") && (
            <div
              className={`${styles["orders-table__header-item"]} ${styles["orders-table__header-item_person"]}`}
            >
              Принял на складе
            </div>
          )}
        </div>
        <ul className={styles["orders-table__table"]}>
          {OrderData.orders
            .filter((item) => {
              return (
                (status === "Ожидает данные"
                  ? item.deliveryMethod === "" &&
                    item.deliveryAddress === "" &&
                    Math.ceil(
                      new Date(item.inChinaStockAt).getTime() -
                        new Date(Date.now()).getTime()
                    ) /
                      1000 <
                      -43200 &&
                    item.inChinaStockAt !== null &&
                    item.status !== "Завершён"
                  : item.status === status || status === "Ожидает данные") &&
                (status === "Закуплен"
                  ? filterPurchased !== ""
                    ? item.poizonCode === ""
                    : item.status === status
                  : item.status === status || status === "Ожидает данные") &&
                (status === "Проверка оплаты"
                  ? filterPayment === ""
                    ? item.status === status
                    : item.payment === filterPayment
                  : item.status === status || status === "Ожидает данные")
              );
            })
            .slice()
            .reverse()
            .slice(firstItemIndex, lastItemIndex)
            .map((orderItem) => {
              return (
                <li
                  key={orderItem._id}
                  className={styles["orders-table__item"]}
                >
                  {status === "Черновик" && isDeleteDraft && (
                    <button
                      onClick={() =>
                        openSubmitPopup(orderItem.orderId, orderItem._id)
                      }
                      className={styles["orders-table__delete-item"]}
                    >
                      X
                    </button>
                  )}
                  {status === "Проверка оплаты" && isDeletePaidOrder && (
                    <button
                      onClick={() =>
                        openSubmitPopup(orderItem.orderId, orderItem._id)
                      }
                      className={styles["orders-table__delete-item"]}
                    >
                      X
                    </button>
                  )}
                  {status === "Ожидает закупки" && isPurchase && (
                    <button
                      className={styles["orders-table__delete-item"]}
                      onClick={() =>
                        openSubmitPopup(orderItem.orderId, orderItem._id)
                      }
                    >
                      ✓
                    </button>
                  )}
                  <Link
                    className={`${styles["orders-table__info-item"]} ${
                      styles["orders-table__info-item_link"]
                    } ${
                      (orderItem.status === "На закупке" ||
                        orderItem.status === "Закуплен" ||
                        orderItem.status === "На складе в РФ") &&
                      orderItem.poizonCode === "" &&
                      styles["orders-table__info-item_poizon-code"]
                    } ${
                      (orderItem.status === "На складе в РФ" ||
                        orderItem.status === "Доставляется") &&
                      orderItem.deliveryCode === "" &&
                      styles["orders-table__info-item_delivery-code"]
                    } ${
                      orderItem.combinedOrder.length !== 0 &&
                      styles["orders-table__combined"]
                    } ${styles["orders-table__header-item_number"]}`}
                    href={`/order/change/${orderItem._id}`}
                  >
                    {orderItem.orderId}
                  </Link>
                  <div
                    className={`${styles["orders-table__info-item"]} ${styles["orders-table__header-item_date"]}`}
                  >
                    {dayjs(orderItem.createdAt).format("DD-MM-YYYY")}
                  </div>
                  <div
                    className={`${styles["orders-table__info-item"]} ${styles["orders-table__header-item_product"]}`}
                  >
                    {orderItem.model !== "" &&
                      `${orderItem.subcategory} ${orderItem.model}`}
                  </div>
                  <div
                    className={`${styles["orders-table__info-item"]} ${styles["orders-table__header-item_price"]}`}
                  >
                    {orderItem.status === "Черновик" &&
                      (Math.ceil(
                        Math.round(
                          new Date(orderItem.overudeAfter).getTime() -
                            new Date(Date.now()).getTime()
                        ) / 1000
                      ) <= 0
                        ? "Оплата просрочена"
                        : Math.ceil(
                            parseFloat(orderItem.priceCNY) *
                              parseFloat(orderItem.currentRate) +
                              parseFloat(orderItem.priceDeliveryChina) +
                              parseFloat(orderItem.priceDeliveryRussia) +
                              parseFloat(orderItem.commission) -
                              orderItem.promoCodePercent
                          ))}
                    {orderItem.status === "Черновик" && <br />}
                    {orderItem.status !== "Черновик" &&
                      Math.ceil(
                        parseFloat(orderItem.priceCNY) *
                          parseFloat(orderItem.currentRate) +
                          parseFloat(orderItem.priceDeliveryChina) +
                          parseFloat(orderItem.priceDeliveryRussia) +
                          parseFloat(orderItem.commission) -
                          orderItem.promoCodePercent
                      )}
                  </div>
                  {orderItem.status === "Проверка оплаты" && (
                    <div
                      className={`${styles["orders-table__info-item"]} ${styles["orders-table__header-item_payment"]}`}
                    >
                      {orderItem.payment
                        .toLowerCase()
                        .includes("QR".toLowerCase())
                        ? "Перевод по QR-коду"
                        : orderItem.payment}
                    </div>
                  )}
                  <div
                    className={`${styles["orders-table__info-item"]} ${styles["orders-table__header-item_person"]}`}
                  >
                    {orderItem.creater}
                  </div>
                  {!(
                    orderItem.status === "Черновик" ||
                    orderItem.status === "Проверка оплаты" ||
                    orderItem.status === "Ожидает закупки"
                  ) && (
                    <div
                      className={`${styles["orders-table__info-item"]} ${styles["orders-table__header-item_person"]}`}
                    >
                      {orderItem.buyer}
                    </div>
                  )}
                  {(status === "На складе в РФ" ||
                    status === "Доставляется" ||
                    status === "Завершён") && (
                    <div
                      className={`${styles["orders-table__info-item"]} ${styles["orders-table__header-item_person"]}`}
                    >
                      {orderItem.stockman}
                    </div>
                  )}
                </li>
              );
            })}
        </ul>
      </div>
      <div className={styles["order-table__tools"]}>
        <div className={styles["pagination__container"]}>
          <button
            className={styles["pagination__button"]}
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          <div className={styles["pagination__page"]}>
            {currentPage} / {lastPageIndex}
          </div>
          <button
            className={styles["pagination__button"]}
            onClick={nextPage}
            disabled={currentPage === lastPageIndex || lastPageIndex === 0}
          >
            {">"}
          </button>
        </div>
        {status === "Черновик" && (
          <button
            className={styles["delete-draft-button"]}
            onClick={handleDeleteDraftClick}
          >
            {isDeleteDraft ? "Закрыть" : "Удалить черновик"}
          </button>
        )}
        {status === "Ожидает закупки" && (
          <button
            className={styles["purchase-button"]}
            onClick={handlePurchaseClick}
          >
            {isPurchase ? "Закрыть" : "В закупку"}
          </button>
        )}
        {status === "Проверка оплаты" &&
          (UserData.userData.position === "Создатель" ||
            UserData.userData.position === "Администратор") && (
            <button
              className={styles["delete-draft-button"]}
              onClick={handleDeletePaidClick}
            >
              {isDeletePaidOrder ? "Закрыть" : "Удалить"}
            </button>
          )}
        {status === "Закуплен" && (
          <select
            className={styles["orders-table__poizon-code-filter"]}
            onChange={hanfleFilterPurchased}
          >
            <option value="" selected>
              Все
            </option>
            <option value="no-code">Без номера Poizon</option>
          </select>
        )}
      </div>
      {status === "Проверка оплаты" && (
        <div className={styles["orders-table__payment-filter-container"]}>
          <select
            className={styles["orders-table__payment-filter"]}
            onChange={hanfleFilterPayment}
          >
            <option value="" selected>
              Все
            </option>
            {PaymentsData.paymentsList.map((paymentItem) => {
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
      )}
      {status === "Черновик" && (
        <SubmitPopup
          isSubmitPopup={isSubmitPopup}
          onSubmit={onSubmitDeleteDraft}
          closeSubmitPopup={closeSubmitPopup}
          submitText={`Удалить заказ № ${orderNumber}`}
        />
      )}
      {status === "Проверка оплаты" &&
        (UserData.userData.position === "Создатель" ||
          UserData.userData.position === "Администратор") && (
          <SubmitPopup
            isSubmitPopup={isSubmitPopup}
            onSubmit={onSubmitDeletePaid}
            closeSubmitPopup={closeSubmitPopup}
            submitText={`Удалить заказ № ${orderNumber}`}
          />
        )}
      {status === "Ожидает закупки" && (
        <SubmitPopup
          isSubmitPopup={isSubmitPopup}
          onSubmit={onSubmitPurchase}
          closeSubmitPopup={closeSubmitPopup}
          submitText={`Взять в закупку заказ № ${orderNumber}`}
        />
      )}
    </>
  );
};

export default OrderTable;
