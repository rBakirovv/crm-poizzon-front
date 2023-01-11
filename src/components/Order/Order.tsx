import { useEffect, useState } from "react";
import ImagePopup from "../ImagePopup/ImagePopup";
import Timer from "../UI/Timer/Timer";
import styles from "./Order.module.css";

export default function Order() {
  const [isBrowser, setIsBrowser] = useState<boolean>(false);

  const [currentImage, setCurrentImage] = useState<string>("");
  const [isImagePopupOpen, setIsImagePopupOpen] = useState<boolean>(false);

  const [timeLeft, setTimeLeft] = useState<number>(1 * 60);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsBrowser(true);
    }
  });

  function openPoup(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    setCurrentImage(target.src);
    setIsImagePopupOpen(true);
  }

  function closePopup() {
    setIsImagePopupOpen(false);
  }

  function handleTimeLeft() {
    alert(
      "Время для оплаты заказа истекло. Стоимость товара могла измениться. \n\nЕсли вы готовы оплатить товар, сообщите менеджеру в @telegram"
    );
  }

  return (
    <section className={styles["order"]}>
      <div className={styles["order__container"]}>
        <div className={styles["order__shoes-image-container"]}>
          <div className={styles["order__shoes-image-inner"]}>
            <img
              className={styles["order__shoes-image"]}
              src="../images/snick.webp"
              alt="Добавить имя обуви!"
              onClick={openPoup}
            />
          </div>
        </div>
        <ul className={styles["order__shoes-image-collection"]}>
          <li className={styles["order__shoes-image-collection-item"]}>
            <img src="../images/snick-nike.webp" onClick={openPoup} />
          </li>
          <li className={styles["order__shoes-image-collection-item"]}>
            <img src="../images/size-table-nike.png" onClick={openPoup} />
          </li>
          <li className={styles["order__shoes-image-collection-item"]}>
            <img src="../images/size.png" onClick={openPoup} />
          </li>
          <li className={styles["order__shoes-image-collection-item"]}>
            <img src="../images/size.png" onClick={openPoup} />
          </li>
        </ul>
        <h2 className={styles["order__shoes-title"]}>LiNing CF</h2>
        <div className={styles["order__shoes-size-container"]}>
          <p className={styles["order__shoes-size"]}>Размер: 41.5</p>
          <a
            className={styles["order__shoes-poizon-link"]}
            href="https://m.dewu.com/router/product/ProductDetail?spuId=2841380&sourceName=shareDetail&outside_channel_type=0&share_platform_title=7&fromUserId=db6c570a3279c549c0deaa28d7055b94&skuId=611549517"
            target="_blank"
            rel="noreferrer"
          >
            Открыть в Poizon
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="#4e7fea"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.4545 1V2.45455H15.5L6.56818 11.3864L7.61364 12.4318L16.5455 3.5V7.54545H18V1.72727V1H17.2727H11.4545ZM2 3.90909V17H15.0909V7.54545L13.6364 9V15.5455H3.45455V5.36364H10L11.4545 3.90909H2Z"
                fill="#4e7fea"
              ></path>
            </svg>
          </a>
        </div>
        <div
          className={`${styles["order-divider"]} ${styles["order-divider_horizontal"]}`}
        ></div>
        <h2 className={styles["order__title"]}>Итоговая сумма: 5650 ₽</h2>
        {isBrowser && (
          <table cellPadding={"5px"} className={styles["order__price-table"]}>
            <tbody>
              <tr>
                <td>Цена в CNY</td>
                <td>289 ¥</td>
              </tr>
              <tr>
                <td>Курс обмена</td>
                <td>11.7 ₽</td>
              </tr>
              <tr>
                <td>Цена в RUB</td>
                <td>3382 ₽</td>
              </tr>
              <tr>
                <td>Доставка по Китаю</td>
                <td>350 ₽</td>
              </tr>
              <tr>
                <td>Доставка в РФ</td>
                <td>1100 ₽</td>
              </tr>
              <tr>
                <td>Комиссия сервиса</td>
                <td>1000 ₽</td>
              </tr>
              <tr>
                <td>Промо-код</td>
                <td>20 %</td>
              </tr>
            </tbody>
          </table>
        )}
        <div
          className={`${styles["order-divider"]} ${styles["order-divider_horizontal"]}`}
        ></div>
        <p className={styles["order-text"]}><span className={styles["order__bold-span"]}>Способ доставки:</span> самовывоз из пункта выдачи СДЭК</p>
        <p className={styles["order-text"]}><span className={styles["order__bold-span"]}>Адрес:</span> Санкт-Петербург пр-т Римского-Корсакова, 39</p>
        <div
          className={`${styles["order-divider"]} ${styles["order-divider_horizontal"]}`}
        ></div>
        <h2 className={styles["order__title"]}>Отслеживание заказа</h2>
        <ul className={styles["order-timeline"]}>
          <li className={styles["order-timeline-item"]}>
            <div className={styles["order-timeline-item-tail"]}></div>
            <div
              className={`${styles["order-timeline-item-head"]} ${styles["order-timeline-item-head-green"]}`}
            ></div>
            <div className={styles["order-timeline-item-content"]}>
              <div className={styles["order-typography"]}>Проверка оплаты</div>
              <a
                className={styles["order-typography-screen-link"]}
                href="#"
                target="_blank"
              >
                Скриншот оплаты
              </a>
            </div>
          </li>
          <li className={styles["order-timeline-item"]}>
            <div className={styles["order-timeline-item-tail"]}></div>
            <div
              className={`${styles["order-timeline-item-head"]} ${styles["order-timeline-item-head-green"]}`}
            ></div>
            <div className={styles["order-timeline-item-content"]}>
              <div className={styles["order-typography"]}>Оплачен</div>
            </div>
          </li>
          <li className={styles["order-timeline-item"]}>
            <div className={styles["order-timeline-item-tail"]}></div>
            <div
              className={`${styles["order-timeline-item-head"]} ${styles["order-timeline-item-head-green"]}`}
            ></div>
            <div className={styles["order-timeline-item-content"]}>
              <div className={styles["order-typography"]}>На закупке</div>
            </div>
          </li>
          <li className={styles["order-timeline-item"]}>
            <div className={styles["order-timeline-item-tail"]}></div>
            <div
              className={`${styles["order-timeline-item-head"]} ${styles["order-timeline-item-head-green"]}`}
            ></div>
            <div className={styles["order-timeline-item-content"]}>
              <div className={styles["order-typography"]}>Закуплен</div>
              <a
                className={styles["order-typography-screen-link"]}
                href="#"
                target="_blank"
              >
                Чек закупки №1
              </a>
              <a
                className={styles["order-typography-screen-link"]}
                href="#"
                target="_blank"
              >
                Чек закупки №2
              </a>
            </div>
          </li>
          <li className={styles["order-timeline-item"]}>
            <div className={styles["order-timeline-item-tail"]}></div>
            <div
              className={`${styles["order-timeline-item-head"]} ${styles["order-timeline-item-head-green"]}`}
            ></div>
            <div className={styles["order-timeline-item-content"]}>
              <div className={styles["order-typography"]}>
                На складе в Китае
                <p className={styles["order-typography-screen-text"]}>
                  Трек номер Poizon: 455HUDN8DICK
                </p>
              </div>
            </div>
          </li>
          <li className={styles["order-timeline-item"]}>
            <div className={styles["order-timeline-item-tail"]}></div>
            <div className={`${styles["order-timeline-item-head"]}`}></div>
            <div className={styles["order-timeline-item-content"]}>
              <div className={styles["order-typography"]}>
                Доставка в Москву
              </div>
            </div>
          </li>
          <li className={styles["order-timeline-item"]}>
            <div className={styles["order-timeline-item-tail"]}></div>
            <div className={`${styles["order-timeline-item-head"]}`}></div>
            <div className={styles["order-timeline-item-content"]}>
              <div className={styles["order-typography"]}>На складе в РФ</div>
            </div>
          </li>
          <li className={styles["order-timeline-item"]}>
            <div className={styles["order-timeline-item-tail"]}></div>
            <div className={`${styles["order-timeline-item-head"]}`}></div>
            <div className={styles["order-timeline-item-content"]}>
              <div className={styles["order-typography"]}>Доставляется</div>
            </div>
          </li>
          <li className={styles["order-timeline-item"]}>
            <div className={`${styles["order-timeline-item-head"]}`}></div>
            <div className={styles["order-timeline-item-content"]}>
              <div className={styles["order-typography"]}>Завершён</div>
            </div>
          </li>
        </ul>
        <button
          className={styles["order__pay-button"]}
          onClick={handleTimeLeft}
        >
          <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} />
          <span className={styles["order__pay-button-span"]}>Оплатить</span>
          <span>5832 ₽</span>
        </button>
      </div>
      <ImagePopup
        currentImage={currentImage}
        isImagePopupOpen={isImagePopupOpen}
        closePopup={closePopup}
      />
    </section>
  );
}
