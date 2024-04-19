import styles from "./Payments.module.css";
import { IPayments } from "../../types/interfaces";
import { FC, useState } from "react";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import {
  deletePayment,
  createPayment,
  updatePaymentOrder,
} from "../../utils/Payment";
import Payment from "../../store/payments";
import TextInput from "../UI/TextInput/TextInput";
import Preloader from "../UI/Preloader/Preloader";
import UserData from "../../store/user";
import { createPaymentLink } from "../../utils/PaySystem";

interface IPaymentsProps {
  paymentsList: Array<IPayments>;
}

const Payments: FC<IPaymentsProps> = ({ paymentsList }) => {
  const [isSubmitPopup, setIsSubmitPopup] = useState<boolean>(false);
  const [paymentTitle, setPaymentTitle] = useState<string>("");
  const [paymentNumber, setPaymentNumber] = useState<string>("");
  const [paymentId, setPaymentId] = useState<any>("");

  const [paymentData, setPaymentData] = useState({
    title: "",
    number: "",
    id: "",
    totalSum: "",
    orderUrl: "",
  });

  // Костыль!

  const [payments, setPayments] = useState<any>(Payment.paymentsList);

  const [currentPayment, setCurrentPayment] = useState<IPayments>();

  const [isDrag, setIsDrag] = useState(false);

  const [isChangeOrder, setIsChangeOrder] = useState(false);

  const [isPreload, setIsPreload] = useState(false);

  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [isSuccessCreateLink, setIsSuccessCreateLink] = useState(false);
  const [isFailedCreateLink, setIsFailedCreateLink] = useState(false);

  const [isCopyUrl, setIsCopyUrl] = useState(false);
  const [isCopyToken, setIsCopyToken] = useState(false);

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setPaymentData({
      ...paymentData,
      [name]: value,
    });
  }

  function handleCreatePayment(e: React.SyntheticEvent) {
    e.preventDefault();
    createPayment(paymentData.title, paymentData.number)
      .then((payment) => {
        Payment.createPayment(payment);
        setPaymentData({
          title: "",
          number: "",
          id: paymentData.id,
          totalSum: paymentData.totalSum,
          orderUrl: paymentData.orderUrl,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function openSubmitPopup(title: string, number: string, id: string) {
    setPaymentTitle(title);
    setPaymentNumber(number);
    setPaymentId(id);
    setIsSubmitPopup(true);
  }

  function closeSubmitPopup() {
    setIsSubmitPopup(false);
  }

  function submitPopupFunction() {
    deletePayment(paymentId)
      .then(() => {
        Payment.deletePayment(paymentId);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function dragOverHandler(e: React.SyntheticEvent) {
    e.preventDefault();

    const target = e.target as HTMLInputElement;
    setIsDrag(true);

    if (isDrag) {
      target.style.background = "yellow";
    }
  }

  function dragLeaveHandler(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    setIsDrag(false);
    target.style.background = "transparent";
  }

  function dragStartHandler(e: React.SyntheticEvent, item: IPayments) {
    setIsDrag(true);
    setCurrentPayment(item);
  }

  function dragEndHandler(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    setIsDrag(false);
    target.style.background = "transparent";
  }

  function dropHandler(e: React.SyntheticEvent, item: IPayments) {
    e.preventDefault();

    const target = e.target as HTMLInputElement;

    target.style.background = "transparent";

    Payment.setPaymentsList(
      Payment.paymentsList.map((pItem: IPayments) => {
        if (pItem._id === currentPayment?._id) {
          return { ...pItem, paymentOrder: item.paymentOrder };
        }

        if (pItem._id === item._id) {
          return { ...pItem, paymentOrder: currentPayment!.paymentOrder };
        }

        return pItem;
      })
    );
  }

  const sortCards = (a: IPayments, b: IPayments) => {
    if (a.paymentOrder > b.paymentOrder) {
      return 1;
    } else {
      return -1;
    }
  };

  async function changeOrderHandler() {
    if (!isChangeOrder) {
      setIsChangeOrder(true);
    } else {
      await setIsPreload(true);

      await Payment.paymentsList.map((item) => {
        updatePaymentOrder(item._id, item.paymentOrder);
      });

      await setIsChangeOrder(false);
      await setIsPreload(false);
    }
  }

  function createPayLink(e: React.SyntheticEvent) {
    e.preventDefault();

    setIsPreload(true);
    setUrl("");
    setToken("");
    setIsSuccessCreateLink(false);
    setIsFailedCreateLink(false);

    createPaymentLink(
      paymentData.id,
      parseInt(paymentData.totalSum),
      paymentData.orderUrl
    )
      .then((data) => {
        setUrl(data.data.url);
        setToken(data.data.token);
        setIsPreload(false);
        setIsSuccessCreateLink(true);
      })
      .catch(() => {
        setUrl("");
        setToken("");
        setIsFailedCreateLink(true);
        setIsPreload(false);
      });
  }

  function copyUrl() {
    navigator.clipboard.writeText(url);

    setIsCopyUrl(true);

    setTimeout(() => {
      setIsCopyUrl(false);
    }, 2000);
  }

  function copyToken() {
    navigator.clipboard.writeText(token);

    setIsCopyToken(true);

    setTimeout(() => {
      setIsCopyToken(false);
    }, 2000);
  }

  return (
    <section>
      {isPreload && <Preloader />}
      <form
        className={styles["payments__create-form"]}
        onSubmit={createPayLink}
      >
        <h2 className={styles["payments__title"]}>Cоздать платёжную ссылку</h2>
        <TextInput
          label="ID заказа"
          name="id"
          handleChange={handleChange}
          value={paymentData.id}
          required={true}
        />
        <span style={{ color: "red" }}>Каждый id должен быть уникален</span>
        <TextInput
          label="Cумма"
          name="totalSum"
          handleChange={handleChange}
          value={paymentData.totalSum}
          required={true}
        />
        <TextInput
          label="Ссылка на заказ"
          name="orderUrl"
          handleChange={handleChange}
          value={paymentData.orderUrl}
          required={true}
        />
        {isFailedCreateLink && (
          <span style={{ color: "red" }}>
            Ошибка! Попробуйте поменять id или ссылку на заказ
          </span>
        )}
        <button className={styles["payments__create-submit"]} type="submit">
          Создать
        </button>
        {isSuccessCreateLink && (
          <div>
            <div style={{ marginTop: "1rem" }}>url: {url}</div>
            <div
              style={{
                color: "#4e7fea",
                marginTop: "0.5rem",
                cursor: "pointer",
              }}
              onClick={copyUrl}
            >
              {isCopyUrl ? "Cкопировано в буфер обмена" : "Скопировать"}
            </div>
          </div>
        )}
        {isSuccessCreateLink && (
          <div>
            <div>token: {token}</div>
            <div
              style={{
                color: "#4e7fea",
                marginTop: "0.5rem",
                cursor: "pointer",
              }}
              onClick={copyToken}
            >
              {isCopyToken ? "Cкопировано в буфер обмена" : "Скопировать"}
            </div>
          </div>
        )}
      </form>
      {(UserData.userData.position === "Создатель" ||
        UserData.userData.position === "Главный администратор" ||
        UserData.userData.position === "Администратор") && (
        <form
          onSubmit={handleCreatePayment}
          className={styles["payments__create-form"]}
        >
          <h2 className={styles["payments__title"]}>Cоздать способ оплаты</h2>
          <TextInput
            label="Способ оплаты"
            name="title"
            placeholder="Перевод на «Тинькофф» по номеру карты"
            handleChange={handleChange}
            value={paymentData.title}
            required={true}
          />
          <TextInput
            label="Номер"
            name="number"
            placeholder="9345 4023 8990 0901"
            handleChange={handleChange}
            value={paymentData.number}
            required={true}
          />
          <button className={styles["payments__create-submit"]}>Создать</button>
        </form>
      )}
      <div className={styles["payments__table-container"]}>
        <div className={styles["payments__title-container"]}>
          <h2 className={styles["payments__title"]}>Cпособы оплаты</h2>
          {(UserData.userData.position === "Создатель" ||
            UserData.userData.position === "Главный администратор" ||
            UserData.userData.position === "Администратор") && (
            <button onClick={changeOrderHandler}>
              {isChangeOrder ? "сохр" : "изм."}
            </button>
          )}
        </div>
        <ul className={styles["payments__table-list"]}>
          {Payment.paymentsList.sort(sortCards).map((paymentItem) => {
            return (
              <li
                key={paymentItem._id}
                className={styles["payments__table-item"]}
                onDragOver={(e) => dragOverHandler(e)}
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDragStart={(e) => dragStartHandler(e, paymentItem)}
                onDragEnd={(e) => dragEndHandler(e)}
                onDrop={(e) => dropHandler(e, paymentItem)}
                draggable={isChangeOrder}
              >
                {(UserData.userData.position === "Создатель" ||
                  UserData.userData.position === "Главный администратор" ||
                  UserData.userData.position === "Администратор") && (
                  <button
                    onClick={() =>
                      openSubmitPopup(
                        paymentItem.title,
                        paymentItem.number,
                        paymentItem._id
                      )
                    }
                    className={styles["payments__delete-button"]}
                  ></button>
                )}
                <div
                  className={`${styles["payments__table-info-container"]} ${
                    isChangeOrder &&
                    styles["payments__table-info-container_disabled"]
                  }`}
                >
                  <h4 className={styles["payments__table-info-title"]}>
                    {paymentItem.title}
                  </h4>
                  <p className={styles["payments__table-info-number"]}>
                    {paymentItem.number}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <SubmitPopup
        submitText={`Удалить ${paymentTitle} ${paymentNumber}`}
        isSubmitPopup={isSubmitPopup}
        closeSubmitPopup={closeSubmitPopup}
        onSubmit={submitPopupFunction}
      />
    </section>
  );
};

export default Payments;
