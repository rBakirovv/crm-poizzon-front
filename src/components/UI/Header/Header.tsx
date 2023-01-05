import { useRouter } from 'next/router';
import styles from "./Header.module.css";

export default function Header() {

  const router = useRouter();

  return (
    <header className={`${styles["header"]} ${router.pathname.includes("/order/") && styles["header_order"]}`}>
      <div className={styles["header__order-container"]}>
        <h2 className={styles["header__order-title"]}>Заказ №1450</h2>
        <button className={styles["header__order-pay"]} onClick={() => window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" })}>Оплатить</button>
      </div>
    </header>
  );
}
