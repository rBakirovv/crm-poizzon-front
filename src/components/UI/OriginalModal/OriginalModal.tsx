import { FC } from "react";
import styles from "../UserDataModal/UserDataModal.module.css";

interface IOriginalModalProps {
  closeOriginalModalPopup: () => void;
  isOriginalModalActive: boolean;
}

const OriginalModal: FC<IOriginalModalProps> = ({
  closeOriginalModalPopup,
  isOriginalModalActive,
}) => {
  const handleOverlayClick = (event: React.SyntheticEvent) => {
    if (event.target === event.currentTarget) {
      closeOriginalModalPopup();
    }
  };

  return (
    <div
      className={`${styles["user-data-modal"]} ${
        isOriginalModalActive && styles["user-data-modal--active"]
      }`}
      onClick={handleOverlayClick}
    >
      <button
        onClick={closeOriginalModalPopup}
        className={styles["user-data-modal__close"]}
      >
        ×
      </button>
      <div
        className={`${styles["user-data-modal__container"]} ${styles["user-data-modal__container_active"]}`}
      >
        <h2 className={styles["user-data-modal__title"]}>
          Гарантируем оригинальность
        </h2>
        <span className={styles["order-pay__personal-data"]}>
          Все товары проходят проверку, есть сертификат и пломба.
        </span>
        <span className={styles["order-pay__personal-data"]}>
          Материал, подошва, швы, ярлычок, стелька, коробка — каждый товар
          проверяется на оригинальность по 16 параметрам. Если всё хорошо, на
          обувь вешается ярлычок с пломбой, а в коробку кладется сертификат
          подлинности.
        </span>
      </div>
    </div>
  );
};

export default OriginalModal;
