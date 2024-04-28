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
import {
  createPayLinkAnypayments,
  createPayLinkOnepay,
} from "../../utils/PaySystem";
import { BASE_URL, BASE_URL_FRONT } from "../../utils/constants";

interface IPaymentsProps {
  paymentsList: Array<IPayments>;
}

const Payments: FC<IPaymentsProps> = ({}) => {
  const [isSubmitPopup, setIsSubmitPopup] = useState<boolean>(false);
  const [paymentTitle, setPaymentTitle] = useState<string>("");
  const [paymentNumber, setPaymentNumber] = useState<string>("");
  const [paymentId, setPaymentId] = useState<any>("");

  const [paymentData, setPaymentData] = useState({
    title: "",
    number: "",
    idAnypayments: "",
    alternativeIdAnypayments: "",
    totalSumAnypayments: "",
    idOnepay: "",
    totalSumOnepay: "",
    orderUrlOnepay: "",
  });

  // Костыль!

  //const [payments, setPayments] = useState<any>(Payment.paymentsList);

  const [currentPayment, setCurrentPayment] = useState<IPayments>();

  const [isDrag, setIsDrag] = useState(false);

  const [isChangeOrder, setIsChangeOrder] = useState(false);

  const [isPreload, setIsPreload] = useState(false);

  const [urlAnypayments, setUrlAnypayments] = useState("");
  const [tokenAnypayments, setTokenAnypayments] = useState("");
  const [isSuccessCreateLinkAnypayments, setIsSuccessCreateLinkAnypayments] =
    useState(false);
  const [isFailedCreateLinkAnypayments, setIsFailedCreateLinkAnypayments] =
    useState(false);
  const [urlOnepay, setUrlOnepay] = useState("");
  const [tokenOnepay, setTokenOnepay] = useState("");
  const [isSuccessCreateLinkOnepay, setIsSuccessCreateLinkOnepay] =
    useState(false);
  const [isFailedCreateLinkOnepay, setIsFailedCreateLinkOnepay] =
    useState(false);

  const [isCopyUrlAnypayments, setIsCopyUrlAnypayments] = useState(false);
  const [isCopyTokenAnypayments, setIsCopyTokenAnypayments] = useState(false);
  const [isCopyUrlOnepay, setIsCopyUrlOnepay] = useState(false);
  const [isCopyTokenOnepay, setIsCopyTokenOnepay] = useState(false);

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
          idAnypayments: paymentData.idAnypayments,
          alternativeIdAnypayments: paymentData.alternativeIdAnypayments,
          totalSumAnypayments: paymentData.totalSumAnypayments,
          idOnepay: paymentData.idOnepay,
          totalSumOnepay: paymentData.totalSumOnepay,
          orderUrlOnepay: paymentData.orderUrlOnepay,
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

  function handleCreatePayLinkAnypayments(e: React.SyntheticEvent) {
    e.preventDefault();

    setIsPreload(true);
    setUrlAnypayments("");
    setTokenAnypayments("");
    setIsSuccessCreateLinkAnypayments(false);
    setIsFailedCreateLinkAnypayments(false);

    createPayLinkAnypayments(
      paymentData.idAnypayments === ""
        ? "undefined"
        : paymentData.idAnypayments,
      paymentData.alternativeIdAnypayments,
      parseInt(paymentData.totalSumAnypayments),
      `${BASE_URL_FRONT}/order/${paymentData.idAnypayments}`
    )
      .then((data) => {
        setUrlAnypayments(data.data.url);
        setTokenAnypayments(data.data.token);
        setIsPreload(false);
        setIsSuccessCreateLinkAnypayments(true);
      })
      .catch(() => {
        setUrlAnypayments("");
        setTokenAnypayments("");
        setIsFailedCreateLinkAnypayments(true);
        setIsPreload(false);
      });
  }

  function copyUrlAnypayments() {
    navigator.clipboard.writeText(urlAnypayments);

    setIsCopyUrlAnypayments(true);

    setTimeout(() => {
      setIsCopyUrlAnypayments(false);
    }, 2000);
  }

  function copyTokenAnypayments() {
    navigator.clipboard.writeText(tokenAnypayments);

    setIsCopyTokenAnypayments(true);

    setTimeout(() => {
      setIsCopyTokenAnypayments(false);
    }, 2000);
  }

  function handleCreatePayLinkOnepay(e: React.SyntheticEvent) {
    e.preventDefault();

    setIsPreload(true);
    setUrlOnepay("");
    setTokenOnepay("");
    setIsSuccessCreateLinkOnepay(false);
    setIsFailedCreateLinkOnepay(false);

    createPayLinkOnepay(
      paymentData.idOnepay,
      parseInt(paymentData.totalSumOnepay),
      `${BASE_URL_FRONT}/order/${paymentData.idOnepay}`,
      `${BASE_URL}/onepay-handler/${paymentData.idOnepay}`
    )
      .then((data) => {
        setUrlOnepay(data.data.attributes.url);
        setTokenOnepay(data.data.attributes.uuid);
        setIsPreload(false);
        setIsSuccessCreateLinkOnepay(true);
      })
      .catch(() => {
        setUrlOnepay("");
        setTokenOnepay("");
        setIsFailedCreateLinkOnepay(true);
        setIsPreload(false);
      });
  }

  function copyUrlOnepay() {
    navigator.clipboard.writeText(urlOnepay);

    setIsCopyUrlOnepay(true);

    setTimeout(() => {
      setIsCopyUrlOnepay(false);
    }, 2000);
  }

  function copyTokenOnepay() {
    navigator.clipboard.writeText(tokenOnepay);

    setIsCopyTokenOnepay(true);

    setTimeout(() => {
      setIsCopyTokenOnepay(false);
    }, 2000);
  }

  return (
    <section>
      {isPreload && <Preloader />}
      <form
        className={styles["payments__create-form"]}
        onSubmit={handleCreatePayLinkAnypayments}
      >
        <h2 className={styles["payments__title"]}>
          Cоздать платёжную ссылку anypayments
        </h2>
        <TextInput
          label="Длинный ID заказа"
          name="idAnypayments"
          handleChange={handleChange}
          value={paymentData.idAnypayments}
          required={false}
        />
        <span style={{ color: "red" }}>
          Обязательно длинный id для работы автоматической проверки оплаты
        </span>
        <TextInput
          label="ID заказа"
          name="alternativeIdAnypayments"
          handleChange={handleChange}
          value={paymentData.alternativeIdAnypayments}
          required={true}
        />
        <span style={{ color: "red" }}>Каждый id должен быть уникален</span>
        <TextInput
          label="Cумма"
          name="totalSumAnypayments"
          handleChange={handleChange}
          value={paymentData.totalSumAnypayments}
          required={true}
        />
        {isFailedCreateLinkAnypayments && (
          <span style={{ color: "red" }}>
            Ошибка! Попробуйте поменять id или ссылку на заказ
          </span>
        )}
        <button className={styles["payments__create-submit"]} type="submit">
          Создать
        </button>
        {isSuccessCreateLinkAnypayments && (
          <div>
            <div style={{ marginTop: "1rem" }}>url: {urlAnypayments}</div>
            <div
              style={{
                color: "#4e7fea",
                marginTop: "0.5rem",
                cursor: "pointer",
              }}
              onClick={copyUrlAnypayments}
            >
              {isCopyUrlAnypayments
                ? "Cкопировано в буфер обмена"
                : "Скопировать"}
            </div>
          </div>
        )}
        {isSuccessCreateLinkAnypayments && (
          <div>
            <div>token: {tokenAnypayments}</div>
            <div
              style={{
                color: "#4e7fea",
                marginTop: "0.5rem",
                cursor: "pointer",
              }}
              onClick={copyTokenAnypayments}
            >
              {isCopyTokenAnypayments
                ? "Cкопировано в буфер обмена"
                : "Скопировать"}
            </div>
          </div>
        )}
      </form>
      <form
        className={styles["payments__create-form"]}
        onSubmit={handleCreatePayLinkOnepay}
      >
        <h2 className={styles["payments__title"]}>
          Cоздать платёжную ссылку onepay
        </h2>
        <TextInput
          label="Длинный ID заказа"
          name="idOnepay"
          handleChange={handleChange}
          value={paymentData.idOnepay}
          required={true}
        />
        <span style={{ color: "red" }}>
          Обязательно длинный id для работы автоматической проверки оплаты
        </span>
        <TextInput
          label="Cумма"
          name="totalSumOnepay"
          handleChange={handleChange}
          value={paymentData.totalSumOnepay}
          required={true}
        />
        {isFailedCreateLinkOnepay && (
          <span style={{ color: "red" }}>
            Ошибка! Попробуйте поменять id или ссылку на заказ
          </span>
        )}
        <button className={styles["payments__create-submit"]} type="submit">
          Создать
        </button>
        {isSuccessCreateLinkOnepay && (
          <div>
            <div style={{ marginTop: "1rem" }}>url: {urlOnepay}</div>
            <div
              style={{
                color: "#4e7fea",
                marginTop: "0.5rem",
                cursor: "pointer",
              }}
              onClick={copyUrlOnepay}
            >
              {isCopyUrlOnepay ? "Cкопировано в буфер обмена" : "Скопировать"}
            </div>
          </div>
        )}
        {isSuccessCreateLinkOnepay && (
          <div>
            <div>token: {tokenOnepay}</div>
            <div
              style={{
                color: "#4e7fea",
                marginTop: "0.5rem",
                cursor: "pointer",
              }}
              onClick={copyTokenOnepay}
            >
              {isCopyTokenOnepay ? "Cкопировано в буфер обмена" : "Скопировать"}
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
