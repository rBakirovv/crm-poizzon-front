import styles from "./Payments.module.css";
import { IPayments } from "../../types/interfaces";
import { FC, useState } from "react";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import { deletePayment, createPayment } from "../../utils/Payment";
import Payment from "../../store/payments";
import TextInput from "../UI/TextInput/TextInput";

interface IPaymentsProps {
  paymentsList: Array<IPayments>;
}

const Payments: FC<IPaymentsProps> = ({ paymentsList }) => {
  const [isSubmitPopup, setIsSubmitPopup] = useState<boolean>(false);
  const [paymentTitle, setPaymentTitle] = useState<string>("");
  const [paymentNumber, setPaymentNumber] = useState<string>("");
  const [paymentId, setPaymentId] = useState<string>("");

  const [paymentData, setPaymentData] = useState({
    title: "",
    number: "",
  });

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

  return (
    <section>
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
        <h2 className={styles["payments__title"]}>Cпособы оплаты</h2>
        <ul className={styles["payments__table-list"]}>
          {paymentsList.map((paymentItem) => {
            return (
              <li
                key={paymentItem._id}
                className={styles["payments__table-item"]}
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
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M32 28.8L19.2 16L32 3.2L28.8 0L16 12.8L3.2 0L0 3.2L12.8 16L0 28.8L3.2 32L16 19.2L28.8 32L32 28.8Z"
                      fill="black"
                    ></path>
                  </svg>
                </button>
                <div className={styles["payments__table-info-container"]}>
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
        submitText={`Удалить ${paymentTitle}: ${paymentNumber}`}
        isSubmitPopup={isSubmitPopup}
        closeSubmitPopup={closeSubmitPopup}
        onSubmit={submitPopupFunction}
      />
    </section>
  );
};

export default Payments;
