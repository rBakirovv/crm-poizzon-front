import styles from "./Client.module.css";
import OrderData from "../../store/order";
import { useState } from "react";
import Preloader from "../UI/Preloader/Preloader";
import {
  deliveryAuthorization,
  getDeliveryInfo,
  changeOrderDeliveryPhone,
  updateDeliveryPhone,
  changeOrderDeliveryName,
  updateDeliveryName,
  updateDeliveryTg,
} from "../../utils/Order";
import SubmitPopup from "../SubmitPopup/SubmitPopup";

const Client = () => {
  const [data, setData] = useState({
    delivery_phone: OrderData.order.deliveryPhone,
    delivery_name: OrderData.order.deliveryNameRecipient,
    delivery_tg: OrderData.order.deliveryName,
  });

  const [isPreloader, setIsPreloader] = useState(false);

  const [isChangePhone, setIsChangePhone] = useState(false);
  const [isChangeName, setIsChangeName] = useState(false);
  const [isChangeTg, setIsChangeTg] = useState(false);

  const [isSubmitChangePhonePopup, setIsSubmitChangePhonePopup] =
    useState(false);
  const [isSubmitChangeNamePopup, setIsSubmitChangeNamePopup] = useState(false);
  const [isSubmitChangeTgPopup, setIsSubmitChangeTgPopup] = useState(false);

  function handleChangePhone() {
    setIsChangePhone(true);
  }

  function handleChangeTg() {
    setIsChangeTg(true);
  }

  function handleChangeName() {
    setIsChangeName(true);
  }

  function openSubmitChangePhonePopup() {
    setIsSubmitChangePhonePopup(true);
  }

  function closeSubmitChangePhonePopup() {
    setIsSubmitChangePhonePopup(false);
  }

  function openSubmitChangeNamePopup() {
    setIsSubmitChangeNamePopup(true);
  }

  function closeSubmitChangeNamePopup() {
    setIsSubmitChangeNamePopup(false);
  }

  function openSubmitChangeTgPopup() {
    setIsSubmitChangeTgPopup(true);
  }

  function closeSubmitChangeTgPopup() {
    setIsSubmitChangeTgPopup(false);
  }

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: value,
    });
  }

  function copyTg() {
    if (OrderData.order.deliveryName![0] === "@") {
      navigator.clipboard.writeText(OrderData.order.deliveryName!.slice(1));
    } else {
      navigator.clipboard.writeText(OrderData.order.deliveryName!);
    }
  }

  function copyPhone() {
    navigator.clipboard.writeText(OrderData.order.deliveryPhone!);
  }

  function copyName() {
    navigator.clipboard.writeText(OrderData.order.deliveryNameRecipient!);
  }

  function handleUpdateDeliveryPhone() {
    setIsPreloader(true);
    if (OrderData.order.deliveryEntity !== "") {
      deliveryAuthorization()
        .then((authData) => {
          getDeliveryInfo(authData.token, OrderData.order.deliveryEntity)
            .then((orderInfo) => {
              changeOrderDeliveryPhone(
                authData.token,
                orderInfo.entity.uuid,
                data.delivery_phone
              )
                .then(() => {
                  updateDeliveryPhone(OrderData.order._id, data.delivery_phone!)
                    .then((order) => {
                      OrderData.setOrder(order);
                    })
                    .then(() => {
                      if (OrderData.order.combinedOrder.length > 0) {
                        OrderData.order.combinedOrder[0].combinedOrder.map(
                          (orderItem) => {
                            if (OrderData.order._id !== orderItem) {
                              updateDeliveryPhone(
                                orderItem,
                                data.delivery_phone!
                              );
                            }
                          }
                        );
                      }
                    })
                    .then(() => {
                      setIsPreloader(false);
                      setIsChangePhone(false);
                    })
                    .catch((err) => {
                      console.log(err);
                      setIsPreloader(false);
                      alert("Произошла ошибка!");
                    });
                })
                .catch((err) => {
                  console.log(err);
                  setIsPreloader(false);
                  alert("Произошла ошибка!");
                });
            })
            .catch((err) => {
              console.log(err);
              setIsPreloader(false);
              alert("Произошла ошибка!");
            });
        })
        .catch((err) => {
          console.log(err);
          setIsPreloader(false);
          alert("Произошла ошибка!");
        });
    } else {
      setIsPreloader(true);
      updateDeliveryPhone(OrderData.order._id, data.delivery_phone!)
        .then((order) => {
          OrderData.setOrder(order);
        })
        .then(() => {
          if (OrderData.order.combinedOrder.length > 0) {
            OrderData.order.combinedOrder[0].combinedOrder.map((orderItem) => {
              if (OrderData.order._id !== orderItem) {
                updateDeliveryPhone(orderItem, data.delivery_phone!);
              }
            });
          }
        })
        .then(() => {
          setIsPreloader(false);
          setIsChangePhone(false);
        })
        .catch((err) => {
          console.log(err);
          setIsPreloader(false);
          alert("Произошла ошибка!");
        });
    }
  }

  function handleUpdateDeliveryName() {
    setIsPreloader(true);
    deliveryAuthorization()
      .then((authData) => {
        getDeliveryInfo(authData.token, OrderData.order.deliveryEntity)
          .then((orderInfo) => {
            changeOrderDeliveryName(
              authData.token,
              orderInfo.entity.uuid,
              data.delivery_name
            )
              .then(() => {
                updateDeliveryName(OrderData.order._id, data.delivery_name!)
                  .then((order) => {
                    OrderData.setOrder(order);
                  })
                  .then(() => {
                    if (OrderData.order.combinedOrder.length > 0) {
                      OrderData.order.combinedOrder[0].combinedOrder.map(
                        (orderItem) => {
                          if (OrderData.order._id !== orderItem) {
                            updateDeliveryName(orderItem, data.delivery_name!);
                          }
                        }
                      );
                    }
                  })
                  .then(() => {
                    setIsPreloader(false);
                    setIsChangeName(false);
                  })
                  .catch((err) => {
                    console.log(err);
                    setIsPreloader(false);
                    alert("Произошла ошибка!");
                  });
              })
              .catch((err) => {
                console.log(err);
                setIsPreloader(false);
                alert("Произошла ошибка!");
              });
          })
          .catch((err) => {
            console.log(err);
            setIsPreloader(false);
            alert("Произошла ошибка!");
          });
      })
      .catch((err) => {
        console.log(err);
        setIsPreloader(false);
        alert("Произошла ошибка!");
      });
  }

  function handleUpdateTg() {
    setIsPreloader(true);
    updateDeliveryTg(OrderData.order._id, data.delivery_tg!)
      .then((order) => {
        OrderData.setOrder(order);
      })
      .then(() => {
        if (OrderData.order.combinedOrder.length > 0) {
          OrderData.order.combinedOrder[0].combinedOrder.map((orderItem) => {
            if (OrderData.order._id !== orderItem) {
              updateDeliveryTg(orderItem, data.delivery_tg!);
            }
          });
        }
      })
      .then(() => {
        setIsPreloader(false);
        setIsChangeTg(false);
      })
      .catch((err) => {
        console.log(err);
        setIsPreloader(false);
        alert("Произошла ошибка!");
      });
  }

  return (
    <div className={styles["client"]}>
      {isPreloader && <Preloader />}
      {OrderData.order.deliveryName !== "" && (
        <>
          <h4>Telegram</h4>
          <div className={styles["delivery__input-container"]}>
            {!isChangeTg && (
              <p className={styles["delivery-copy"]} onClick={copyTg}>
                {OrderData.order.deliveryName}{" "}
                <svg
                  x="0px"
                  y="0px"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  focusable="false"
                  fill="currentColor"
                >
                  <path d="M3.9,12c0-1.7,1.4-3.1,3.1-3.1h4V7H7c-2.8,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.3,15.1,3.9,13.7,3.9,12z M8,13h8v-2H8V13zM17,7h-4v1.9h4c1.7,0,3.1,1.4,3.1,3.1s-1.4,3.1-3.1,3.1h-4V17h4c2.8,0,5-2.2,5-5S19.8,7,17,7z"></path>
                </svg>
              </p>
            )}
            {isChangeTg && (
              <input
                className={styles["delivery__input"]}
                type="text"
                name="delivery_tg"
                value={data.delivery_tg}
                onChange={handleChange}
                readOnly={!isChangeTg}
              />
            )}
            {!isChangeTg && (
                <button
                  className={styles["delivery__change"]}
                  onClick={handleChangeTg}
                >
                  {"Изм."}
                </button>
              )}
            {isChangeTg && (
              <button
                className={styles["delivery__change"]}
                onClick={openSubmitChangeTgPopup}
              >
                {"Сохр."}
              </button>
            )}
          </div>
        </>
      )}
      {OrderData.order.deliveryNameRecipient !== "" && (
        <>
          <h4>ФИО получателя</h4>
          <div className={styles["delivery__input-container"]}>
            {!isChangeName && (
              <p className={styles["delivery-copy"]} onClick={copyName}>
                {OrderData.order.deliveryNameRecipient}
                <svg
                  x="0px"
                  y="0px"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  focusable="false"
                  fill="currentColor"
                >
                  <path d="M3.9,12c0-1.7,1.4-3.1,3.1-3.1h4V7H7c-2.8,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.3,15.1,3.9,13.7,3.9,12z M8,13h8v-2H8V13zM17,7h-4v1.9h4c1.7,0,3.1,1.4,3.1,3.1s-1.4,3.1-3.1,3.1h-4V17h4c2.8,0,5-2.2,5-5S19.8,7,17,7z"></path>
                </svg>
              </p>
            )}
            {isChangeName && (
              <input
                className={styles["delivery__input"]}
                type="text"
                name="delivery_name"
                value={data.delivery_name}
                onChange={handleChange}
                readOnly={!isChangeName}
              />
            )}
            {!isChangeName &&
              OrderData.order.deliveryEntity !== "" &&
              OrderData.order.deliveryAddress !== "" && (
                <button
                  className={styles["delivery__change"]}
                  onClick={handleChangeName}
                >
                  {"Изм."}
                </button>
              )}
            {isChangeName && (
              <button
                className={styles["delivery__change"]}
                onClick={openSubmitChangeNamePopup}
              >
                {"Сохр."}
              </button>
            )}
          </div>
        </>
      )}
      {OrderData.order.deliveryPhone !== "" && (
        <>
          <h4>Номер телефона получателя</h4>
          <div className={styles["delivery__input-container"]}>
            {!isChangePhone && (
              <p className={styles["delivery-copy"]} onClick={copyPhone}>
                {OrderData.order.deliveryPhone}
                <svg
                  x="0px"
                  y="0px"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  focusable="false"
                  fill="currentColor"
                >
                  <path d="M3.9,12c0-1.7,1.4-3.1,3.1-3.1h4V7H7c-2.8,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.3,15.1,3.9,13.7,3.9,12z M8,13h8v-2H8V13zM17,7h-4v1.9h4c1.7,0,3.1,1.4,3.1,3.1s-1.4,3.1-3.1,3.1h-4V17h4c2.8,0,5-2.2,5-5S19.8,7,17,7z"></path>
                </svg>
              </p>
            )}
            {isChangePhone && (
              <input
                className={styles["delivery__input"]}
                type="text"
                name="delivery_phone"
                value={data.delivery_phone}
                onChange={handleChange}
                readOnly={!isChangePhone}
              />
            )}
            {!isChangePhone && (
                <button
                  className={styles["delivery__change"]}
                  onClick={handleChangePhone}
                >
                  {"Изм."}
                </button>
              )}
            {isChangePhone && (
              <button
                className={styles["delivery__change"]}
                onClick={openSubmitChangePhonePopup}
              >
                {"Сохр."}
              </button>
            )}
          </div>
        </>
      )}
      <SubmitPopup
        isSubmitPopup={isSubmitChangePhonePopup}
        submitText="Изменить номер телефона получателя"
        onSubmit={handleUpdateDeliveryPhone}
        closeSubmitPopup={closeSubmitChangePhonePopup}
      />
      <SubmitPopup
        isSubmitPopup={isSubmitChangeNamePopup}
        submitText="Изменить ФИО получателя"
        onSubmit={handleUpdateDeliveryName}
        closeSubmitPopup={closeSubmitChangeNamePopup}
      />
      <SubmitPopup
        isSubmitPopup={isSubmitChangeTgPopup}
        submitText={`Изменить Телеграм на ${data.delivery_tg}`}
        onSubmit={handleUpdateTg}
        closeSubmitPopup={closeSubmitChangeTgPopup}
      />
    </div>
  );
};

export default Client;
