import React, { useState } from "react";
import { getOrderByNumber, unmergeOrders } from "../../utils/Order";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import TextInput from "../UI/TextInput/TextInput";
import styles from "./Merge.module.css";
import Link from "next/link";

const Merge = () => {
  const [data, setData] = useState({
    orders: "",
  });

  const [isSubmitPopup, setIsSubmitPopup] = useState(false);

  const [isUnmerge, setIsUnmerge] = useState(true);

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

  async function handleSubmit() {
    if (isUnmerge) {
      await getOrderByNumber(
        data.orders.match(/(-?\d+(\.\d+)?)/g)?.slice(0, 1)!
      )
        .then((orderData) => {
          orderData[0].combinedOrder[0].combinedOrder.map((item: any) => {
            unmergeOrders(item);
          });
        })
        .catch((err) => console.log(err));

      await setData({ orders: "" });
    }
  }

  function handleUnmergeChange() {
    setIsUnmerge(!isUnmerge);
  }

  return (
    <section className={styles["merge"]}>
      <div className={styles["merge__container"]}>
        <form className={styles["merge__form"]} onSubmit={openSubmitPopup}>
          <h2 className={styles["merge__form-title"]}>
            Объединить/Разъединить заказы
          </h2>
          <TextInput
            label="Номера заказов через запятую"
            name="orders"
            placeholder="131, 123, 81"
            required={true}
            value={data.orders}
            handleChange={handleChange}
          />
          <button className={styles["merge__submit"]} type="submit">
            {isUnmerge ? "Разъединить" : "Объединить"}
          </button>
        </form>
        <div className={styles["merge__checkbox"]}>
          <input
            type="checkbox"
            name="unmerge"
            checked={isUnmerge}
            onChange={handleUnmergeChange}
          />
          <span>Удалить объединение</span>
        </div>
        <div style={{ color: "red", marginTop: "1rem" }}>
          Объединение заказов происходит <Link href="/search-order"><strong>в поиске</strong></Link>
        </div>
      </div>
      <SubmitPopup
        submitText={`${
          isUnmerge ? "Разъединить заказы" : "Объединить заказы"
        } ${
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
