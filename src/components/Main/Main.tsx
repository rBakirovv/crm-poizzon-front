import { FC } from "react";
import styles from "./Main.module.css";
import WarehouseTable from "../UI/WarehouseTable/WarehouseTable";
import { useRouter } from "next/router";

interface IMainProps {
  children: React.ReactNode;
}

const Main: FC<IMainProps> = ({ children }) => {
  const router = useRouter();

  return (
    <main className={styles["main"]}>
      {!router.pathname.includes("cards") && <WarehouseTable />}
      <div className={styles["main__container"]}>{children}</div>
    </main>
  );
};

export default Main;
