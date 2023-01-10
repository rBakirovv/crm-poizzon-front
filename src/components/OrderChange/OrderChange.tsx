import { BASE_URL, BASE_URL_FRONT } from "../../utils/constants";
import styles from "./OrderChange.styles.module.css";

const OrderChange = ({ order }) => {
  return (
    <section className={styles["order-change"]}>
      <h2 className={styles["order-change__title"]}>Заказ #{order.orderId}</h2>
      <p className={styles["order-change__status"]}>Статус: {order.status}</p>
      <div className={styles["order-change__public-link-container"]}>
        <p className={styles["order-change__public-link-text"]}>
          Публичная ссылка
        </p>
        <a
          className={styles["order-change__public-link"]}
          href={`${BASE_URL_FRONT}/order/${order._id}`}
          target="_blank"
          rel="noreferrer"
        >
          {BASE_URL_FRONT}/order/{order._id}
        </a>
      </div>
    </section>
  );
};

export default OrderChange;
