import styles from "./Client.module.css";
import OrderData from "../../store/order";

const Client = () => {
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

  return (
    <div className={styles["client"]}>
      {OrderData.order.deliveryName !== "" && (
        <>
          <h4>Telegram</h4>
          <p className={styles["client-copy"]} onClick={copyTg}>
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
          <h4>Номер телефона</h4>
          <p className={styles["client-copy"]} onClick={copyPhone}>
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
          {OrderData.order.deliveryNameRecipient !== "" && (
            <>
              <h4>ФИО получателя</h4>
              <p>{OrderData.order.deliveryNameRecipient}</p>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Client;
