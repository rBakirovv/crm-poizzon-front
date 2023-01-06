import { FC } from "react";
import { useRouter } from "next/router";
import styles from "./Header.module.css";
import Link from "next/link";

interface IHeaderProps {
  position?: string;
}

const Header: FC<IHeaderProps> = ({ position }) => {
  const router = useRouter();

  return (
    <header
      className={`${styles["header"]} ${
        router.pathname.includes("/order/") && styles["header_order"]
      }`}
    >
      {router.pathname.includes("/order/") && (
        <div className={styles["header__order-container"]}>
          <h2 className={styles["header__order-title"]}>Заказ №1450</h2>
          <button
            className={styles["header__order-pay"]}
            onClick={() =>
              window.scrollTo({
                left: 0,
                top: document.body.scrollHeight,
                behavior: "smooth",
              })
            }
          >
            Оплатить
          </button>
        </div>
      )}
      {!router.pathname.includes("/order/") && (
        <div className={styles["header__container"]}>
          <Link className={styles["header__container-title"]} href="/">
            POIZZONQQ CRM
          </Link>
          <div className={styles["header__buttons-container"]}>
            <button
              className={`${styles["header__button"]} ${styles["header__button_black"]}`}
            >
              Новый заказ
            </button>
            <button
              className={`${styles["header__button"]} ${styles["header__button_white"]}`}
            >
              Поиск
            </button>
            <p className={styles["header__position-name"]}>{position}</p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
