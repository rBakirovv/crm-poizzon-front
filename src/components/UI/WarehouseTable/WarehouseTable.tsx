import styles from "./WarehouseTable.module.css";
import { observer } from "mobx-react-lite";
import UserData from "../../../store/user";
import WarehouseData from "../../../store/warehouse";
import { useEffect, useState } from "react";
import { getRecentlyArrived } from "../../../utils/Order";
import UsersDataList from "../../../store/usersList";
import { getUsers } from "../../../utils/User";
import { IUserData } from "../../../types/interfaces";

const dayjs = require("dayjs");

var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Europe/Moscow");

const WarehouseTable = observer(() => {
  const [isDropdownActive, setIsDropdownActive] = useState(
    typeof window !== "undefined" && sessionStorage.getItem("warehouseDropdown")
      ? sessionStorage.getItem("warehouseDropdown") === "true"
        ? true
        : false
      : true
  );

  function handleDropdownClick() {
    sessionStorage.setItem("warehouseDropdown", (!isDropdownActive).toString());
    setIsDropdownActive(!isDropdownActive);
  }

  const filteredRecentlyArrived =
    WarehouseData.ordersRecentlyArrived &&
    WarehouseData.ordersRecentlyArrived.filter((item) => {
      if (
        dayjs.tz(new Date(item.inRussiaStockAt)).format("DD-MM-YY") ===
        dayjs.tz(new Date(Date.now())).format("DD-MM-YY")
      ) {
        return true;
      }
    });

  useEffect(() => {
    getRecentlyArrived().then((orders) => {
      WarehouseData.setordersRecentlyArrived(orders);
    });
  }, []);

  useEffect(() => {
    getUsers().then((users) => UsersDataList.setUsersList(users));
  }, []);

  return (
    <>
      {UserData.userData.position === "Работник склада" && (
        <div className={styles["warehouse-table"]}>
          <div className={styles["warehouse-table__container"]}>
            <svg
              width="18px"
              height="18px"
              viewBox="0 0 48 48"
              focusable="false"
              fill="black"
              className={`${styles["warehouse-table__arrow"]} ${
                !isDropdownActive && styles["warehouse-table__arrow_disabled"]
              }`}
              onClick={handleDropdownClick}
            >
              <path fill="none" d="M0 0h48v48H0V0z"></path>
              <path d="M40 24l-2.82-2.82L26 32.34V8h-4v24.34L10.84 21.16 8 24l16 16 16-16z"></path>
            </svg>
            <h4 className={styles["warehouse-table__title"]}>
              Статистика склада:
            </h4>
            <ul
              className={`${styles["warehouse-table__list"]} ${
                !isDropdownActive && styles["warehouse-table__list_disabled"]
              }`}
            >
              {UsersDataList.usersList.map((user: IUserData) => {
                const filterItems = filteredRecentlyArrived.filter(
                  (filterItem) => {
                    if (filterItem.stockman === user.name) {
                      return filterItem;
                    }
                  }
                );

                const total =
                  filterItems &&
                  filterItems.reduce(function (sum, current) {
                    return sum + 1;
                  }, 0);
                return (
                  <li
                    className={`${styles["warehouse-table__list-item"]} ${
                      user.position !== "Работник склада" &&
                      styles["warehouse-table__list-item_disable"]
                    }`}
                  >
                    <>
                      <p className={styles["warehouse-table__list-text"]}>
                        {UserData.userData.name === user.name ? (
                          <strong>{user.name}</strong>
                        ) : (
                          user.name
                        )}
                      </p>
                      <p className={styles["warehouse-table__list-text"]}>
                        {UserData.userData.name === user.name ? (
                          <strong>{total > 0 ? total : 0}</strong>
                        ) : total > 0 ? (
                          total
                        ) : (
                          0
                        )}
                      </p>
                    </>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
});

export default WarehouseTable;
