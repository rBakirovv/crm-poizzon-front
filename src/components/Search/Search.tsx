import styles from "./Search.module.css";
import TextInput from "../UI/TextInput/TextInput";
import OrderData from "../../store/order";
import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { IOrder } from "../../types/interfaces";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import { mergeOrders } from "../../utils/Order";
import Preloader from "../UI/Preloader/Preloader";

const dayjs = require("dayjs");

var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Europe/Moscow");

const Search = () => {
  const [data, setData] = useState({
    search: "",
  });

  const [filteredValue, setFilteredValue] = useState("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [searchedOrders, setSearchedOrders] = useState<Array<IOrder>>();

  const [isMerge, setIsMerge] = useState<boolean>(false);
  const [ordersArray, setOrdersArray] = useState<Array<string>>([]);
  const [numbersArray, setNumbersArray] = useState<Array<number>>([]);

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;

  const [isSubmitMergePopup, setIsSubmitMergePopup] = useState(false);

  function openSubmitMergePopup(e: React.SyntheticEvent) {
    e.preventDefault();

    setIsSubmitMergePopup(true);
  }

  function closeSubmitMergePopup() {
    setIsSubmitMergePopup(false);
  }

  const searchOrders = () => {
    return OrderData.orders.filter((item) => {
      if (
        item._id.toLowerCase().includes(filteredValue.toLowerCase()) ||
        item.orderId.toString() === filteredValue ||
        item.poizonCode.toLowerCase().includes(filteredValue.toLowerCase()) ||
        item.deliveryCode.toLowerCase().includes(filteredValue.toLowerCase()) ||
        item
          .deliveryName!.toLowerCase()
          .includes(filteredValue.toLowerCase()) ||
        item
          .deliveryPhone!.toLowerCase()
          .includes(filteredValue.toLowerCase()) ||
        item
          .deliveryNameRecipient!.toLowerCase()
          .includes(filteredValue.toLowerCase())
      ) {
        return true;
      }
    });
  };

  useEffect(() => {
    const Debounce = setTimeout(() => {
      const filteredData = searchOrders();
      setSearchedOrders(filteredData);
      setCurrentPage(1);
    }, 300);

    return () => {
      clearTimeout(Debounce);
    };
  }, [filteredValue]);

  const lastPageIndex =
    searchedOrders && Math.ceil(searchedOrders!.length / itemsPerPage);

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: value,
    });

    setFilteredValue(target.value);
  }

  function nextPage() {
    setCurrentPage(currentPage + 1);
  }

  function prevPage() {
    setCurrentPage(currentPage - 1);
  }

  function mergeHandler(e: React.SyntheticEvent) {
    !isMerge && setIsMerge(!isMerge);

    if (isMerge) {
      openSubmitMergePopup(e);
    }
  }

  function mergeItemClickHandler(
    e: React.SyntheticEvent,
    id: string,
    number: number
  ) {
    e.preventDefault();

    if (!ordersArray.includes(id)) {
      setOrdersArray(ordersArray.concat(id));
      setNumbersArray(numbersArray.concat(number));
    }
  }

  async function submitMergePopupFunction() {
    await ordersArray.map((item, index) => {
      mergeOrders(ordersArray[index], ordersArray);
    });

    await setOrdersArray([]);
    await setNumbersArray([]);
    await setIsMerge(false);
    await alert("Пожалуйста, обновите страницу");
  }

  return (
    <section className={styles["search"]}>
      <div className={styles["search-container"]}>
        <TextInput
          label="Поиск заказа"
          name="search"
          required={false}
          placeholder="Номер / id / poizon / CDEK"
          value={data.search}
          handleChange={handleChange}
        />
      </div>
      <div className={styles["orders-table__container"]}>
        <div className={styles["orders-table__header"]}>
          <div
            className={`${styles["orders-table__header-item"]} ${styles["orders-table__header-item_number"]}`}
          >
            Номер
          </div>
          <div
            className={`${styles["orders-table__header-item"]} ${styles["orders-table__header-item_status"]}`}
          >
            Статус
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
          <div
            className={`${styles["orders-table__header-item"]} ${styles["orders-table__header-item_client"]}`}
          >
            Заказчик
          </div>
          <div className={styles["orders-table__header-item"]}>POIZON</div>
          <div className={styles["orders-table__header-item"]}>CDEK</div>
          <div
            className={`${styles["orders-table__header-item"]} ${styles["orders-table__header-item_person"]}`}
          >
            Менеджер
          </div>
          <div
            className={`${styles["orders-table__header-item"]} ${styles["orders-table__header-item_person"]}`}
          >
            Байер
          </div>
          <div
            className={`${styles["orders-table__header-item"]} ${styles["orders-table__header-item_person"]}`}
          >
            Принял на складе
          </div>
        </div>
        <ul className={styles["orders-table__table"]}>
          {filteredValue !== "" &&
            searchedOrders &&
            searchedOrders.length > 0 &&
            searchedOrders!
              .slice()
              .reverse()
              .slice(firstItemIndex, lastItemIndex)
              .map((orderItem) => {
                return (
                  <li
                    key={orderItem._id}
                    className={styles["orders-table__item"]}
                  >
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
                      } ${
                        orderItem.status === "Завершён" &&
                        styles["orders-table__finished"]
                      } 
                       ${styles["orders-table__header-item_number"]}`}
                      href={`/order/change/${orderItem._id}`}
                    >
                      {isMerge && (
                        <button
                          onClick={(e) =>
                            mergeItemClickHandler(
                              e,
                              orderItem._id,
                              orderItem.orderId
                            )
                          }
                          className={styles["orders-table__item-merge"]}
                        >
                          {" "}
                          ✓
                        </button>
                      )}
                      {orderItem.orderId}
                    </Link>
                    <div
                      className={`${styles["orders-table__info-item"]} ${styles["orders-table__header-item_status"]}`}
                    >
                      {orderItem.status}
                    </div>
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
                    <div
                      className={`${styles["orders-table__info-item"]} ${styles["orders-table__header-item_client"]}`}
                    >
                      {orderItem.deliveryName !== "" && orderItem.deliveryName}
                    </div>
                    <div className={styles["orders-table__info-item"]}>
                      {orderItem.poizonCode !== "" && orderItem.poizonCode}
                    </div>
                    <div className={styles["orders-table__info-item"]}>
                      {orderItem.deliveryCode !== "" && orderItem.deliveryCode}
                    </div>
                    <div
                      className={`${styles["orders-table__info-item"]} ${styles["orders-table__header-item_person"]}`}
                    >
                      {orderItem.creater}
                    </div>
                    <div
                      className={`${styles["orders-table__info-item"]} ${styles["orders-table__header-item_person"]}`}
                    >
                      {orderItem.buyer}
                    </div>
                    <div
                      className={`${styles["orders-table__info-item"]} ${styles["orders-table__header-item_person"]}`}
                    >
                      {orderItem.stockman}
                    </div>
                  </li>
                );
              })}
        </ul>
      </div>
      <div className={styles["order-table__tools"]}>
        {filteredValue !== "" && (
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
        )}
        <div className={styles["orders-table__merge-container"]}>
          <button onClick={mergeHandler}>
            {isMerge ? "Применить" : "Объединить"}
          </button>
          {isMerge && (
            <p className="">
              Объединённые: <strong>{numbersArray.join(", ")}</strong>{" "}
            </p>
          )}
        </div>
        <SubmitPopup
          submitText={`Объединить ${numbersArray.join(", ")}`}
          isSubmitPopup={isSubmitMergePopup}
          closeSubmitPopup={closeSubmitMergePopup}
          onSubmit={submitMergePopupFunction}
        />
      </div>
    </section>
  );
};

export default Search;
