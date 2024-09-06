import React, { FC, useEffect, useState } from "react";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import styles from "./RateComponent.module.css";
import {
  createRate,
  updateCommissionStatistics,
  updateRate,
  updateVeritableRate,
} from "../../utils/Rate";
import RateData from "../../store/rate";
import VeritableRateData from "../../store/veritableRate";
import UserData from "../../store/user";
import CommissionData from "../../store/commission";
import { IRate } from "../../types/interfaces";
import { observer } from "mobx-react-lite";

interface IRateComponentProps {
  currentRate: IRate;
  veritableRate: IRate;
  isFirstRate: boolean;
}

const RateComponent: FC<IRateComponentProps> = observer(({
  currentRate,
  veritableRate,
  isFirstRate,
}) => {
  const [data, setData] = useState({
    sneakersChina: CommissionData.commission.sneakersChina,
    sneakersRussia: CommissionData.commission.sneakersRussia,
    winterShoesChina: CommissionData.commission.winterShoesChina,
    winterShoesRussia: CommissionData.commission.winterShoesRussia,
    jacketChina: CommissionData.commission.jacketChina,
    jacketRussia: CommissionData.commission.jacketRussia,
    sweatshirtChina: CommissionData.commission.sweatshirtChina,
    sweatshirtRussia: CommissionData.commission.sweatshirtRussia,
    tShirtChina: CommissionData.commission.tShirtChina,
    tShirtRussia: CommissionData.commission.tShirtRussia,
    socksChina: CommissionData.commission.socksChina,
    socksRussia: CommissionData.commission.socksRussia,
    bagChina: CommissionData.commission.bagChina,
    bagRussia: CommissionData.commission.bagRussia,
    perfumeChina: CommissionData.commission.perfumeChina,
    perfumeRussia: CommissionData.commission.perfumeRussia,
    pantsChina: CommissionData.commission.pantsChina,
    pantsRussia: CommissionData.commission.pantsRussia,
    headdressChina: CommissionData.commission.headdressChina,
    headdressRussia: CommissionData.commission.headdressRussia,
    techniqueChina: CommissionData.commission.techniqueChina,
    techniqueRussia: CommissionData.commission.techniqueRussia,
    otherChina: CommissionData.commission.otherChina,
    otherRussia: CommissionData.commission.otherRussia,
    commission: CommissionData.commission.commission,
  });

  const [isSubmitPopup, setIsSubmitPopup] = useState(false);

  const [isVeritableRateSubmitPopup, setIsVeritableRateSubmitPopup] =
    useState(false);

  const [isSubmitCommissionPopup, setIsSubmitCommissionPopup] = useState(false);

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    if (target.name === "rate") {
      RateData.setNewRate({
        rate: target.value,
        _id: currentRate._id,
      });
    }

    if (target.name === "veritableRate") {
      VeritableRateData.setNewRate({
        rate: target.value,
        _id: veritableRate._id,
      });
    }
  }

  function handleChangeCommission(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: value,
    });
  }

  function openSubmitPopup() {
    setIsSubmitPopup(true);
  }

  function closeSubmitPopup() {
    setIsSubmitPopup(false);
  }

  function openVeritableRateSubmitPopup() {
    setIsVeritableRateSubmitPopup(true);
  }

  function closeVeritableRateSubmitPopup() {
    setIsVeritableRateSubmitPopup(false);
  }

  function openCommissionPopup() {
    setIsSubmitCommissionPopup(true);
  }

  function closeCommissionPopup() {
    setIsSubmitCommissionPopup(false);
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

  function handleSubmitChangeVeritableRate() {
    updateVeritableRate(veritableRate._id!, veritableRate.rate)
      .then((updatedRate) => {
        VeritableRateData.setNewRate({
          rate: updatedRate.rate,
          _id: updatedRate._id,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleSubmitChangeCommission() {
    updateCommissionStatistics(
      CommissionData.commission._id!,
      data.sneakersChina,
      data.sneakersRussia,
      data.winterShoesChina,
      data.winterShoesRussia,
      data.jacketChina,
      data.jacketRussia,
      data.sweatshirtChina,
      data.sweatshirtRussia,
      data.tShirtChina,
      data.tShirtRussia,
      data.socksChina,
      data.socksRussia,
      data.bagChina,
      data.bagRussia,
      data.perfumeChina,
      data.perfumeRussia,
      data.pantsChina,
      data.pantsRussia,
      data.headdressChina,
      data.headdressRussia,
      data.techniqueChina,
      data.techniqueRussia,
      data.otherChina,
      data.otherRussia,
      data.commission
    ).then((commission) => {
      CommissionData.setUpdatedCommission(commission);
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
          {(UserData.userData.position === "Создатель" ||
            UserData.userData.position === "Главный администратор") && (
            <button
              className={styles["rate__submit"]}
              onClick={openSubmitPopup}
              type="button"
            >
              Сохранить
            </button>
          )}
        </form>
        <h2 className={styles["rate__title"]}>Истинный курс CNY</h2>
        <form className={styles["rate__form"]}>
          <input
            className={styles["rate__input"]}
            name="veritableRate"
            type="text"
            value={veritableRate.rate}
            onChange={handleChange}
          />
          {(UserData.userData.position === "Создатель" ||
            UserData.userData.position === "Главный администратор") && (
            <button
              className={styles["rate__submit"]}
              onClick={openVeritableRateSubmitPopup}
              type="button"
            >
              Сохранить
            </button>
          )}
        </form>
        <h2 className={styles["rate__title"]}>Доставка/комиссия</h2>
        <form className={styles["rate__commission-form"]}>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Кроссовки Китай</label>
            <input
              className={styles["rate__delivery-input"]}
              name="sneakersChina"
              value={data.sneakersChina}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Кроссовки Россия</label>
            <input
              className={styles["rate__delivery-input"]}
              name="sneakersRussia"
              value={data.sneakersRussia}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Зимняя обувь Китай</label>
            <input
              className={styles["rate__delivery-input"]}
              name="winterShoesChina"
              value={data.winterShoesChina}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Зимняя обувь Россия</label>
            <input
              className={styles["rate__delivery-input"]}
              name="winterShoesRussia"
              value={data.winterShoesRussia}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Куртка Китай</label>
            <input
              className={styles["rate__delivery-input"]}
              name="jacketChina"
              value={data.jacketChina}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Куртка Россия</label>
            <input
              className={styles["rate__delivery-input"]}
              name="jacketRussia"
              value={data.jacketRussia}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Толстовка Китай</label>
            <input
              className={styles["rate__delivery-input"]}
              name="sweatshirtChina"
              value={data.sweatshirtChina}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Толстовка Россия</label>
            <input
              className={styles["rate__delivery-input"]}
              name="sweatshirtRussia"
              value={data.sweatshirtRussia}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Футболка Китай</label>
            <input
              className={styles["rate__delivery-input"]}
              name="tShirtChina"
              value={data.tShirtChina}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Футболка Россия</label>
            <input
              className={styles["rate__delivery-input"]}
              name="tShirtRussia"
              value={data.tShirtRussia}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Носки Китай</label>
            <input
              className={styles["rate__delivery-input"]}
              name="socksChina"
              value={data.socksChina}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Носки Россия</label>
            <input
              className={styles["rate__delivery-input"]}
              name="socksRussia"
              value={data.socksRussia}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Сумка Китай</label>
            <input
              className={styles["rate__delivery-input"]}
              name="bagChina"
              value={data.bagChina}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Сумка Россия</label>
            <input
              className={styles["rate__delivery-input"]}
              name="bagRussia"
              value={data.bagRussia}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Духи Китай</label>
            <input
              className={styles["rate__delivery-input"]}
              name="perfumeChina"
              value={data.perfumeChina}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Духи Россия</label>
            <input
              className={styles["rate__delivery-input"]}
              name="perfumeRussia"
              value={data.perfumeRussia}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Штаны Китай</label>
            <input
              className={styles["rate__delivery-input"]}
              name="pantsChina"
              value={data.pantsChina}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Штаны Россия</label>
            <input
              className={styles["rate__delivery-input"]}
              name="pantsRussia"
              value={data.pantsRussia}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Головной убор Китай</label>
            <input
              className={styles["rate__delivery-input"]}
              name="headdressChina"
              value={data.headdressChina}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Головной убор Россия</label>
            <input
              className={styles["rate__delivery-input"]}
              name="headdressRussia"
              value={data.headdressRussia}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Техника Китай</label>
            <input
              className={styles["rate__delivery-input"]}
              name="techniqueChina"
              value={data.techniqueChina}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Техника Россия</label>
            <input
              className={styles["rate__delivery-input"]}
              name="techniqueRussia"
              value={data.techniqueRussia}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Прочее Китай</label>
            <input
              className={styles["rate__delivery-input"]}
              name="otherChina"
              value={data.otherChina}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Прочее Россия</label>
            <input
              className={styles["rate__delivery-input"]}
              name="otherRussia"
              value={data.otherRussia}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          <div className={styles["rate__delivery-input-container"]}>
            <label>Комиссия</label>
            <input
              className={styles["rate__delivery-input"]}
              name="commission"
              value={data.commission}
              onChange={handleChangeCommission}
              type="text"
              required
            />
          </div>
          {(UserData.userData.position === "Создатель" ||
            UserData.userData.position === "Главный администратор" ||
            UserData.userData.position === "Администратор") && (
            <button
              className={styles["rate__submit"]}
              type="button"
              onClick={openCommissionPopup}
            >
              Сохранить
            </button>
          )}
        </form>
      </div>
      <SubmitPopup
        submitText={`Выставить курс CNY ${RateData.rate.rate}₽`}
        onSubmit={handleSubmitChangeRate}
        isSubmitPopup={isSubmitPopup}
        closeSubmitPopup={closeSubmitPopup}
      />
      <SubmitPopup
        submitText={`Выставить ист. курс CNY ${VeritableRateData.veritableRate.rate}₽`}
        onSubmit={handleSubmitChangeVeritableRate}
        isSubmitPopup={isVeritableRateSubmitPopup}
        closeSubmitPopup={closeVeritableRateSubmitPopup}
      />
      {isSubmitCommissionPopup && (
        <SubmitPopup
          submitText={`Изменить коммисию/стоимость достави`}
          onSubmit={handleSubmitChangeCommission}
          isSubmitPopup={isSubmitCommissionPopup}
          closeSubmitPopup={closeCommissionPopup}
        />
      )}
    </section>
  );
});

export default RateComponent;
