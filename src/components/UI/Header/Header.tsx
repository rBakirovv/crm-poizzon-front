import { FC, useEffect, useState } from "react";
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
  inChinaStockAt?: any; // Костыль!
  deliveryMethod?: string;
  poizonCode?: string;
  overudeAfter?: Date;
  payLink?: string;
  payment?: string;
}

const Header: FC<IHeaderProps> = ({
  userPosition,
  orderId,
  orderStatus,
  inChinaStockAt,
  deliveryMethod,
  poizonCode,
  overudeAfter,
  payLink,
  payment,
}) => {
  const router = useRouter();

  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  const [timeLeft, setTimeLeft] = useState<number>(
    Math.ceil(
      Math.round(
        new Date(overudeAfter!).getTime() - new Date(Date.now()).getTime()
      ) / 1000
    )
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((timeLeft: number) => (timeLeft >= 1 ? timeLeft - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timeLeft]);

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
              orderStatus === "Черновик" &&
              payment !== "Перейти по ссылке -" &&
              timeLeft > 0 && (
                <button
                  className={styles["header__order-pay"]}
                  onClick={() => router.push(`pay/${router.query.orderId}`)}
                >
                  Оплатить
                </button>
              )}
            {!router.pathname.includes("/pay/") &&
              orderStatus === "Черновик" &&
              payment === "Перейти по ссылке -" &&
              timeLeft > 0 && (
                <a className={styles["header__order-pay"]} href={`${payLink}`}>
                  Оплатить
                </a>
              )}
            {(!router.pathname.includes("/pay/") ||
              !router.pathname.includes("/delivery/")) &&
              poizonCode !== "" &&
              inChinaStockAt !== null &&
              deliveryMethod === "" &&
              orderStatus !== "Завершён" && (
                <button
                  className={`${styles["header__order-pay"]} ${styles["header__order-delivery"]}`}
                  onClick={() =>
                    router.push(`delivery/${router.query.orderId}`)
                  }
                >
                  Заполните данные для доставки
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
            {userPosition !== "Байер" && userPosition !== "Работник склада" && (
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
