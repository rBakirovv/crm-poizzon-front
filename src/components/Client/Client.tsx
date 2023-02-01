import styles from "./Client.module.css";
import OrderData from "../../store/order";

const Client = () => {
  return (
    <div className={styles["client"]}>
      {OrderData.order.deliveryName !== "" && (
        <>
          <h4>Имя</h4>
          <p>{OrderData.order.deliveryName}</p>
          <h4>Номер телефона</h4>
          <p>{OrderData.order.deliveryPhone}</p>
          <h4>ФИО получателя</h4>
          <p>{OrderData.order.deliveryNameRecipient}</p>
        </>
      )}
    </div>
  );
};

export default Client;
