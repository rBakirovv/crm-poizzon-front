import { useState } from "react";
import styles from "./Supply.module.css";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import SupplyData from "../../store/supplies";
import OrderData from "../../store/order";
import { createSupply, updateSupply } from "../../utils/Supply";
import { observer } from "mobx-react-lite";
import Preloader from "../UI/Preloader/Preloader";

const dayjs = require("dayjs");

const Supply = observer(() => {
  const [isSupplyCreate, setIsSupplyCreate] = useState(false);

  const [data, setData] = useState({
    supply: "",
    stock: "",
  });

  const [supplyDate, setSupplyDate] = useState("");

  const [isSupplyDelete, setIsSupplyDelete] = useState(false);

  const [isStockFilter, setIsStockFilter] = useState(false);

  const [isPreloader, setIsPreloader] = useState(false);

  function handleChange(e: React.ClipboardEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: e.clipboardData.getData("Text"),
    });

    if (target.name === "supply") {
      handleSupplyPaste(e.clipboardData.getData("Text"));
    }
  }

  const filteredSupplyItems = OrderData.orders.filter((filterItem) => {
    if (SupplyData.supply.supply.includes(filterItem.poizonCode)) {
      return filterItem;
    }
  });

  const totalSupplyChina =
    filteredSupplyItems &&
    filteredSupplyItems.reduce(function (sum, current) {
      return sum + parseFloat(current.priceDeliveryChina);
    }, 0);

  const totalSupplyRussia =
    filteredSupplyItems &&
    filteredSupplyItems.reduce(function (sum, current) {
      return sum + parseFloat(current.priceDeliveryRussia);
    }, 0);

  function handleSelectDateChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const currentArray = SupplyData.supplies.find(
      (supplyItem) => supplyItem._id === target.value
    );

    setTimeout(() => {
      setSupplyDate(target.value);
      SupplyData.setSupply(currentArray!);
    }, 100);
  }

  function openSupplyCreate() {
    setIsSupplyCreate(true);
  }

  function closeSupplyCreate() {
    setIsSupplyCreate(false);
  }

  function onSupplyCreate() {
    createSupply(dayjs(new Date(Date.now()).getTime()).format("DD-MM-YYYY"))
      .then((supply) => {
        SupplyData.pushSupply(supply);
      })
      .catch((err) => console.log(err));
  }

  function handleSupplyDeleteClick() {
    setIsSupplyDelete(!isSupplyDelete);
  }

  async function handleSupplyPaste(code: string) {
    await updateSupply(supplyDate, SupplyData.supply.supply.concat(code))
      .then((data) => {
        SupplyData.addSupply(data.supply);
        setIsPreloader(true);
      })
      .then(() => {
        setData({
          supply: "",
          stock: "",
        });
        setIsPreloader(false);
      })
      .catch((err) => {
        console.log(err);
        setIsPreloader(false);
      });
  }

  function deleteSupply(code: string) {
    const filteredArray = SupplyData.supply.supply.filter(
      (codeItem) => codeItem !== code
    );

    updateSupply(supplyDate, filteredArray)
      .then(() => {
        SupplyData.deleteSupply(code);
      })
      .catch((err) => console.log(err));
  }

  function handleStockFilter(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    if (target.value === "all-stock") {
      setIsStockFilter(false);
    }

    if (target.value === "non-supply") {
      setIsStockFilter(true);
    }
  }

  return (
    <section className={styles["supply"]}>
      <div className={styles["supply__container"]}>
        <button onClick={openSupplyCreate}>Создать поставку</button>
        <select
          onChange={handleSelectDateChange}
          className={styles["supply__select-date"]}
        >
          <option selected disabled value="">
            Выберите дату
          </option>
          {SupplyData.supplies.length > 0 &&
            SupplyData.supplies.map((supplyItem) => {
              return (
                <option value={supplyItem._id}>{supplyItem.createdAt}</option>
              );
            })}
        </select>
        <div className={styles["supply__match-container"]}>
          <div className={styles["supply__code-container"]}>
            <h4 className={styles["supply__code-title"]}>
              Поставка{" "}
              <div
                onClick={handleSupplyDeleteClick}
                className={styles["supply__delete"]}
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
                  ></path>
                  <path
                    d="M16.7201 1.93002H11.5801V1.27991C11.5801 0.568849 11.0113 0 10.3002 0H7.72009C7.00903 0 6.44018 0.568849 6.44018 1.27991V1.93002H1.27991C0.568849 1.93002 0 2.49887 0 3.20993C0 3.92099 0.568849 4.48984 1.27991 4.48984H16.7201C17.4312 4.48984 18 3.92099 18 3.20993C18 2.49887 17.4312 1.93002 16.7201 1.93002Z"
                    fill="black"
                  ></path>
                </svg>
              </div>
            </h4>
            <ul className={styles["supply__code-list"]}>
              {supplyDate !== "" &&
                SupplyData.supply.supply
                  .slice()
                  .reverse()
                  .filter((filterItem) => {
                    const currentOrder = OrderData.orders.find(
                      (findItem) => findItem.poizonCode === filterItem
                    );

                    return isStockFilter
                      ? currentOrder?.status !== "На складе в РФ"
                      : SupplyData.supply.supply.includes(filterItem);
                  })
                  .map((item, index) => {
                    const currentOrder = OrderData.orders.find(
                      (findItem) => findItem.poizonCode === item
                    );

                    return (
                      <li
                        key={index}
                        className={`${styles["supply__code"]} ${
                          currentOrder?.status !== "На складе в РФ" &&
                          styles["supply__code_yellow"]
                        }`}
                      >
                        {isSupplyDelete && (
                          <button
                            onClick={() => deleteSupply(item as string)}
                            className={styles["supply__code-delete"]}
                          >
                            X
                          </button>
                        )}
                        {item}
                      </li>
                    );
                  })}
            </ul>
            {supplyDate !== "" && (
              <input
                className={styles["supply__code-input"]}
                type="text"
                placeholder="Вставьте код"
                name="supply"
                value={data.supply}
                onPaste={handleChange}
              />
            )}
            {supplyDate !== "" && (
              <select
                onChange={handleStockFilter}
                className={styles["supply__filter"]}
              >
                <option value="all-stock" selected>
                  Все
                </option>
                <option value="non-supply">Нет на складе</option>
              </select>
            )}
          </div>
        </div>
        {supplyDate !== "" && (
          <>
            <p>Стоимость поставки Китай: {totalSupplyChina} ₽</p>
            <p>Стоимость поставки Россия: {totalSupplyRussia} ₽</p>
          </>
        )}
      </div>
      {isPreloader && <Preloader />}
      <SubmitPopup
        isSubmitPopup={isSupplyCreate}
        submitText={`Создать поставку ${dayjs(
          new Date(Date.now()).getTime()
        ).format("DD-MM-YYYY")}`}
        onSubmit={onSupplyCreate}
        closeSubmitPopup={closeSupplyCreate}
      />
    </section>
  );
});

export default Supply;