import React, { FC, useEffect, useRef } from "react";
import styles from "./OverudeOrder.module.css";

interface IOverudeOrderProps {
  isOverudeOrderModalOpen: boolean;
  closePopup: () => void;
}

const OverudeOrder: FC<IOverudeOrderProps> = ({
  isOverudeOrderModalOpen,
  closePopup,
}) => {
  const ref = useRef(null);

  function closeSlider(e: MouseEvent) {
    if (e && e.target === ref.current) {
      closePopup();
    }
  }

  useEffect(() => {
    document.addEventListener("click", closeSlider);
    return () => document.removeEventListener("click", closeSlider);
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles["overude-order"]} ${
        isOverudeOrderModalOpen && styles["overude-order_active"]
      }`}
    >
      <div className={styles["overude-order__modal-container"]}>
        <button onClick={closePopup} className={styles["overude-order__close"]}>
          ×
        </button>
        <span className={styles["overude-order__modal-emoji"]}>😢</span>
        <div className={styles["overude-order__modal-text"]}>
          Упс! Время для оплаты заказа истекло. Стоимость товара могла
          измениться. <br /> <br /> Если вы готовы оплатить товар, сообщите
          менеджеру в{" "}
          <a
            className={styles["overude-order__modal-link"]}
            href="https://t.me/poizonqq"
            target="_blank"
            rel="noreferrer"
          >
            Telegram
          </a>
        </div>
      </div>
    </div>
  );
};

export default OverudeOrder;
