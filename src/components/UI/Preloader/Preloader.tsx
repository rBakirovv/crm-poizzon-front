import styles from "./Preloader.module.css";

const Preloader = () => {
  return (
    <>
      <div className={styles["preloader"]}>
        <div className={styles["preloader__container"]}>
          <span className={styles["preloader__round"]}></span>
        </div>
      </div>
      <style>
        {
            `
                html {
                    overflow: hidden;
                }
            `
        }
        </style>
    </>
  );
};

export default Preloader;
