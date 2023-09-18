import { FC, useEffect, useRef, useState, useTransition } from "react";
import styles from "./UserDataModal.module.css";
import {
  calculateTariff,
  deliveryAuthorization,
  deliveryCreate,
  getCities,
  getDeliveryInfo,
  getDeliverypoints,
  updateClientDeliveryAddress,
} from "../../../utils/Order";
import { BASE_URL_FRONT } from "../../../utils/constants";
import PreloaderClient from "../PreloaderClient/PreloaderClient";

interface IUserDataModalProps {
  _id: string;
  comment: string;
  combinedOrder: any /* костыль */;
}

const UserDataModal: FC<IUserDataModalProps> = ({
  _id,
  comment,
  combinedOrder,
}) => {
  const inputCityRef = useRef(null);
  const inputAddressRef = useRef(null);

  const [data, setData] = useState({
    deliveryName: "",
    deliveryNameRecipient: "",
    deliveryPhone: "",
    deliveryCity: "",
    deliveryAddress: "",
  });

  const [isActive, setIsActive] = useState(true);
  const [isSuccessActive, setIsSuccessActive] = useState(false);

  const [isDropdownCityActive, setIsDropdownCityActive] =
    useState<boolean>(false);
  const [isDropdownAddressActive, setIsDropdownAddressActive] =
    useState<boolean>(false);

  const [cities, setCities] = useState<any>();
  const [deliverypoints, setDeliverypoints] = useState<any>();
  /* Пофиксить костыль! */
  const [cityCode, setCityCode] = useState<number>();
  const [PVZCode, setPVZCode] = useState<string>("");
  const [amount, setAmount] = useState(0);
  const [tarif, setTarif] = useState(0);

  const [isPreload, setIsPreload] = useState(false);

  //const [isPending, startTransition] = useTransition();

  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    /*startTransition(() => {
    });
    */

    setData({
      ...data,
      [name]: value,
    });
  }

  function handleSubmitDeliveyData(e: React.SyntheticEvent) {
    e.preventDefault();

    setIsPreload(true);

    deliveryAuthorization()
      .then((authData) => {
        deliveryCreate(
          authData.token,
          _id,
          comment,
          PVZCode,
          data.deliveryName,
          amount,
          data.deliveryPhone,
          data.deliveryNameRecipient,
          tarif
        )
          .then((orderInfo) => {
            getDeliveryInfo(authData.token, orderInfo.entity.uuid).then(() => {
              getDeliveryInfo(authData.token, orderInfo.entity.uuid)
                .then((orderCheckInfo) => {
                  if (orderCheckInfo.requests[0].state !== "INVALID") {
                    updateClientDeliveryAddress(
                      _id,
                      `${data.deliveryCity} ${data.deliveryAddress}`,
                      data.deliveryName,
                      data.deliveryNameRecipient,
                      data.deliveryPhone,
                      "Самовывоз из пункта выдачи CDEK",
                      orderInfo.entity.uuid
                    )
                      .then(() => {
                        if (combinedOrder.length > 0) {
                          combinedOrder[0].combinedOrder.map(
                            /* костыль */
                            (orderItem: any) => {
                              if (_id !== orderItem) {
                                updateClientDeliveryAddress(
                                  _id,
                                  `${data.deliveryCity} ${data.deliveryAddress}`,
                                  data.deliveryName,
                                  data.deliveryNameRecipient,
                                  data.deliveryPhone,
                                  "Самовывоз из пункта выдачи CDEK",
                                  orderInfo.entity.uuid
                                );
                              }
                            }
                          );
                        }
                      })
                      .then(() => {
                        setIsPreload(false);
                        setIsActive(false);
                        setTimeout(() => {
                          setIsSuccessActive(true);
                        }, 200);
                      })
                      .catch((err) => {
                        console.log(err);
                        setIsPreload(false);
                      });
                  } else {
                    setIsPreload(false);
                    if (
                      orderCheckInfo.requests[0].errors[0].code ===
                      "ev_cash_on_delivery_is_not_available_in_receiver_office"
                    ) {
                      alert(
                        "Ошибка! В выбранном пункте выдачи CDEK недоступен наложенный платеж. Выберете другой пункт выдачи CDEK"
                      );
                    } else {
                      alert(
                        "Ошибка! Проверьте корректность введённых данных или выберите другой пункт выдачи CDEK"
                      );
                    }
                  }
                })
                .catch((err) => {
                  console.log(err);
                  setIsPreload(false);
                });
            });
          })
          .catch((err) => {
            console.log(err);
            setIsPreload(false);
          });
      })
      .catch((err) => {
        console.log(err);
        setIsPreload(false);
      });
  }

  function closeCityDropdown(e: MouseEvent) {
    setIsDropdownCityActive(e && e.target === inputCityRef.current);
  }

  function closeAddressDropdown(e: MouseEvent) {
    setIsDropdownAddressActive(e && e.target === inputAddressRef.current);
  }

  function pickCityOption(city: string, code: number) {
    setData({
      deliveryName: data.deliveryName,
      deliveryNameRecipient: data.deliveryNameRecipient,
      deliveryPhone: data.deliveryPhone,
      deliveryCity: city,
      deliveryAddress: "",
    });
    setCityCode(code);

    deliveryAuthorization().then((authData) => {
      getDeliverypoints(authData.token, code).then((data) => {
        setDeliverypoints(data);
      });
    });
  }

  function pickAddressOption(address: string, code: string) {
    setData({
      deliveryName: data.deliveryName,
      deliveryNameRecipient: data.deliveryNameRecipient,
      deliveryPhone: data.deliveryPhone,
      deliveryCity: data.deliveryCity,
      deliveryAddress: address,
    });

    setPVZCode(code);

    deliveryAuthorization().then((authData) => {
      calculateTariff(authData.token, cityCode!).then((data) => {
        /* Пофиксить костыль! */
        const defaultTariff =
          data &&
          data.tariff_codes.find((item: any) => {
            if (item.tariff_code === 136) {
              return true;
            }
          });

        const economyTariff =
          (data &&
            data.tariff_codes.find((item: any) => {
              if (item.tariff_code === 234) {
                return true;
              }
            })) ||
          null;

        if (economyTariff !== null) {
          //console.log(economyTariff.delivery_sum);
          setAmount(economyTariff.delivery_sum + 100);
          setTarif(234);
        } else {
          //console.log(defaultTariff.delivery_sum);
          setAmount(defaultTariff.delivery_sum + 100);
          setTarif(136);
        }
      });
    });
  }

  /* Костыль! */
  const citySearch =
    cities &&
    cities.filter((cityItem: any) => {
      if (
        cityItem.city.toLowerCase().includes(data.deliveryCity.toLowerCase())
      ) {
        return true;
      }
    });

  const addressSearch =
    deliverypoints &&
    deliverypoints.filter((deliverypointItem: any) => {
      if (
        deliverypointItem.location.address
          .toLowerCase()
          .includes(data.deliveryAddress.toLowerCase())
      ) {
        return true;
      }
    });

  useEffect(() => {
    document.addEventListener("click", closeCityDropdown);
    return () => document.removeEventListener("click", closeCityDropdown);
  }, []);

  useEffect(() => {
    document.addEventListener("click", closeAddressDropdown);
    return () => document.removeEventListener("click", closeAddressDropdown);
  }, []);

  useEffect(() => {
    deliveryAuthorization().then((authData) => {
      setIsPreload(true);
      getCities(authData.token).then((data) => {
        setIsPreload(false);
        setCities(data);
      });
    });
  }, []);

  useEffect(() => {
    if (
      (data.deliveryPhone[0] === "+" &&
        data.deliveryPhone[1] === "7" &&
        data.deliveryPhone.length !== 12) ||
      (data.deliveryPhone[0] === "7" && data.deliveryPhone.length !== 11) ||
      (data.deliveryPhone[0] === "8" && data.deliveryPhone.length !== 11)
    ) {
      setIsPhoneValid(false);
    } else {
      setIsPhoneValid(true);
    }
  }, [data.deliveryPhone]);

  return (
    <>
      {isPreload && <PreloaderClient />}
      <div className={styles["user-data-modal"]}>
        <form
          onSubmit={handleSubmitDeliveyData}
          className={`${styles["user-data-modal__container"]} ${
            isActive && styles["user-data-modal__container_active"]
          }`}
        >
          <h2 className={styles["user-data-modal__title"]}>Заказ оплачен</h2>
          <div className={styles["user-data-modal__inputs-container"]}>
            <div className={styles["user-data-modal__input-container"]}>
              <label className={styles["user-data-modal__input-label"]}>
                Населённый пункт (адрес СДЭКа)
              </label>
              <input
                className={styles["user-data-modal__input"]}
                ref={inputCityRef}
                name="deliveryCity"
                value={data.deliveryCity}
                onChange={handleChange}
                type="text"
                required
                autoComplete="off"
                placeholder="Выберите из списка"
              />
              <div
                className={`${styles["user-data-modal__input-dropdown"]} ${
                  isDropdownCityActive &&
                  styles["user-data-modal__input-dropdown_active"]
                }`}
              >
                {cities &&
                  /* Пофиксить костыль! */
                  citySearch.splice(0, 10).map((item: any) => {
                    return (
                      <>
                        <p
                          key={item.city_uuid}
                          className={
                            styles["user-data-modal__input-dropdown-item"]
                          }
                          onClick={() => {
                            pickCityOption(item.city, item.code);
                          }}
                        >
                          {item.city}
                        </p>
                      </>
                    );
                  })}
              </div>
            </div>
            {cityCode && (
              <div className={styles["user-data-modal__input-container"]}>
                <label className={styles["user-data-modal__input-label"]}>
                  Пункт выдачи заказов СДЭК
                </label>
                <input
                  className={styles["user-data-modal__input"]}
                  ref={inputAddressRef}
                  name="deliveryAddress"
                  value={data.deliveryAddress}
                  onChange={handleChange}
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="Выберите из списка"
                />
                <div
                  className={`${styles["user-data-modal__input-dropdown"]} ${
                    isDropdownAddressActive &&
                    styles["user-data-modal__input-dropdown_active"]
                  }`}
                >
                  {deliverypoints &&
                    /* Пофиксить костыль! */
                    addressSearch.map((item: any) => {
                      return (
                        item.type !== "POSTAMAT" && (
                          <>
                            <p
                              key={item.code}
                              className={
                                styles["user-data-modal__input-dropdown-item"]
                              }
                              onClick={() => {
                                pickAddressOption(
                                  item.location.address,
                                  item.code
                                );
                              }}
                            >
                              {item.location.address}
                            </p>
                          </>
                        )
                      );
                    })}
                </div>
              </div>
            )}
            <div className={styles["user-data-modal__input-container"]}>
              <label className={styles["user-data-modal__input-label"]}>
                Ваш Телеграм в формате @Telegram
              </label>
              <input
                className={styles["user-data-modal__input"]}
                name="deliveryName"
                value={data.deliveryName}
                onChange={handleChange}
                type="text"
                required
              />
            </div>
            <div className={styles["user-data-modal__input-container"]}>
              <label className={styles["user-data-modal__input-label"]}>
                Фамилия Имя Отчество
              </label>
              <input
                className={styles["user-data-modal__input"]}
                name="deliveryNameRecipient"
                value={data.deliveryNameRecipient}
                onChange={handleChange}
                type="text"
                required
              />
            </div>
            <div className={styles["user-data-modal__input-container"]}>
              <label className={styles["user-data-modal__input-label"]}>
                Номер телефона
              </label>
              <input
                className={styles["user-data-modal__input"]}
                name="deliveryPhone"
                placeholder="Формат +79029990101 для РФ"
                value={data.deliveryPhone}
                onChange={handleChange}
                type="text"
                required
              />
            </div>
          </div>
          <button
            className={`${styles["order-pay__pay-submit"]} ${
              (data.deliveryName === "" ||
                data.deliveryNameRecipient === "" ||
                data.deliveryPhone === "" ||
                data.deliveryCity === "" ||
                data.deliveryAddress === "" ||
                PVZCode === "" ||
                !isPhoneValid) &&
              styles["order-pay__pay-submit_disabled"]
            }`}
            type="submit"
            disabled={
              data.deliveryName === "" ||
              data.deliveryNameRecipient === "" ||
              data.deliveryPhone === "" ||
              data.deliveryCity === "" ||
              data.deliveryAddress === "" ||
              PVZCode === "" ||
              !isPhoneValid
            }
          >
            Отправить
          </button>
          <span className={styles["order-pay__personal-data"]}>
            Нажимая на кнопку, вы даете согласие на обработку персональных
            данных и соглашаетесь c <a href="#">политикой конфиденциальности</a>
          </span>
        </form>

        <div
          className={`${styles["order-pay__success-modal"]} ${
            isSuccessActive && styles["order-pay__success-modal_active"]
          }`}
        >
          <h2 className={styles["user-data-modal__title"]}>Успешно!</h2>
          <a
            href={`${BASE_URL_FRONT}/order/${_id}`}
            className={`${styles["order-pay__pay-submit"]} ${styles["order-pay__success-btn"]}`}
          >
            Вернуться к заказу
          </a>
        </div>
      </div>
    </>
  );
};

export default UserDataModal;
