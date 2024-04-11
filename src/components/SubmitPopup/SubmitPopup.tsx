import { FC, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./SubmitPopup.module.css";

interface ISubmitPopupProps {
  submitText: string;
  onSubmit: () => void;
  isSubmitPopup: boolean;
  closeSubmitPopup: () => void;
}

const SubmitPopup: FC<ISubmitPopupProps> = ({
  submitText,
  onSubmit,
  isSubmitPopup,
  closeSubmitPopup,
}) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  });

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    onSubmit();
    closeSubmitPopup();
  }

  const submitPopupElement = (
    <div
      className={`${styles["submit-popup"]} ${
        isSubmitPopup && styles["submit-popup_visible"]
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={styles["submit-popup__container"]}
      >
        <button
          className={styles["submit-popup__close"]}
          type="button"
          onClick={closeSubmitPopup}
        >
        </button>
        <h2 className={styles["submit-popup__text"]}>
          Вы действительно хотите? <br />{" "}
          <span className={styles["submit-popup__span"]}>{submitText}</span>
        </h2>
        <button className={styles["submit-popup__button"]} type="submit">
          Подтверждаю
        </button>
      </form>
    </div>
  );

  if (isBrowser && document.getElementById("submit-popup")) {
    return ReactDOM.createPortal(
      submitPopupElement,
      document.getElementById("burger")!
    );
  } else {
    return null;
  }
};

export default SubmitPopup;
