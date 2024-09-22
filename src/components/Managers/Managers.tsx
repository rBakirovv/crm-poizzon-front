import { useState } from "react";
import styles from "./Managers.module.css";
import { observer } from "mobx-react-lite";
import { BASE_URL_FRONT } from "../../utils/constants";
import usersList from "../../store/usersList";
import { getManagersByDate } from "../../utils/Order";
import { IOrder } from "../../types/interfaces";

const Managers = observer(() => {
  const [date, setDate] = useState<string>("");
  const [manager, setManager] = useState<string>("");

  const [orders, setOrders] = useState<Array<IOrder>>([]);
  const [ordersSplit, setOrdersSplit] = useState<Array<IOrder>>([]);

  const [isUpdated, setIsUpdated] = useState(false);

  const handleDateChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;

    const { value } = target;

    setDate(value);
  };

  const handleManagerChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;

    const { value } = target;

    setManager(value);
  };

  function handleSearchCkick() {
    if (date !== "" && manager !== "") {
      setIsUpdated(false);

      getManagersByDate(date, manager)
        .then((serchedOrders) => {
          setOrders(serchedOrders.orders);
          setOrdersSplit(serchedOrders.ordersSplit);
          setIsUpdated(true);
        })
        .then(() => {});
    }
  }

  return (
    <section className={styles["managers"]}>
      <div className={styles["managers__container"]}>
        <h2 className={styles["managers__title"]}>Менеджеры</h2>
        <div style={{ marginTop: "1rem" }}>
          <div>
            {" "}
            <strong>Дата</strong>
          </div>
          <input
            style={{ marginTop: "0.5rem" }}
            type="date"
            value={date}
            onChange={handleDateChange}
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <div>
            {" "}
            <strong>Менеджер</strong>
          </div>
          <select
            style={{ marginTop: "0.5rem" }}
            name="managers"
            id="managers"
            value={manager}
            onChange={handleManagerChange}
          >
            <option value="" selected disabled>
              -- Выберите --
            </option>
            {usersList.usersList.length &&
              usersList.usersList.map((item) => {
                return <option value={item.name}>{item.name}</option>;
              })}
          </select>
        </div>
        <button style={{ marginTop: "1rem" }} onClick={handleSearchCkick}>
          Обновить
        </button>
        {isUpdated && orders.length > 0 && (
          <div style={{ marginTop: "1.5rem" }}>
            <div>
              {" "}
              <strong>
                {manager} {date}:
              </strong>
              <div style={{ marginTop: "0.5rem" }}>
                Кол-во за день: {orders.length}
              </div>
              <div
                className={styles["managers__links"]}
                style={{ marginTop: "0.5rem" }}
              >
                {orders &&
                  orders.map((item) => {
                    return (
                      <a
                        href={`${BASE_URL_FRONT}/order/change/${item._id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.orderId} {item.expressCost > 0 && "(экспресс)"} {item.isSplit && "(сплит)"}
                      </a>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
        {isUpdated && orders.length === 0 && (
          <div style={{ marginTop: "1.5rem" }}>
            <div>
              {" "}
              <strong>
                {manager} {date}:
              </strong>
              <div style={{ marginTop: "0.5rem" }}>Кол-во за день: 0</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

export default Managers;
