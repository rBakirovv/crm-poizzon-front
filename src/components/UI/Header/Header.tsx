import { FC, useState } from "react";
import { useRouter } from "next/router";
import styles from "./Header.module.css";
import Link from "next/link";
import Burger from "../Burger/Burger";

interface IHeaderProps {
  userPosition?: string;
}

const Header: FC<IHeaderProps> = ({ userPosition }) => {
  const router = useRouter();

  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  function handleBurgerClick() {
    setIsBurgerOpen(!isBurgerOpen);
  }

  function closeBurger() {
    setIsBurgerOpen(false);
  }

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
            <Link
              className={`${styles["header__button"]} ${styles["header__button_black"]}`}
              href="/"
            >
              Новый заказ
            </Link>
            <Link
              className={`${styles["header__button"]} ${styles["header__button_white"]}`}
              href="/"
            >
              Поиск
            </Link>
          </div>
          <p className={styles["header__position-name"]}>{userPosition}</p>
          <button
            className={`${styles["header__burger-button"]} ${isBurgerOpen && styles["header__burger-button_active"]}`}
            onClick={handleBurgerClick}
          ></button>
          <Burger isBurgerOpen={isBurgerOpen} closeBurger={closeBurger} />
        </div>
      )}
    </header>
  );
};

export default Header;
