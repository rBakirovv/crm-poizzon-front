import React, { FC, useState } from "react";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import styles from "./RateComponent.module.css";
import { createRate, updateRate } from "../../utils/Rate";
import RateData from "../../store/rate";
import { IRate } from "../../types/interfaces";

interface IRateComponentProps {
  currentRate: IRate;
  isFirstRate: boolean;
}

const RateComponent: FC<IRateComponentProps> = ({
  currentRate,
  isFirstRate,
}) => {
  const [isSubmitPopup, setIsSubmitPopup] = useState(false);

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    RateData.setNewRate({
      rate: target.value,
      _id: currentRate._id,
    });
  }

  function openSubmitPopup() {
    setIsSubmitPopup(true);
  }

  function closeSubmitPopup() {
    setIsSubmitPopup(false);
  }

  function handleSubmitChangeRate() {
    updateRate(currentRate._id!, currentRate.rate)
      .then((updatedRate) => {
        RateData.setNewRate({
          rate: updatedRate.rate,
          _id: updatedRate._id,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function createDefaultRate() {
    createRate()
      .then((rate) => {
        RateData.setNewRate(rate);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <section className={styles["rate"]}>
      <div className={styles["rate__container"]}>
        {isFirstRate && (
          <div className={styles["rate__create-container"]}>
            <h2 className={styles["rate__title"]}>
              Cоздать стартовый крус CNY:
            </h2>
            <button
              className={styles["rate__submit"]}
              type="button"
              onClick={createDefaultRate}
            >
              Создать
            </button>
          </div>
        )}
        <h2 className={styles["rate__title"]}>Текущий курс CNY</h2>
        <form className={styles["rate__form"]}>
          <input
            className={styles["rate__input"]}
            name="rate"
            type="text"
            value={currentRate.rate}
            onChange={handleChange}
          />
          <button
            className={styles["rate__submit"]}
            onClick={openSubmitPopup}
            type="button"
          >
            Сохранить
          </button>
        </form>
      </div>
      <SubmitPopup
        submitText={`Выставить курс CNY ${RateData.rate.rate}₽`}
        onSubmit={handleSubmitChangeRate}
        isSubmitPopup={isSubmitPopup}
        closeSubmitPopup={closeSubmitPopup}
      />
    </section>
  );
};

export default RateComponent;
