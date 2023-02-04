import { FC, useState } from "react";
import { useRouter } from "next/router";
import styles from "./Header.module.css";
import Link from "next/link";
import Burger from "../Burger/Burger";

interface IHeaderProps {
  userPosition?: string;
  userName?: string;
  currentRate?: string;
  orderId?: number;
  orderStatus?: string;
}

const Header: FC<IHeaderProps> = ({ userPosition, orderId, orderStatus }) => {
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
        router.pathname.includes("/order/") &&
        !router.pathname.includes("/order/change/") &&
        styles["header_order"]
      }`}
    >
      {router.pathname.includes("/order/") &&
        !router.pathname.includes("/order/change/") && (
          <div className={styles["header__order-container"]}>
            <h2 className={styles["header__order-title"]}>Заказ №{orderId}</h2>
            {!router.pathname.includes("/pay/") &&
              orderStatus === "Черновик" && (
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
              )}
          </div>
        )}
      {(!router.pathname.includes("/order/") ||
        router.pathname.includes("/order/change/")) && (
        <div className={styles["header__container"]}>
          <Link className={styles["header__container-title"]} href="/">
            POIZON
            <span className={styles["header__container-title-span"]}>
              QQ
            </span>{" "}
            CRM
          </Link>
          <div className={styles["header__buttons-container"]}>
            {userPosition !== "Байер" && (
              <Link
                className={`${styles["header__button"]} ${styles["header__button_black"]}`}
                href="/create-order"
              >
                Новый заказ
              </Link>
            )}
            <Link
              className={`${styles["header__button"]} ${styles["header__button_white"]}`}
              href="/search-order"
            >
              Поиск
            </Link>
          </div>
          <Link className={styles["header__position-name"]} href="/account">
            {userPosition}
            <div className={styles["header__position-icon"]}></div>
          </Link>
          <button
            className={`${styles["header__burger-button"]} ${
              isBurgerOpen && styles["header__burger-button_active"]
            }`}
            onClick={handleBurgerClick}
          ></button>
          <Burger isBurgerOpen={isBurgerOpen} closeBurger={closeBurger} />
        </div>
      )}
    </header>
  );
};

export default Header;
