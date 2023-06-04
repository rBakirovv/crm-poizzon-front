import { useMemo, useState } from "react";
import styles from "../OrderPay/OrderPay.module.css";
import TextInput from "../UI/TextInput/TextInput";
import OrderData from "../../store/order";
import {
  deliveryAuthorization,
  deliveryCreate,
  getDeliveryInfo,
  updateClientDeliveryAddress,
} from "../../utils/Order";
import { useRouter } from "next/router";

declare var ISDEKWidjet: any; // Костыль всех костылей!

const OrderDeliveryClient = () => {
  const router = useRouter();

  const [data, setData] = useState({
    name: "",
    phone: "",
    name_recipient: "",
    phone_recipient: "",
    delivery_method: "",
    delivery_address: "",
  });

  const [currentPVZId, setCurrentPVZId] = useState("");
  const [currentPVZ, setCurrentPVZ] = useState("");
  const [amount, setAmount] = useState(0);
  const [tarif, setTarif] = useState(0);
  const [isPostamat, setIsPostamat] = useState(false);

  // фун-я с костылём!
  function choosePVZ(wat: any) {
    setTarif(wat.tarif);
    setCurrentPVZId(wat.id);
    setCurrentPVZ(`г. ${wat.cityName}, ${wat.PVZ.Address}`);
    setAmount(parseInt(wat.price) + 100);
    setIsPostamat(wat.PVZ.Postamat);

    data.name_recipient !== "" &&
      window.scrollTo({
        left: 0,
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
  }

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: value,
    });
  }

  useMemo(() => {
    return (
      typeof window !== "undefined" &&
      data.delivery_method === "Самовывоз из пункта выдачи CDEK" &&
      new ISDEKWidjet({
        country: "Россия",
        defaultCity: "Москва",
        cityFrom: "Москва",
        link: "forpvz",
        apikey: "c5b15538-f5b4-4065-8803-d2f4e3b1746f",
        goods: [
          {
            length: 37,
            width: 27,
            height: 17,
            weight: 1 / 10,
          },
        ],
        onChoose: choosePVZ,
      })
    );
  }, [data.delivery_method === "Самовывоз из пункта выдачи CDEK"]);

  function handleCreateOrderRequest(e: React.SyntheticEvent) {
    e.preventDefault();

    deliveryAuthorization()
      .then((authData) => {
        deliveryCreate(
          authData.token,
          OrderData.order._id,
          OrderData.order.model,
          currentPVZId,
          OrderData.order.model,
          amount,
          OrderData.order.deliveryPhone,
          data.name_recipient,
          tarif
        )
          .then((orderInfo) => {
            getDeliveryInfo(authData.token, orderInfo.entity.uuid)
              .then((orderCheckInfo) => {
                if (orderCheckInfo.requests[0].state !== "INVALID") {
                  updateClientDeliveryAddress(
                    OrderData.order._id,
                    currentPVZ,
                    data.name_recipient,
                    data.delivery_method,
                    orderInfo.entity.uuid
                  )
                    .then(() => {
                      if (OrderData.order.combinedOrder.length > 0) {
                        OrderData.order.combinedOrder[0].combinedOrder.map(
                          (orderItem) => {
                            if (OrderData.order._id !== orderItem) {
                              updateClientDeliveryAddress(
                                orderItem,
                                currentPVZ,
                                data.name_recipient,
                                data.delivery_method,
                                orderInfo.entity.uuid
                              );
                            }
                          }
                        );
                      }
                    })
                    .then(() => {
                      router.replace(`/order/${router.query.deliveryId}`);
                    })
                    .catch((err) => console.log(err));
                } else {
                  alert("Ошибка! Проверьте корректность введённых данных.");
                }
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <section className={styles["order-pay"]}>
        <div className={styles["order-pay__container"]}>
          <form
            className={styles["order-pay__form"]}
            onSubmit={handleCreateOrderRequest}
          >
            <h4 className={styles["order-pay__title"]}>
              {OrderData.order.brand} {OrderData.order.model}
            </h4>
            <div className={styles["order-pay__data-inputs"]}>
              <TextInput
                name="name_recipient"
                label="ФИО получателя"
                value={data.name_recipient}
                handleChange={handleChange}
                readonly={OrderData.order.deliveryMethod !== ""}
                required={true}
              />
              <div className={styles["order-pay__select-container"]}>
                <label>
                  Тип доставки<span className={styles["red-star"]}>*</span>
                </label>
                <select
                  className={styles["order-pay__select"]}
                  name="delivery_method"
                  onChange={handleChange}
                  required
                >
                  <option value="" selected disabled>
                    -- Выберите --
                  </option>
                  <option value="Самовывоз из пункта выдачи CDEK">
                    Самовывоз из пункта выдачи CDEK
                  </option>
                </select>
              </div>
              {data.delivery_method === "Курьером CDEK" && (
                <TextInput
                  name="delivery_address"
                  label="Адрес доставки"
                  value={data.delivery_address}
                  handleChange={handleChange}
                  readonly={OrderData.order.deliveryMethod !== ""}
                  required={true}
                />
              )}
              {data.delivery_method === "Самовывоз из пункта выдачи CDEK" &&
                currentPVZId === "" && (
                  <div>
                    <span>
                      Пожалуйста, выберите{" "}
                      <span className={styles["delivery-map-pvz-span"]}>
                        {" "}
                        пункт выдачи
                      </span>{" "}
                      на карте
                    </span>
                  </div>
                )}
              {data.delivery_method === "Самовывоз из пункта выдачи CDEK" &&
                currentPVZId !== "" && (
                  <div>
                    <span>
                      Адрес выбранного{" "}
                      <span className={styles["delivery-map-pvz-span"]}>
                        Вами
                      </span>{" "}
                      пункта выдачи
                    </span>
                    <p className={styles["delivery-map-pvz"]}>{currentPVZ}</p>
                  </div>
                )}
            </div>
            <div
              className={`${styles["delivery-map"]} ${
                data.delivery_method === "Самовывоз из пункта выдачи CDEK" &&
                styles["delivery-map_active"]
              }`}
              id="forpvz"
            ></div>
            {isPostamat && (
              <span className={styles["delivery-error"]}>
                Пункт выдачи не может быть постоматом
              </span>
            )}
            <button
              className={styles["order-pay__pay-submit"]}
              type="submit"
              disabled={
                currentPVZ === "" ||
                data.delivery_method === "" ||
                OrderData.order.deliveryMethod !== "" ||
                isPostamat
              }
            >
              Отправить
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default OrderDeliveryClient;
