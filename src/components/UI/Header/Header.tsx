import { FC, useState } from "react";
import { useRouter } from "next/router";
import styles from "./Header.module.css";
import Link from "next/link";
import Burger from "../Burger/Burger";
import { createOrder } from "../../../utils/Order";
import OrderData from "../../../store/order";

interface IHeaderProps {
  userPosition?: string;
  userName?: string;
  currentRate?: string;
  orderId?: number;
  orderStatus?: string;
}

const Header: FC<IHeaderProps> = ({
  userPosition,
  userName,
  currentRate,
  orderId,
  orderStatus,
}) => {
  const router = useRouter();

  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  function handleBurgerClick() {
    setIsBurgerOpen(!isBurgerOpen);
  }

  function closeBurger() {
    setIsBurgerOpen(false);
  }

  function createNewOrder() {
    createOrder(userName!, currentRate!).then((order) => {
      OrderData.pushOrder(order);
      router.push(`/order/change/${order._id}`);
    });
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
            {!router.pathname.includes("/pay/") && (
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
                {orderStatus === "Черновик" ? "Оплатить" : "История заказа"}
              </button>
            )}
          </div>
        )}
      {(!router.pathname.includes("/order/") ||
        router.pathname.includes("/order/change/")) && (
        <div className={styles["header__container"]}>
          <Link className={styles["header__container-title"]} href="/">
            POIZZON
            <span className={styles["header__container-title-span"]}>
              QQ
            </span>{" "}
            CRM
          </Link>
          <div className={styles["header__buttons-container"]}>
            <button
              className={`${styles["header__button"]} ${styles["header__button_black"]}`}
              onClick={createNewOrder}
            >
              Новый заказ
            </button>
            <Link
              className={`${styles["header__button"]} ${styles["header__button_white"]}`}
              href="/"
            >
              Поиск
            </Link>
          </div>
          <p className={styles["header__position-name"]}>{userPosition}</p>
          <button
            className={`${styles["header__burger-button"]} ${
              isBurgerOpen && styles["header__burger-button_active"]
            }`}
            onClick={handleBurgerClick}
          ></button>
          <Burger
            isBurgerOpen={isBurgerOpen}
            closeBurger={closeBurger}
            createNewOrder={createNewOrder}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
