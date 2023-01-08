import React, { FC, useState } from "react";
import styles from "./Login.module.css";

interface ILoginProps {
  handleAuthorization: (email: string, password: string) => void;
  loginError: number;
}

const Login: FC<ILoginProps> = ({ handleAuthorization, loginError }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    handleAuthorization(data.email, data.password);
  };

  return (
    <section className={styles["login"]}>
      <div className={styles["login__container"]}>
        <h2 className={styles["login__title"]}>Рады видеть!</h2>
        <form className={styles["login__form"]} onSubmit={handleSubmit}>
          <label className={styles["login__label"]} htmlFor="email">
            E-mail
            <input
              className={styles["login__input"]}
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              required
            />
          </label>
          <label className={styles["login__label"]} htmlFor="email">
            Пароль
            <input
              className={styles["login__input"]}
              type="password"
              id="password"
              name="password"
              minLength={2}
              onChange={handleChange}
              required
            />
          </label>
          <div className={styles["login__auth-container"]}>
            {loginError === 401 && (
              <span className={styles["login__submit-span"]}>
                Вы ввели неправильный логин или пароль.
              </span>
            )}
            <button onClick={handleSubmit} type="submit" className={styles["login__submit"]}>
              Войти
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
