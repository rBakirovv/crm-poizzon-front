import { useState } from "react";
import styles from "./Split.module.css";
import { observer } from "mobx-react-lite";
import { BASE_URL_FRONT } from "../../utils/constants";
import CardsData from "../../store/cards";
import { getSecondSplitByDate } from "../../utils/Order";

const dayjs = require("dayjs");

var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Europe/Moscow");

const Split = observer(() => {
  const [isSplitTodayDropdownActive, setIsSplitTodayDropdownActive] =
    useState(false);

  const [date, setDate] = useState<string>("");

  const handleDateChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;

    const { value } = target;

    setDate(value);

    getSecondSplitByDate(value).then((orders) => {
      CardsData.setOrdersSplitSecondByDate(orders);
    });
  };

  function handleSplitTodayDropdownClick() {
    setIsSplitTodayDropdownActive(!isSplitTodayDropdownActive);
  }

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

  return (
    <section className={styles["split"]}>
      <div className={styles["split__container"]}>
        <h2 className={styles["split__title"]}>Сплит (2 часть)</h2>
        <div className={styles["split__day"]}>
          Сегодня {dayjs.tz(Date.now()).format("DD.MM")}:
        </div>
        <div className={styles["split__paid-dropdown"]}>
          <strong onClick={handleSplitTodayDropdownClick}>
            Оплаченые заказы
          </strong>
          <div
            className={`${styles["split__paid-dropdown-container"]} ${
              isSplitTodayDropdownActive &&
              styles["split__paid-dropdown-container_active"]
            }`}
          >
            <p className={styles["split__paid-dropdown-title"]}>
              <strong>2 часть:</strong>
            </p>
            <div className={styles["split__paid-dropdown-links"]}>
              {filteredTotalSplitSecondToday &&
                filteredTotalSplitSecondToday.map((item) => {
                  return (
                    <a
                      href={`${BASE_URL_FRONT}/order/change/${item._id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.orderId} {item.expressCost > 0 && "(экспресс)"}
                    </a>
                  );
                })}
            </div>
          </div>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <div>
            {" "}
            <strong>Поиск по дате</strong>
          </div>
          <input
            style={{ marginTop: "0.5rem" }}
            type="date"
            value={date}
            onChange={handleDateChange}
          />
          {CardsData.ordersSplitSecondByDate.length > 0 && (
            <div
              className={styles["split__paid-dropdown-links"]}
              style={{ marginTop: "1rem" }}
            >
              {CardsData.ordersSplitSecondByDate &&
                CardsData.ordersSplitSecondByDate.map((item) => {
                  return (
                    <a
                      href={`${BASE_URL_FRONT}/order/change/${item._id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.orderId} {item.expressCost > 0 && "(экспресс)"}
                    </a>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

export default Split;
