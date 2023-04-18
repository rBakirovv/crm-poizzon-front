import { FC, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./ChangeAddress.module.css";
import OrderData from "../../../store/order";
import { observer } from "mobx-react-lite";
import {
  changeOrderDeliveryAddress,
  deliveryAuthorization,
  getDeliveryInfo,
  updateDeliveryAddress,
} from "../../../utils/Order";

interface IChangeAddressProps {
  isWidjet: boolean;
  closeWidjet: () => void;
}

declare var ISDEKWidjet: any; // Костыль всех костылей!

const ChangeAddress: FC<IChangeAddressProps> = observer(
  ({ isWidjet, closeWidjet }) => {
    const [isBrowser, setIsBrowser] = useState(false);

    const [currentPVZId, setCurrentPVZId] = useState("");
    const [currentPVZ, setCurrentPVZ] = useState("");
    const [amount, setAmount] = useState(0);
    const [tarif, setTarif] = useState(0);
    const [isPostamat, setIsPostamat] = useState(false);

    useEffect(() => {
      setIsBrowser(true);
    });

    useMemo(() => {
      return (
        isWidjet &&
        new ISDEKWidjet({
          country: "Россия",
          defaultCity: "Москва",
          cityFrom: "Москва",
          link: "forpvz-modal",
          apikey: "c5b15538-f5b4-4065-8803-d2f4e3b1746f",
          goods: [
            {
              length: 30,
              width: 20,
              height: 20,
              weight: 1 / 10,
            },
          ],
          onChoose: choosePVZ,
        })
      );
    }, [isWidjet]);

    function choosePVZ(wat: any) {
      setTarif(wat.tarif);
      setCurrentPVZId(wat.id);
      setCurrentPVZ(`г. ${wat.cityName}, ${wat.PVZ.Address}`);
      setAmount(parseInt(wat.price) + 100);
      setIsPostamat(wat.PVZ.Postamat);
    }

    function changeAddress() {
      if (currentPVZ !== "" && currentPVZId !== "") {
        deliveryAuthorization()
          .then((authData) => {
            getDeliveryInfo(authData.token, OrderData.order.deliveryEntity)
              .then((orderInfo) => {
                changeOrderDeliveryAddress(
                  authData.token,
                  orderInfo.entity.uuid,
                  amount,
                  currentPVZId,
                  tarif
                )
                  .then(() => {
                    updateDeliveryAddress(OrderData.order._id, currentPVZ)
                      .then((order) => {
                        OrderData.setOrder(order);
                      })
                      .then(() => {
                        if (OrderData.order.combinedOrder.length > 0) {
                          OrderData.order.combinedOrder[0].combinedOrder.map(
                            (orderItem) => {
                              if (OrderData.order._id !== orderItem) {
                                updateDeliveryAddress(orderItem, currentPVZ);
                              }
                            }
                          );
                        }
                      })
                      .then(() => {
                        closeWidjet();
                      })
                      .catch((err) => {
                        console.log(err);
                        alert("Произошла ошибка!");
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                    alert("Произошла ошибка!");
                  });
              })
              .catch((err) => {
                console.log(err);
                alert("Произошла ошибка!");
              });
          })
          .catch((err) => {
            console.log(err);
            alert("Произошла ошибка!");
          });
      }
    }

    const changeAddressElement = (
      <div
        className={`${styles["change-address"]} ${
          isWidjet && styles["change-address_active"]
        }`}
      >
        <div className={styles["change-address__container"]}>
          <button
            className={styles["change-address__close"]}
            onClick={closeWidjet}
          ></button>
          <div
            id="forpvz-modal"
            className={styles["change-address__widjet"]}
          ></div>
          {isPostamat && (
            <span className={styles["delivery-error"]}>
              Пункт выдачи не может быть постоматом
            </span>
          )}
          <button
            onClick={changeAddress}
            className={styles["change-address__submit"]}
            disabled={currentPVZ === "" || isPostamat}
          >
            Cохранить
          </button>
        </div>
      </div>
    );

    if (isBrowser && document.getElementById("widjet-popup")) {
      return ReactDOM.createPortal(
        changeAddressElement,
        document.getElementById("widjet-popup")!
      );
    } else {
      return null;
    }
  }
);

export default ChangeAddress;
