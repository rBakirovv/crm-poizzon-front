import styles from "./Search.module.css";
import TextInput from "../UI/TextInput/TextInput";
import OrderData from "../../store/order";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IOrder } from "../../types/interfaces";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import {
  //getCurrentOrder,
  mergeOrders,
  searchOrder,
  unmergeOrders,
} from "../../utils/Order";
//import order from "../../store/order";

const dayjs = require("dayjs");

var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");

//var debounce = require("lodash.debounce");

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Europe/Moscow");

const Search = () => {
  const [data, setData] = useState({
    search: "",
    current_page: 0,
  });

  const [filteredValue, setFilteredValue] = useState("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [searchedOrders, setSearchedOrders] = useState<Array<IOrder>>();

  const [isMerge, setIsMerge] = useState<boolean>(false);
  const [isUnmerge, setIsUnmerge] = useState<boolean>(false);
  const [isUnmergeCheckbox, setIsUnmergeCheckbox] = useState<boolean>(false);
  const [ordersArray, setOrdersArray] = useState<Array<string>>([]);
  const [numbersArray, setNumbersArray] = useState<Array<number>>([]);
  const [expressCostArray, setExpressCostArray] = useState<Array<number>>([]);

  const [isSubmitMergePopup, setIsSubmitMergePopup] = useState(false);
  const [isSubmitUnmergePopup, setIsSubmitUnmergePopup] = useState(false);

  const [currentOrderItem, setCurrentOrderItem] = useState<IOrder>();

  const [ordersDeliveryAddressArray, setOrdersDeliveryAddressArray] = useState<
    Array<string>
  >([]);

  const lastPageIndex = Math.ceil(OrderData.ordersTableLength / itemsPerPage);

  function openSubmitMergePopup(e: React.SyntheticEvent) {
    e.preventDefault();

    setIsSubmitMergePopup(true);
  }

  function closeSubmitMergePopup() {
    setIsSubmitMergePopup(false);
  }

  function openSubmitUnmergePopup(e: React.SyntheticEvent) {
    e.preventDefault();

    setIsSubmitUnmergePopup(true);
  }

  function closeSubmitUnmergePopup() {
    setIsSubmitUnmergePopup(false);
  }

  useEffect(() => {
    const Debounce = setTimeout(() => {
      searchOrder(
        0,
        parseInt(data.search) ? parseInt(data.search) : data.search
      ).then((orders) => {
        setSearchedOrders(orders.orders);
        OrderData.setOrdersTableLength(orders.total);
      });
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(Debounce);
    };
  }, [filteredValue]);

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: value,
    });

    if (target.name === "search") {
      setFilteredValue(target.value);
    }

    if (target.name === "current_page") {
      handleChangePage(parseInt(target.value));
    }
  }

  function nextPage() {
    searchOrder(
      currentPage + 1 - 1,
      parseInt(data.search) ? parseInt(data.search) : data.search
    ).then((orders) => {
      setSearchedOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });

    setCurrentPage(currentPage + 1);
  }

  function prevPage() {
    searchOrder(
      currentPage - 1 - 1,
      parseInt(data.search) ? parseInt(data.search) : data.search
    ).then((orders) => {
      setSearchedOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });

    setCurrentPage(currentPage - 1);
  }

  function mergeHandler(e: React.SyntheticEvent) {
    !isMerge && setIsMerge(!isMerge);

    if (isMerge) {
      openSubmitMergePopup(e);
    }
  }

  function unmergeHandler() {
    !isUnmerge && setIsUnmerge(!isUnmerge);
  }

  function mergeItemClickHandler(
    e: React.SyntheticEvent,
    id: string,
    number: number,
    deliveryAddress: string,
    expressCost: number
  ) {
    e.preventDefault();

    if (!ordersArray.includes(id)) {
      setOrdersArray(ordersArray.concat(id));
      setOrdersDeliveryAddressArray(
        ordersDeliveryAddressArray.concat(deliveryAddress)
      );
      setNumbersArray(numbersArray.concat(number));
      setExpressCostArray(expressCostArray.concat(expressCost));
    }
  }

  function unmergeItemClickHandler(e: React.SyntheticEvent, orderItem: IOrder) {
    openSubmitUnmergePopup(e);

    setCurrentOrderItem(orderItem);
  }

  function handleUnmergeChangeCheckbox() {
    setIsUnmergeCheckbox(!isUnmergeCheckbox);
  }

  async function submitMergePopupFunction() {
    if (
      ordersDeliveryAddressArray.every(
        (v) => v === ordersDeliveryAddressArray[0]
      ) &&
      !ordersDeliveryAddressArray.includes("")
    ) {
      if (
        expressCostArray.includes(0) &&
        Math.max.apply(null, expressCostArray) > 0
      ) {
        alert(`Ошибка!
          \n один из заказов имеет экспресс доставку
          \n ${expressCostArray.map((item, index) => {
            return `${numbersArray[index]} : ${
              expressCostArray[index] > 0
                ? "экспресс доставка"
                : "обычная доставка"
            }\n`;
          })}
          `);
      } else {
        await ordersArray.map((item, index) => {
          mergeOrders(ordersArray[index], ordersArray);
        });

        await setOrdersArray([]);
        await setNumbersArray([]);
        await setOrdersDeliveryAddressArray([]);
        await setIsMerge(false);

        await searchOrder(
          currentPage - 1,
          parseInt(data.search) ? parseInt(data.search) : data.search
        ).then((orders) => {
          setSearchedOrders(orders.orders);
          OrderData.setOrdersTableLength(orders.total);
        });
      }
    } else {
      alert(`Ошибка!
        \n Адерс досатвки в заказах не совпадает или адрес не указан
        \n ${numbersArray.map((item, index) => {
          return `${numbersArray[index]} : ${
            ordersDeliveryAddressArray[index] !== ""
              ? ordersDeliveryAddressArray[index]
              : "без адреса"
          }\n`;
        })}`);
    }
  }

  async function submitUnmergePopupFunction() {
    //unmergeOrders()
    if (isUnmergeCheckbox) {
      await currentOrderItem?.combinedOrder[0].combinedOrder.map((item) => {
        unmergeOrders(item);
      });

      await setIsUnmerge(false);

      await searchOrder(
        currentPage - 1,
        parseInt(data.search) ? parseInt(data.search) : data.search
      ).then((orders) => {
        setSearchedOrders(orders.orders);
        OrderData.setOrdersTableLength(orders.total);
      });
    } else {
      if (currentOrderItem?.combinedOrder[0].combinedOrder.length === 2) {
        await currentOrderItem?.combinedOrder[0].combinedOrder.map((item) => {
          unmergeOrders(item);
        });

        await setIsUnmerge(false);

        await searchOrder(
          currentPage - 1,
          parseInt(data.search) ? parseInt(data.search) : data.search
        ).then((orders) => {
          setSearchedOrders(orders.orders);
          OrderData.setOrdersTableLength(orders.total);
        });
      } else {
        await unmergeOrders(currentOrderItem?._id!);

        await setIsUnmerge(false);

        await searchOrder(
          currentPage - 1,
          parseInt(data.search) ? parseInt(data.search) : data.search
        ).then((orders) => {
          setSearchedOrders(orders.orders);
          OrderData.setOrdersTableLength(orders.total);
        });
      }
    }
  }

  function handleChangePage(page: number) {
    searchOrder(
      page - 1,
      parseInt(data.search) ? parseInt(data.search) : data.search
    ).then((orders) => {
      setSearchedOrders(orders.orders);
    });
    setCurrentPage(page);
  }

  function resetOrderСhapter() {
    sessionStorage.setItem("orderСhapter", "Order");
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
          autoFocus={true}
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
            searchedOrders!.map((orderItem) => {
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
                       ${styles["orders-table__header-item_number"]} ${
                      orderItem.expressCost > 0 && styles["express-del"]
                    }`}
                    href={`/order/change/${orderItem._id}`}
                    onClick={resetOrderСhapter}
                  >
                    {isMerge && (
                      <button
                        onClick={(e) =>
                          mergeItemClickHandler(
                            e,
                            orderItem._id,
                            orderItem.orderId,
                            orderItem.deliveryAddress,
                            orderItem.expressCost
                          )
                        }
                        className={styles["orders-table__item-merge"]}
                      >
                        {" "}
                        ✓
                      </button>
                    )}
                    {isUnmerge && (
                      <button
                        onClick={(e) => unmergeItemClickHandler(e, orderItem)}
                        className={styles["orders-table__item-merge"]}
                      >
                        {" "}
                        ✓
                      </button>
                    )}
                    {orderItem.orderId}
                    {orderItem.isSplit && (
                      <div className={styles["split-badge"]}>Сплит</div>
                    )}
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
                              orderItem.promoCodePercent +
                              orderItem.expressCost
                          ))}
                    {orderItem.status === "Черновик" && <br />}
                    {orderItem.status !== "Черновик" &&
                      Math.ceil(
                        parseFloat(orderItem.priceCNY) *
                          parseFloat(orderItem.currentRate) +
                          parseFloat(orderItem.priceDeliveryChina) +
                          parseFloat(orderItem.priceDeliveryRussia) +
                          parseFloat(orderItem.commission) -
                          orderItem.promoCodePercent +
                          orderItem.expressCost
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
              <input
                className={styles["pagination__page-input"]}
                type="number"
                name="current_page"
                value={currentPage}
                onChange={handleChange}
              />{" "}
              / {lastPageIndex}
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
        {filteredValue !== "" && (
          <div className={styles["orders-table__merge-container"]}>
            <button onClick={mergeHandler}>
              {isMerge ? "Применить" : "Объединить"}
            </button>
            <button onClick={unmergeHandler}>
              {isUnmerge ? "Применить" : "Разъединить"}
            </button>
            {isUnmerge && (
              <div className={styles["merge__checkbox"]}>
                <input
                  type="checkbox"
                  name="unmerge"
                  checked={isUnmergeCheckbox}
                  onChange={handleUnmergeChangeCheckbox}
                />
                <span>Разъединить все</span>
              </div>
            )}
            {isMerge && (
              <p className="">
                Объединённые: <strong>{numbersArray.join(", ")}</strong>{" "}
              </p>
            )}
          </div>
        )}
        <SubmitPopup
          submitText={`Объединить ${numbersArray.join(", ")}`}
          isSubmitPopup={isSubmitMergePopup}
          closeSubmitPopup={closeSubmitMergePopup}
          onSubmit={submitMergePopupFunction}
        />
        <SubmitPopup
          submitText={`Разъединить ${currentOrderItem?.orderId} ${
            isUnmergeCheckbox ? "(Разъединить все)" : ""
          }`}
          isSubmitPopup={isSubmitUnmergePopup}
          closeSubmitPopup={closeSubmitUnmergePopup}
          onSubmit={submitUnmergePopupFunction}
        />
      </div>
    </section>
  );
};

export default Search;
