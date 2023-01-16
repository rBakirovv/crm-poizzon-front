import Link from "next/link";
import OrderData from "../../../store/order";
import styles from "./OrderTable.module.css";
import { FC, useState } from "react";
import SubmitPopup from "../../SubmitPopup/SubmitPopup";
import {
  deleteOrder,
  getCurrentOrder,
  deleteOrderImage,
} from "../../../utils/Order";
import { IOrderImages } from "../../../types/interfaces";

const dayjs = require("dayjs");

interface IOrderTable {
  status: string;
}

const OrderTable: FC<IOrderTable> = ({ status }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [isDeleteDraft, setIsDeleteDraft] = useState<boolean>(false);

  const [orderNumber, setOrderNumber] = useState<number>(0);
  const [orderId, setOrderId] = useState<string>("");
  const [isSubmitPopup, setIsSubmitPopup] = useState<boolean>(false);

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;

  const lastPageIndex = Math.ceil(
    OrderData.orders.filter((item) => item.status === status).length /
      itemsPerPage
  );

  function handleDeleteDraftClick() {
    setIsDeleteDraft(!isDeleteDraft);
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

  return (
    <>
      <div className={styles["orders-table__container"]}>
        <div className={styles["orders-table__header"]}>
          <div className={styles["orders-table__header-item"]}>Номер</div>
          <div className={styles["orders-table__header-item"]}>Дата</div>
          <div className={styles["orders-table__header-item"]}>Товар</div>
          <div className={styles["orders-table__header-item"]}>Сумма</div>
          <div className={styles["orders-table__header-item"]}>Менеджер</div>
          <div className={styles["orders-table__header-item"]}>Байер</div>
          <div className={styles["orders-table__header-item"]}>
            Принял на складе
          </div>
        </div>
        <ul className={styles["orders-table__table"]}>
          {OrderData.orders
            .filter((item) => item.status === status)
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
                  <Link
                    className={`${styles["orders-table__info-item"]} ${styles["orders-table__info-item_link"]}`}
                    href={`/order/change/${orderItem._id}`}
                  >
                    {orderItem.orderId}
                  </Link>
                  <div className={styles["orders-table__info-item"]}>
                    {dayjs(orderItem.createdAt).format("DD-MM-YYYY")}
                  </div>
                  <div className={styles["orders-table__info-item"]}>
                    {orderItem.brand !== "" &&
                      orderItem.model !== "" &&
                      `${orderItem.subcategory} ${orderItem.brand} ${orderItem.model}`}
                  </div>
                  <div className={styles["orders-table__info-item"]}>
                    {(
                      parseFloat(orderItem.priceCNY) *
                        parseFloat(orderItem.currentRate) +
                      parseFloat(orderItem.priceDeliveryChina) +
                      parseFloat(orderItem.priceDeliveryRussia) +
                      parseFloat(orderItem.commission) -
                      orderItem.promoCodePercent
                    ).toFixed(2)}
                  </div>
                  <div className={styles["orders-table__info-item"]}>
                    {orderItem.creater !== "" && orderItem.creater}
                  </div>
                  <div className={styles["orders-table__info-item"]}>
                    {orderItem.buyer}
                  </div>
                  <div className={styles["orders-table__info-item"]}>
                    {orderItem.postman}
                  </div>
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
            disabled={currentPage === lastPageIndex}
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
      </div>
      {status === "Черновик" && (
        <SubmitPopup
          isSubmitPopup={isSubmitPopup}
          onSubmit={onSubmitDeleteDraft}
          closeSubmitPopup={closeSubmitPopup}
          submitText={`Удалить заказ № ${orderNumber}`}
        />
      )}
    </>
  );
};

export default OrderTable;
