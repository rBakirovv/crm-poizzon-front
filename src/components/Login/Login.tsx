import styles from "./Login.module.css";

export default function Login() {
  return (
    <section className={styles["login"]}>
      <div className={styles["login__container"]}>
        <h2 className={styles["login__title"]}>Рады видеть!</h2>
        <form className={styles["login__form"]} noValidate>
          <label className={styles["login__label"]} htmlFor="email">
            E-mail
            <input
              className={styles["login__input"]}
              type="email"
              id="email"
              name="email"
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
              required
            />
          </label>
          <div className={styles["login__auth-container"]}>
            <span className={styles["login__submit-span"]}>
              Вы ввели неправильный логин или пароль.
            </span>
            <button type="submit" className={styles["login__submit"]}>
              Войти
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
