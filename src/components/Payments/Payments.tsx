import styles from "./Payments.module.css";
import { IPayments } from "../../types/interfaces";
import { FC, useState } from "react";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import { deletePayment, createPayment } from "../../utils/Payment";
import Payment from "../../store/payments";
import TextInput from "../UI/TextInput/TextInput";
import Preloader from "../UI/Preloader/Preloader";

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
  });

  // Костыль!

  const [payments, setPayments] = useState<any>(Payment.paymentsList);

  const [currentPayment, setCurrentPayment] = useState<IPayments>();

  const [isDrag, setIsDrag] = useState(false);

  const [isChangeOrder, setIsChangeOrder] = useState(false);

  const [isPreload, setIsPreload] = useState(false);

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
    target.style.background = "#FFF";
  }

  function dragStartHandler(e: React.SyntheticEvent, item: IPayments) {
    setIsDrag(true);
    setCurrentPayment(item);
  }

  function dragEndHandler(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    setIsDrag(false);
    target.style.background = "#FFF";
  }

  function dropHandler(e: React.SyntheticEvent, item: IPayments) {
    e.preventDefault();

    const target = e.target as HTMLInputElement;

    target.style.background = "#FFF";

    //const currentIndex = payments.indexOf(currentPayment!);
    //const dropIndex = payments.indexOf(item);

    Payment.setPaymentsList(
      payments.map((pItem: any) => {
        if (pItem._id === currentPayment?._id) {
          return item;
        }

        if (pItem._id === item._id) {
          return currentPayment;
        }

        return pItem;
      })
    );
  }

  async function changeOrderHandler() {
    if (!isChangeOrder) {
      setIsChangeOrder(true);
    } else {
      await setIsPreload(true);

      await Payment.paymentsList.map((item) => {
        deletePayment(item._id);
      });

      await setTimeout(() => {
        Payment.paymentsList.map((item) => {
          createPayment(item.title, item.number);
        });
      }, 1000);

      await setTimeout(() => {
        setIsPreload(false);
      }, 1500);

      await setTimeout(() => {
        alert("Успешно! Обновите страницу");
      }, 1500);

      await setIsChangeOrder(false);
    }
  }

  return (
    <section>
      {isPreload && <Preloader />}
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
      <div className={styles["payments__table-container"]}>
        <div className={styles["payments__title-container"]}>
          <h2 className={styles["payments__title"]}>Cпособы оплаты</h2>
          <button onClick={changeOrderHandler}>
            {isChangeOrder ? "сохр" : "изм."}
          </button>
        </div>
        <ul className={styles["payments__table-list"]}>
          {paymentsList.map((paymentItem) => {
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
