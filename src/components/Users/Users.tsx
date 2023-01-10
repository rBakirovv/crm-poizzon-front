import React, { FC, useState } from "react";
import { IUserData } from "../../types/interfaces";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import { deleteUser, createUser } from "../../utils/User";
import UsersDataList from "../../store/usersList";
import styles from "./Users.module.css";
import usersList from "../../store/usersList";
import { SUPERADMIN } from "../../utils/constants";
import TextInput from "../UI/TextInput/TextInput";

interface IUsersProps {
  userPosition: string;
  userId?: string;
  users: Array<IUserData>;
}

const Users: FC<IUsersProps> = ({ userPosition, userId, users }) => {
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isSubmitPopup, setIsSubmitPopup] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    position: "",
    password: "",
  });

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setUserData({
      ...userData,
      [name]: value,
    });
  }

  function handleCreateUser(e: React.SyntheticEvent) {
    e.preventDefault();
    createUser(
      userData.name,
      userData.email,
      userData.position,
      userData.password
    )
      .then((user) => {
        usersList.createUser(user);
        setUserData({
          name: "",
          email: "",
          position: "",
          password: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function openSubmitPopup(email: string) {
    setUserEmail(email);
    setIsSubmitPopup(true);
  }

  function closeSubmitPopup() {
    setIsSubmitPopup(false);
  }

  function submitPopupFunction() {
    deleteUser(userEmail)
      .then(() => {
        UsersDataList.deleteUser(userEmail);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleDeleteButtonClick() {
    setIsDelete(!isDelete);
  }

  return (
    <section className={styles["users"]}>
      {userPosition === SUPERADMIN && (
        <form
          onSubmit={handleCreateUser}
          className={styles["users__create-form"]}
        >
          <h2 className={styles["users__create-title"]}>
            Создать пользователя:
          </h2>
          <TextInput
            label="Имя"
            name="name"
            handleChange={handleChange}
            value={userData.name}
            required={true}
          />
          <TextInput
            label="E-mail"
            name="email"
            handleChange={handleChange}
            value={userData.email}
            required={true}
          />
          <div className={styles["users__create-input-container"]}>
            <label className={styles["users__create-label"]}>
              Должность<span className={styles["red-star"]}>*</span>
            </label>
            <select
              className={`${styles["users__create-input"]} ${styles["users__create-select"]}`}
              name="position"
              onChange={handleChange}
              value={userData.position}
              required
            >
              <option value="" disabled selected>
                -- Выберите позицию --
              </option>
              <option value="Менеджер">Менеджер</option>
              <option value="Байер">Байер</option>
              <option value="Администратор">Администратор</option>
            </select>
          </div>
          <TextInput
            label="Пароль"
            name="password"
            handleChange={handleChange}
            value={userData.password}
            required={true}
          />
          <button className={styles["users__create-submit"]} type="submit">
            Cоздать
          </button>
        </form>
      )}
      <h2 className={styles["users__table-title"]}>Пользователи:</h2>
      <div className={styles["users__table-container"]}>
        {userPosition === SUPERADMIN && (
          <button
            className={styles["users__table-item-delete"]}
            onClick={handleDeleteButtonClick}
          >
            {isDelete ? "Закрыть" : "Удалить"}
          </button>
        )}
        <div className={styles["users__table"]}>
          <div className={styles["users__table-name-container"]}>
            <div className={styles["users__table-name"]}>Имя</div>
            <div className={styles["users__table-name"]}>E-mail</div>
            <div className={styles["users__table-name"]}>Должность</div>
          </div>
          <ul className={styles["users__table-list"]}>
            {users.map((userItem: IUserData) => {
              return (
                <li
                  key={userItem._id}
                  className={styles["users__table-list-item"]}
                >
                  <p className={styles["users__table-list-text"]}>
                    {userItem.name}
                  </p>
                  <p className={styles["users__table-list-text"]}>
                    {userItem.email}
                  </p>
                  <p className={styles["users__table-list-text"]}>
                    {userItem.position}
                  </p>
                  {userId !== userItem._id &&
                    userPosition === SUPERADMIN &&
                    isDelete && (
                      <button
                        className={styles["users__table-delete"]}
                        onClick={() => openSubmitPopup(userItem.email)}
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
                          />
                        </svg>
                      </button>
                    )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <SubmitPopup
        submitText={`Удалить пользователя ${userEmail}`}
        onSubmit={submitPopupFunction}
        isSubmitPopup={isSubmitPopup}
        closeSubmitPopup={closeSubmitPopup}
      />
    </section>
  );
};

export default Users;
