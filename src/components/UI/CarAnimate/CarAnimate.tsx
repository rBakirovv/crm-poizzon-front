import styles from "./CarAnimate.module.scss";

const CarAnimate = () => {
  return (
    <button className={`${styles["order"]} ${styles["animate"]}`}>
      <div className={styles["box"]}></div>
      <div className={styles["truck"]}>
        <div className={styles["back"]}></div>
        <div className={styles["front"]}>
          <div className={styles["window"]}></div>
        </div>
        <div className={`${styles["light"]} ${styles["top"]}`}></div>
        <div className={`${styles["light"]} ${styles["bottom"]}`}></div>
      </div>
      <div className={styles["lines"]}></div>
    </button>
  );
};

export default CarAnimate;
