import React, { useState } from "react";
import { changePassword } from "../../utils/User";
import TextInput from "../UI/TextInput/TextInput";
import styles from "./Account.module.css";

const Account = () => {
  const [data, setData] = useState({
    new_password: "",
    new_password_copy: "",
  });

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
          <button className={styles["account__submit"]} type="submit">
            Cохранить
          </button>
        </form>
      </div>
    </section>
  );
};

export default Account;
