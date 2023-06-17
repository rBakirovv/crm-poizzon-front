import styles from "./Cards.module.css";
import { IPayments } from "../../types/interfaces";
import OrderData from "../../store/order";
import CardsData from "../../store/cards";
import { FC, useState } from "react";
import { updateCardsStatistics } from "../../utils/Order";
import SubmitPopup from "../SubmitPopup/SubmitPopup";

interface ICardsProps {
  payments: Array<IPayments>;
}

const dayjs = require("dayjs");

var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Europe/Moscow");

const Cards: FC<ICardsProps> = ({ payments }) => {
  const [isDateUpdatePopup, setIsDateUpdatePopup] = useState(false);

  function openDateUpdatePopup() {
    setIsDateUpdatePopup(true);
  }

  function closeDateUpdatePopup() {
    setIsDateUpdatePopup(false);
  }

  function handleCardsUpdate() {
    updateCardsStatistics(CardsData.cards._id!)
      .then((data) => {
        CardsData.setUpdatedDate(data);
      })
      .then(() => alert("Успешно! Необходимо обновить страницу"));
  }

  return (
    <section className={styles["cards"]}>
      <div className={styles["cards__container"]}>
        <h2 className={styles["cards__tile"]}>
          Статистика после{" "}
          {dayjs
            .tz(new Date(CardsData.cards.updatedAt!))
            .format("DD-MM-YYYY в HH:mm")}
        </h2>
        <ul className={styles["cards__list"]}>
          {payments.map((item) => {
            const filterItems = CardsData.ordersAfterUpdatedAt.filter(
              (filterItem) => {
                if (filterItem.payment === `${item.title} ${item.number}`) {
                  return filterItem;
                }
              }
            );

            const total =
              filterItems &&
              filterItems.reduce(function (sum, current) {
                return (
                  sum +
                  (parseFloat(current.priceCNY) *
                    parseFloat(current.currentRate) +
                    parseFloat(current.priceDeliveryChina) +
                    parseFloat(current.priceDeliveryRussia) +
                    parseFloat(current.commission) -
                    current.promoCodePercent)
                );
              }, 0);

            return (
              <li key={item._id} className={styles["cards__list-item"]}>
                <p className={styles["cards__list-card"]}>
                  {item.title} {item.number}
                </p>
                <p className={styles["cards__list-card-sum"]}>
                  {Math.ceil(total)} ₽
                </p>
              </li>
            );
          })}
        </ul>
      </div>
      <button
        onClick={openDateUpdatePopup}
        className={styles["cards__button-update"]}
      >
        Обновить время отсчёта
      </button>
      <SubmitPopup
        isSubmitPopup={isDateUpdatePopup}
        closeSubmitPopup={closeDateUpdatePopup}
        onSubmit={handleCardsUpdate}
        submitText={"Обновить время отсчёта статистики"}
      />
    </section>
  );
};

export default Cards;
