import Link from "next/link";
import OrderData from "../../../store/order";
import OrdersBar from "../../../store/ordersBar";
import styles from "./OrderTable.module.css";
import { FC, useCallback, useEffect, useState } from "react";
import SubmitPopup from "../../SubmitPopup/SubmitPopup";
import {
  deleteOrder,
  getCurrentOrder,
  deleteOrderImage,
  getOrders,
  deletePayProofImage,
  reorderStatus,
  getOrdersTable,
  getInStockInRussia,
} from "../../../utils/Order";
import { IOrder, IOrderImages } from "../../../types/interfaces";
import { useRouter } from "next/router";
import UserData from "../../../store/user";
import RateData from "../../../store/rate";
import PaymentsData from "../../../store/payments";
import { observer } from "mobx-react-lite";
import { BASE_URL_FRONT } from "../../../utils/constants";

const dayjs = require("dayjs");

var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");

var debounce = require("lodash.debounce");

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Europe/Moscow");

interface IOrderTable {
  status: string;
}

const OrderTable: FC<IOrderTable> = observer(({ status }) => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState<number | string | null>(
    typeof window !== "undefined" && sessionStorage.getItem("ordersTablePage")
      ? sessionStorage.getItem("ordersTablePage")
      : 1
  );
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [isDeleteDraft, setIsDeleteDraft] = useState<boolean>(false);

  const [isDeletePaidOrder, setIsDeletePaidOrder] = useState<boolean>(false);

  const [isPurchase, setIsPurchase] = useState<boolean>(false);

  const [orderNumber, setOrderNumber] = useState<number>(0);
  const [orderId, setOrderId] = useState<string>("");
  const [isSubmitPopup, setIsSubmitPopup] = useState<boolean>(false);

  const [filterPurchased, setFilterPurchased] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [filterReorder, setFilterReorder] = useState("");

  const [isCopyLink, setIsCopyLink] = useState(false);
  const [isCopyTg, setIsCopyTg] = useState(false);

  const [inStockInRussiaOrders, setInStockInRussiaOrders] = useState<
    Array<IOrder>
  >([]);

  const lastPageIndex = Math.ceil(OrderData.ordersTableLength / itemsPerPage);

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    if (target.name === "current_page") {
      debouncePaste(parseInt(target.value));
    }
  }

  function hanfleFilterPurchased(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    if (target.value === "") {
      getOrdersTable(0, OrdersBar.orderStatus, "", "", "").then((orders) => {
        OrderData.setOrders(orders.orders);
        OrderData.setOrdersTableLength(orders.total);
        sessionStorage.setItem("ordersTablePage", "1");
        setCurrentPage(1);
      });
    }

    if (target.value === "no-code") {
      getOrdersTable(0, OrdersBar.orderStatus, "no-code", "", "").then(
        (orders) => {
          OrderData.setOrders(orders.orders);
          OrderData.setOrdersTableLength(orders.total);
          sessionStorage.setItem("ordersTablePage", "1");
          setCurrentPage(1);
        }
      );
    }

    setFilterPurchased(target.value);
  }

  function hanfleFilterPayment(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    getOrdersTable(0, OrdersBar.orderStatus, "", target.value, "").then(
      (orders) => {
        OrderData.setOrders(orders.orders);
        OrderData.setOrdersTableLength(orders.total);
        sessionStorage.setItem("ordersTablePage", "1");
        setCurrentPage(1);
      }
    );

    setFilterPayment(target.value);
  }

  function hanfleFilterReorder(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    if (target.value === "") {
      getOrdersTable(0, OrdersBar.orderStatus, "", "", "").then((orders) => {
        OrderData.setOrders(orders.orders);
        OrderData.setOrdersTableLength(orders.total);
        sessionStorage.setItem("ordersTablePage", "1");
        setCurrentPage(1);
      });
    }

    if (target.value === "reorder") {
      getOrdersTable(0, OrdersBar.orderStatus, "", "", "reorder").then(
        (orders) => {
          OrderData.setOrders(orders.orders);
          OrderData.setOrdersTableLength(orders.total);
          sessionStorage.setItem("ordersTablePage", "1");
          setCurrentPage(1);
        }
      );
    }

    setFilterReorder(target.value);
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
    getOrdersTable(
      typeof currentPage === "string"
        ? parseInt(currentPage) - 1 + 1
        : currentPage! - 1 + 1,
      OrdersBar.orderStatus,
      filterPurchased,
      filterPayment,
      filterReorder
    ).then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    setCurrentPage(
      typeof currentPage === "string"
        ? parseInt(currentPage) + 1
        : currentPage! + 1
    );
    sessionStorage.setItem(
      "ordersTablePage",
      typeof currentPage === "string"
        ? (parseInt(currentPage) + 1).toString()
        : (currentPage! + 1).toString()
    );
  }

  function prevPage() {
    getOrdersTable(
      typeof currentPage === "string"
        ? parseInt(currentPage) - 1 - 1
        : currentPage! - 1 - 1,
      OrdersBar.orderStatus,
      filterPurchased,
      filterPayment,
      filterReorder
    ).then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    sessionStorage.setItem(
      "ordersTablePage",
      typeof currentPage === "string"
        ? (parseInt(currentPage) - 1).toString()
        : (currentPage! - 1).toString()
    );
    setCurrentPage(
      typeof currentPage === "string"
        ? parseInt(currentPage) - 1
        : currentPage! - 1
    );
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
    reorderStatus(orderId)
      .then(() => {
        getOrders().then((orders) => OrderData.setOrders(orders));
      })
      .then(() => {
        router.push(`/order/change/${orderId}`);
      })
      .catch((err) => console.log(err));
  }

  function handleChangePage(page: number) {
    getOrdersTable(
      page - 1,
      OrdersBar.orderStatus,
      filterPurchased,
      filterPayment,
      filterReorder
    ).then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
    sessionStorage.setItem("ordersTablePage", page.toString());
    setCurrentPage(page);
  }

  const debouncePaste = useCallback(
    debounce((value: number) => {
      handleChangePage(value);
    }, 100),
    []
  );

  useEffect(() => {
    getInStockInRussia().then((orders) => {
      setInStockInRussiaOrders(orders);
    });
  }, []);

  const totalPriceRub = inStockInRussiaOrders.reduce(function (sum, current) {
    return (
      sum +
      (parseFloat(current.priceCNY) * parseFloat(current.currentRate) +
        parseFloat(current.priceDeliveryChina) +
        parseFloat(current.priceDeliveryRussia) +
        parseFloat(current.commission) -
        current.promoCodePercent)
    );
  }, 0);

  const totalPriceCNY = inStockInRussiaOrders.reduce(function (sum, current) {
    return sum + parseFloat(current.priceCNY);
  }, 0);

  function resetOrderСhapter() {
    sessionStorage.setItem("orderСhapter", "Order");
  }

  function handleCopyLinkClick() {
    setIsCopyLink(!isCopyLink);
  }

  function handleCopyTgClick() {
    setIsCopyTg(!isCopyTg);
  }

  function handleCopyLink(id: string) {
    navigator.clipboard.writeText(`${BASE_URL_FRONT}/order/${id}`);
  }

  function handleCopyTg(tg: string) {
    if (tg[0] === "@") {
      navigator.clipboard.writeText(tg.slice(1));
    } else {
      navigator.clipboard.writeText(tg);
    }
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
            Дата оплаты
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
        {OrderData.orders && OrderData.orders.length > 0 && (
          <ul className={styles["orders-table__table"]}>
            {OrderData.orders &&
              OrderData.orders.length &&
              OrderData.orders.map((orderItem) => {
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
                    {status === "Недавно прибывшие" && isCopyLink && (
                      <button
                        className={styles["orders-table__delete-item"]}
                        onClick={() => handleCopyLink(orderItem._id)}
                      >
                        ✓
                      </button>
                    )}
                    {status === "Недавно прибывшие" && isCopyTg && (
                      <button
                        className={styles["orders-table__delete-item"]}
                        onClick={() => handleCopyTg(orderItem.deliveryName!)}
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
                      } ${styles["orders-table__header-item_number"]} ${
                        orderItem.reorder === true &&
                        styles["orders-table__reorder"]
                      }`}
                      href={`/order/change/${orderItem._id}`}
                      onClick={resetOrderСhapter}
                    >
                      {orderItem.orderId}
                    </Link>
                    <div
                      className={`${styles["orders-table__info-item"]} ${styles["orders-table__header-item_date"]}`}
                    >
                      {orderItem.paidAt
                        ? dayjs
                            .tz(new Date(orderItem.paidAt!))
                            .format("DD-MM-YYYY")
                        : "-"}
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
        )}
      </div>
      <div className={styles["order-table__tools"]}>
        <div className={styles["pagination__container"]}>
          <button
            className={styles["pagination__button"]}
            onClick={prevPage}
            disabled={
              (typeof currentPage === "string"
                ? parseInt(currentPage)
                : currentPage) === 1
            }
          >
            {"<"}
          </button>
          <div className={styles["pagination__page"]}>
            <input
              className={styles["pagination__page-input"]}
              type="number"
              name="current_page"
              value={
                typeof window !== "undefined" &&
                sessionStorage.getItem("ordersTablePage")
                  ? parseInt(sessionStorage.getItem("ordersTablePage") as any)
                  : 1
              }
              onChange={handleChange}
            />{" "}
            / {lastPageIndex}
          </div>
          <button
            className={styles["pagination__button"]}
            onClick={nextPage}
            disabled={
              (typeof currentPage === "string"
                ? parseInt(currentPage)
                : currentPage) === lastPageIndex || lastPageIndex === 0
            }
          >
            {">"}
          </button>
        </div>
        <div className={styles["orders-table__recently-arrived-buttons"]}>
          {status === "Недавно прибывшие" && (
            <button
              className={styles["orders-table__poizon-code-filter"]}
              onClick={handleCopyLinkClick}
            >
              {!isCopyLink ? "Копировать" : "Закрыть"}
            </button>
          )}
          {status === "Недавно прибывшие" && (
            <button
              className={styles["orders-table__poizon-code-filter"]}
              onClick={handleCopyTgClick}
            >
              {!isCopyTg ? "@telegram" : "Закрыть"}
            </button>
          )}
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
            {isPurchase ? "Закрыть" : "Перезаказ"}
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
      {status === "Ожидает закупки" && (
        <div className={styles["orders-table__payment-filter-container"]}>
          <div>
            <div className={styles["orders-table__sum-yuan"]}>
              Итого: {Math.ceil(totalPriceCNY)} ¥
            </div>
            <div className={styles["orders-table__sum-rub"]}>
              Итого: {Math.ceil(totalPriceRub)} ₽
            </div>
          </div>
          <select
            className={styles["orders-table__poizon-code-filter"]}
            onChange={hanfleFilterReorder}
          >
            <option value="" selected>
              Все
            </option>
            <option value="reorder">Перезаказ</option>
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
          submitText={`Отправить на перезакупку заказ № ${orderNumber}`}
        />
      )}
    </>
  );
});

export default OrderTable;
