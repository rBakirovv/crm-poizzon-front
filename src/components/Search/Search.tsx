import styles from "./Search.module.css";
import TextInput from "../UI/TextInput/TextInput";
import OrderData from "../../store/order";
import { useMemo, useState, useTransition } from "react";
import Link from "next/link";

const dayjs = require("dayjs");

const Search = () => {
  const [data, setData] = useState({
    search: "",
  });

  const [filteredValue, setFilteredValue] = useState("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [isPending, startTransitiom] = useTransition();

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;

  const searchedOrders = useMemo(() => {
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
  }, [filteredValue]);

  const lastPageIndex = Math.ceil(searchedOrders.length / itemsPerPage);

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: value,
    });

    startTransitiom(() => {
      setFilteredValue(target.value);
    });
  }

  function nextPage() {
    setCurrentPage(currentPage + 1);
  }

  function prevPage() {
    setCurrentPage(currentPage - 1);
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
            searchedOrders
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
                      } ${styles["orders-table__header-item_number"]}`}
                      href={`/order/change/${orderItem._id}`}
                    >
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
      </div>
    </section>
  );
};

export default Search;
