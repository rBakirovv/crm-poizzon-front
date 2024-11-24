import React, { useState } from "react";
import { changePassword } from "../../utils/User";
import TextInput from "../UI/TextInput/TextInput";
import styles from "./Account.module.css";
import UserData from "../../store/user";
import { observer } from "mobx-react-lite";
import {
  deleteDraftImage,
  deleteFinalOrder,
  deleteOrder,
  deleteOrderImage,
  deletePayProofImage,
  deletePurchaseImage,
  deleteReceiptImage,
  getCurrentOrder,
  getLongCompletedOrders,
} from "../../utils/Order";
import { IOrder, IOrderImages } from "../../types/interfaces";
import SubmitPopup from "../SubmitPopup/SubmitPopup";

const Account = observer(() => {
  const [data, setData] = useState({
    new_password: "",
    new_password_copy: "",
  });

  const [isDelete, setIsDelete] = useState(false);

  const handleChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: value,
    });
  };

  const handeSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (
      data.new_password === data.new_password_copy &&
      data.new_password !== "" &&
      data.new_password_copy !== ""
    ) {
      changePassword(data.new_password)
        .then(() => {
          alert("Пароль успешно сменён");
        })
        .then(() => {
          setData({
            new_password: "",
            new_password_copy: "",
          });
        });
    } else {
      alert("Пароли не совпадают");
    }
  };

  function openDeletePopup() {
    setIsDelete(true);
  }

  function closeDeletePopup() {
    setIsDelete(false);
  }

  function handleDelete() {
    getLongCompletedOrders().then((longCompletedOrders) => {
      longCompletedOrders.length > 0 &&
        longCompletedOrders.map((item: IOrder) => {
          if (longCompletedOrders.length !== 0) {
            getCurrentOrder(item._id)
              .then((order) => {
                if (order.orderImages.length !== 0) {
                  order.orderImages.map((imageItem: IOrderImages) => {
                    deleteDraftImage(imageItem.name, order._id).catch((err) =>
                      console.log(err)
                    );
                  });
                }

                if (order.payProofImages.length !== 0) {
                  order.payProofImages.map((imageItem: IOrderImages) => {
                    deletePayProofImage(imageItem.name, order._id).catch(
                      (err) => console.log(err)
                    );
                  });
                }

                if (order.buyProofImages.length !== 0) {
                  order.buyProofImages.map((imageItem: IOrderImages) => {
                    deletePurchaseImage(imageItem.name, order._id).catch(
                      (err) => console.log(err)
                    );
                  });
                }

                if (order.receiptImages.length !== 0) {
                  order.receiptImages.map((imageItem: IOrderImages) => {
                    order.receiptImages.length !== 0 &&
                      deleteReceiptImage(imageItem.name, order._id).catch(
                        (err) => console.log(err)
                      );
                  });
                }
              })
              .then(() => {
                deleteFinalOrder(item._id);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
    });
  }

  return (
    <section className={styles["account"]}>
      <div className={styles["account__container"]}>
        <form className={styles["account__form"]} onSubmit={handeSubmit}>
          <h2 className={styles["account__form-title"]}>Cменить пароль</h2>
          <TextInput
            label="Новый пароль"
            name="new_password"
            required={true}
            value={data.new_password}
            handleChange={handleChange}
          />
          <TextInput
            label="Повторите новый пароль"
            name="new_password_copy"
            required={true}
            value={data.new_password_copy}
            handleChange={handleChange}
          />
          {UserData.userData.position === "Создатель" && (
            <button
              type="button"
              className={styles["account__delete"]}
              onClick={openDeletePopup}
              style={{display: "none"}}
            >
              Удалить старые заказы
            </button>
          )}
          <button className={styles["account__submit"]} type="submit">
            Cохранить
          </button>
        </form>
      </div>
      <SubmitPopup
        isSubmitPopup={isDelete}
        submitText={`Удалить старые заказы`}
        onSubmit={handleDelete}
        closeSubmitPopup={closeDeletePopup}
      />
    </section>
  );
});

export default Account;
