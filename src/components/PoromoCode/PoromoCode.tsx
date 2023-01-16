import React, { FC, useEffect, useState } from "react";
import NumberInput from "../UI/NumberInput/NumberInput";
import TextInput from "../UI/TextInput/TextInput";
import styles from "./PoromoCode.module.css";
import { IPromoCode } from "../../types/interfaces";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import { deletePoromoCode, createPoromoCode } from "../../utils/PoromoCode";
import PromoCodeData from "../../store/promo-code";

interface IPoromoCodeProps {
  promoCodes: Array<IPromoCode>;
}

const PoromoCode: FC<IPoromoCodeProps> = ({ promoCodes }) => {
  const [isSubmitPopup, setIsSubmitPopup] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoCodeId, setPromoCodeId] = useState<string>("");
  const [promoCodeData, setPromoCodeData] = useState({
    code: "",
    percent: 0,
  });

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setPromoCodeData({
      ...promoCodeData,
      [name]: value,
    });
  }

  function closeSubmitPopup() {
    setIsSubmitPopup(false);
  }

  function openSubmitPopup(promoCode: string, id: string) {
    setPromoCode(promoCode);
    setPromoCodeId(id);
    setIsSubmitPopup(true);
  }

  function submitPopupFunction() {
    deletePoromoCode(promoCodeId)
      .then(() => {
        PromoCodeData.deletePromoCode(promoCodeId);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function createPoromoCodeFunction(e: React.SyntheticEvent) {
    e.preventDefault();
    createPoromoCode(promoCodeData.code, promoCodeData.percent)
      .then((promo) => {
        PromoCodeData.createPromoCode(promo);
      })
      .then(() => {
        setPromoCodeData({
          code: "",
          percent: 0,
        });
      });
  }

  useEffect(() => {
    if (promoCodeData.percent <= -1 || promoCodeData.percent > 500) {
      setPromoCodeData({
        code: promoCodeData.code,
        percent: 0,
      });
    }
  }, [promoCodeData.percent]);

  return (
    <section className={styles["promo-code"]}>
      <form
        className={styles["promo-code__form"]}
        onSubmit={createPoromoCodeFunction}
      >
        <h2 className={styles["promo-code__title"]}>Создать новый промо-код</h2>
        <TextInput
          label="Код"
          name="code"
          placeholder="POIZONQQ"
          value={promoCodeData.code}
          handleChange={handleChange}
          required={true}
        />
        <NumberInput
          label="Скидка (число)"
          name="percent"
          placeholder="Максимум 500₽"
          value={promoCodeData.percent}
          handleChange={handleChange}
          required={true}
        />
        <button className={styles["promo-code__submit"]} type="submit">
          Cоздать
        </button>
      </form>
      <div className={styles["promo-code__list-container"]}>
        <h2 className={styles["promo-code__title"]}>Промо-коды</h2>
        <ul className={styles["promo-code__table-list"]}>
          {promoCodes.map((promoCodeItem) => {
            return (
              <li
                key={promoCodeItem.code}
                className={styles["promo-code__table-item"]}
              >
                <button
                  className={styles["promo-code__delete-button"]}
                  onClick={() =>
                    openSubmitPopup(promoCodeItem.code, promoCodeItem._id!)
                  }
                >
                </button>
                <div className={styles["promo-code__table-info-container"]}>
                  <h4 className={styles["promo-code__table-info-title"]}>
                    {promoCodeItem.code}
                  </h4>
                  <p className={styles["promo-code__table-info-number"]}>
                    {promoCodeItem.percent} ₽
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <SubmitPopup
        submitText={`Удалить промо-код ${promoCode}`}
        isSubmitPopup={isSubmitPopup}
        closeSubmitPopup={closeSubmitPopup}
        onSubmit={submitPopupFunction}
      />
    </section>
  );
};

export default PoromoCode;
