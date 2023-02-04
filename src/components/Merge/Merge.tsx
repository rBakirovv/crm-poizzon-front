import React, { useState } from "react";
import { IOrder } from "../../types/interfaces";
import { getOrderByNumber, mergeOrders } from "../../utils/Order";
//import OrdersList from "../OrdersList/OrdersList";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import TextInput from "../UI/TextInput/TextInput";
import styles from "./Merge.module.css";

const Merge = () => {
  const [data, setData] = useState({
    orders: "",
  });

  const [isSubmitPopup, setIsSubmitPopup] = useState(false);

  let ordersList: Array<string> = [];

  function openSubmitPopup(e: React.SyntheticEvent) {
    e.preventDefault();

    setIsSubmitPopup(true);
  }

  function closeSubmitPopup() {
    setIsSubmitPopup(false);
  }

  const handleChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: value,
    });
  };

  function handleSubmit() {
    data.orders.match(/(-?\d+(\.\d+)?)/g)?.map((item) => {
      getOrderByNumber(item)
        .then((order) => {
          order.map((orderItem: IOrder) => {
            ordersList.push(orderItem._id);
          });
        })
        .then(() => {
          ordersList.map((item, index) => {
            mergeOrders(ordersList[index], ordersList);
          });
        })
        .then(() => setData({ orders: "" }))
        .catch((err) => console.log(err));
    });
  }

  return (
    <section className={styles["merge"]}>
      <div className={styles["merge__container"]}>
        <form className={styles["merge__form"]} onSubmit={openSubmitPopup}>
          <h2 className={styles["merge__form-title"]}>Объединить заказы</h2>
          <TextInput
            label="Номера заказов через запятую"
            name="orders"
            placeholder="131, 123, 81"
            required={true}
            value={data.orders}
            handleChange={handleChange}
          />
          <button className={styles["merge__submit"]} type="submit">
            Объединить
          </button>
        </form>
      </div>
      <SubmitPopup
        submitText={`Объединить заказы ${
          data.orders !== ""
            ? data.orders.match(/(-?\d+(\.\d+)?)/g)?.join(", ")
            : ""
        }`}
        isSubmitPopup={isSubmitPopup}
        closeSubmitPopup={closeSubmitPopup}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

export default Merge;
