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
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32 28.8L19.2 16L32 3.2L28.8 0L16 12.8L3.2 0L0 3.2L12.8 16L0 28.8L3.2 32L16 19.2L28.8 32L32 28.8Z"
              fill="white"
            />
          </svg>
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
