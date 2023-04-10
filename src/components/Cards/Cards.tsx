import styles from "./Cards.module.css";
import { IPayments } from "../../types/interfaces";
import OrderData from "../../store/order";
import { FC } from "react";

interface ICardsProps {
  payments: Array<IPayments>;
}

const dayjs = require("dayjs");

const Cards: FC<ICardsProps> = ({ payments }) => {
  return (
    <section className={styles["cards"]}>
      <div className={styles["cards__container"]}>
        <h2 className={styles["cards__tile"]}>
          Статистика{" "}
          {dayjs(new Date(Date.now()).getTime()).format("DD-MM-YYYY")}
        </h2>
        <ul className={styles["cards__list"]}>
          {payments.map((item) => {
            const filterItems = OrderData.orders.filter((filterItem) => {
              if (
                dayjs(filterItem.paidAt).format("DD-MM-YYYY") ===
                  dayjs(new Date(Date.now())).format("DD-MM-YYYY") &&
                filterItem.payment === `${item.title} ${item.number}`
              ) {
                return filterItem;
              }
            });

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
    </section>
  );
};

export default Cards;
