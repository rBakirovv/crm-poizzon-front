import { FC, useEffect, useState } from "react";
import styles from "./LoginPopup.module.css";
import ReactDOM from "react-dom";

interface ILoginPopupProps {
  loginPopup: boolean;
  closeLoginPopup: () => void;
  email: string;
  password: string;
  handleAuthorization: (email: string, password: string, code: string) => void;
  loginPopupError: boolean;
  setLoginPopupError: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPopup: FC<ILoginPopupProps> = ({
  loginPopup,
  closeLoginPopup,
  email,
  password,
  handleAuthorization,
  loginPopupError,
  setLoginPopupError,
}) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [data, setData] = useState({
    code: "",
  });

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setLoginPopupError(false);

    setData({
      ...data,
      [name]: value,
    });
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    handleAuthorization(email, password, data.code);
  }

  useEffect(() => {
    setIsBrowser(true);
  });

  const LoginPopupElement = (
    <div
      className={`${styles["login-popup"]} ${
        loginPopup && styles["login-popup_visible"]
      }`}
    >
      <form className={styles["login-popup__form"]} onSubmit={handleSubmit}>
        <button
          className={styles["login-popup__close"]}
          type="button"
          onClick={closeLoginPopup}
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
        <p className={styles["login-popup__text"]}>
          Код доступа к аккаунту отправлен на
          <span className={styles["login-popup__text-span"]}> {email}</span>
        </p>
        <input
          className={styles["login-popup__input"]}
          name="code"
          type="text"
          placeholder="Код"
          value={data.code}
          onChange={handleChange}
        />
        {loginPopupError && (
          <span className={styles["login-popup__input-err"]}>
            Неверный код, попробуйте ещё раз
          </span>
        )}
        <button className={styles["login-popup__submit"]} type="submit">
          Войти
        </button>
      </form>
    </div>
  );

  if (isBrowser && document.getElementById("login-popup")) {
    return ReactDOM.createPortal(
      LoginPopupElement,
      document.getElementById("burger")!
    );
  } else {
    return null;
  }
};

export default LoginPopup;
