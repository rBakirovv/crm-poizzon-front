import { FC } from "react";
import styles from "./Main.module.css";

interface IMainProps {
  children: React.ReactNode;
}

const Main: FC<IMainProps> = ({ children }) => {
  return (
    <main className={styles["main"]}>
      <div className={styles["main__container"]}>{children}</div>
    </main>
  );
};

export default Main;
