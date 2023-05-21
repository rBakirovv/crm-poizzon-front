import { FC, useState } from "react";
import OrderData from "../../../store/order";
import styles from "./UserDataModal.module.css";
import TextInput from "../TextInput/TextInput";
import { setDeliveryData, updateDeliveryData } from "../../../utils/Order";

interface IUserDataModalProps {
  _id: string;
}

const UserDataModal: FC<IUserDataModalProps> = ({ _id }) => {
  const [data, setData] = useState({
    deliveryName: "",
    deliveryPhone: "",
  });

  const [isActive, setIsActive] = useState<boolean>(true);

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: value,
    });
  }

  function handleSubmitDeliveyData(e: React.SyntheticEvent) {
    e.preventDefault();

    setDeliveryData(_id, data.deliveryName, data.deliveryPhone).then(() =>
      setIsActive(false)
    );
  }

  return (
    <>
      {isActive && (
        <div className={styles["user-data-modal"]}>
          <div className={styles["user-data-modal__container"]}>
            <h2 className={styles["user-data-modal__title"]}>
              Пожалуйста, заполните данные
            </h2>
            <TextInput
              name="deliveryName"
              label="Ваш Телеграм в формате @Telegram"
              value={data.deliveryName}
              handleChange={handleChange}
              required={true}
            />
            <TextInput
              name="deliveryPhone"
              label="Ваш номер телефона"
              placeholder="Формат +79029990101 для РФ"
              value={data.deliveryPhone}
              handleChange={handleChange}
              required={true}
            />
            <button
              className={styles["order-pay__pay-submit"]}
              type="submit"
              disabled={
                data.deliveryName === "" ||
                data.deliveryPhone === "" ||
                (data.deliveryPhone[0] === "+" &&
                  data.deliveryPhone[1] === "7" &&
                  data.deliveryPhone.length > 12) ||
                (data.deliveryPhone[0] === "7" &&
                  data.deliveryPhone.length > 11) ||
                (data.deliveryPhone[0] === "8" &&
                  data.deliveryPhone.length > 11)
              }
              onClick={handleSubmitDeliveyData}
            >
              Отправить
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDataModal;
