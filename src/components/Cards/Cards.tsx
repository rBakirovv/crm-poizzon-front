import styles from "./Cards.module.css";
import { IPayments } from "../../types/interfaces";
import CardsData from "../../store/cards";
import { FC, useState } from "react";
import { updateCardsStatistics } from "../../utils/Order";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import { observer } from "mobx-react-lite";

interface ICardsProps {
  payments: Array<IPayments>;
}

const dayjs = require("dayjs");

var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Europe/Moscow");

const Cards: FC<ICardsProps> = observer(({ payments }) => {
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

  const filteredTotalPaidToday =
    CardsData.ordersTodayPaidAt &&
    CardsData.ordersTodayPaidAt.filter((item) => {
      if (
        dayjs.tz(new Date(item.paidAt)).format("DD-MM-YY") ===
        dayjs.tz(new Date(Date.now())).format("DD-MM-YY")
      ) {
        return true;
      }
    });

  const totalPaidToday =
    filteredTotalPaidToday.length &&
    filteredTotalPaidToday.reduce(function (sum, current) {
      return (
        sum +
        (parseFloat(current.priceCNY) * parseFloat(current.currentRate) +
          parseFloat(current.priceDeliveryChina) +
          parseFloat(current.priceDeliveryRussia) +
          parseFloat(current.commission) -
          current.promoCodePercent)
      );
    }, 0);

  const filteredTotalSplitToday =
    CardsData.ordersTodaySplitAt &&
    CardsData.ordersTodaySplitAt.filter((item) => {
      if (
        dayjs.tz(new Date(item.paidAtSplit)).format("DD-MM-YY") ===
        dayjs.tz(new Date(Date.now())).format("DD-MM-YY")
      ) {
        return true;
      }
    });

  const totalSplitToday =
    filteredTotalSplitToday.length &&
    filteredTotalSplitToday.reduce(function (sum, current) {
      return (
        sum +
        (parseFloat(current.priceCNY) * parseFloat(current.currentRate) +
          parseFloat(current.priceDeliveryChina) +
          parseFloat(current.priceDeliveryRussia) +
          parseFloat(current.commission) -
          current.promoCodePercent)
      );
    }, 0);

  const filteredTotalSplitSecondToday =
    CardsData.ordersTodaySplitSecondAt &&
    CardsData.ordersTodaySplitSecondAt.filter((item) => {
      if (
        dayjs.tz(new Date(item.paidAtSplitSecond)).format("DD-MM-YY") ===
        dayjs.tz(new Date(Date.now())).format("DD-MM-YY")
      ) {
        return true;
      }
    });

  const totalSplitSecondToday =
    filteredTotalSplitSecondToday.length &&
    filteredTotalSplitSecondToday.reduce(function (sum, current) {
      return (
        sum +
        (parseFloat(current.priceCNY) * parseFloat(current.currentRate) +
          parseFloat(current.priceDeliveryChina) +
          parseFloat(current.priceDeliveryRussia) +
          parseFloat(current.commission) -
          current.promoCodePercent)
      );
    }, 0);

  const filteredTotalPaidYesterday =
    CardsData.ordersYesterdayPaidAt &&
    CardsData.ordersYesterdayPaidAt.filter((item) => {
      if (
        dayjs.tz(new Date(item.paidAt)).format("DD-MM-YY") ===
        dayjs.tz(new Date(Date.now() - 86400000)).format("DD-MM-YY")
      ) {
        return true;
      }
    });

  const totalPaidYesterday =
    filteredTotalPaidYesterday.length &&
    filteredTotalPaidYesterday.reduce(function (sum, current) {
      return (
        sum +
        (parseFloat(current.priceCNY) * parseFloat(current.currentRate) +
          parseFloat(current.priceDeliveryChina) +
          parseFloat(current.priceDeliveryRussia) +
          parseFloat(current.commission) -
          current.promoCodePercent)
      );
    }, 0);

  const filteredTotalSplitYesterday =
    CardsData.ordersYesterdaySplitAt &&
    CardsData.ordersYesterdaySplitAt.filter((item) => {
      if (
        dayjs.tz(new Date(item.paidAtSplit)).format("DD-MM-YY") ===
        dayjs.tz(new Date(Date.now() - 86400000)).format("DD-MM-YY")
      ) {
        return true;
      }
    });

  const totalSplitYesterday =
    filteredTotalSplitYesterday.length &&
    filteredTotalSplitYesterday.reduce(function (sum, current) {
      return (
        sum +
        (parseFloat(current.priceCNY) * parseFloat(current.currentRate) +
          parseFloat(current.priceDeliveryChina) +
          parseFloat(current.priceDeliveryRussia) +
          parseFloat(current.commission) -
          current.promoCodePercent)
      );
    }, 0);

  const filteredTotalSplitSecondYesterday =
    CardsData.ordersYesterdaySplitSecondAt &&
    CardsData.ordersYesterdaySplitSecondAt.filter((item) => {
      if (
        dayjs.tz(new Date(item.paidAtSplitSecond)).format("DD-MM-YY") ===
        dayjs.tz(new Date(Date.now() - 86400000)).format("DD-MM-YY")
      ) {
        return true;
      }
    });

  const totalSplitSecondYesterday =
    filteredTotalSplitSecondYesterday.length &&
    filteredTotalSplitSecondYesterday.reduce(function (sum, current) {
      return (
        sum +
        (parseFloat(current.priceCNY) * parseFloat(current.currentRate) +
          parseFloat(current.priceDeliveryChina) +
          parseFloat(current.priceDeliveryRussia) +
          parseFloat(current.commission) -
          current.promoCodePercent)
      );
    }, 0);

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
      <div className={styles["cards__day"]}>
        Сегодня {dayjs.tz(Date.now()).format("DD.MM")}:
      </div>
      <div className={styles["cards__paid-at"]}>
        Оплачено сегодня: <strong>{Math.ceil(totalPaidToday)} ₽</strong>
      </div>
      <div className={styles["cards__paid-at"]}>
        Оплачено сегодня (сплит):{" "}
        <strong>{totalSplitToday + totalSplitSecondToday} ₽</strong>
      </div>
      <div className={styles["cards__day"]}>
        Вчера {dayjs.tz(Date.now() - 86400000).format("DD.MM")}:
      </div>
      <div className={styles["cards__paid-at"]}>
        Оплачено сегодня: <strong>{Math.ceil(totalPaidYesterday)} ₽</strong>
      </div>
      <div className={styles["cards__paid-at"]}>
        Оплачено сегодня (сплит):{" "}
        <strong>{totalSplitYesterday + totalSplitSecondYesterday} ₽</strong>
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
});

export default Cards;
