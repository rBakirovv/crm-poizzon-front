import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { IOrder } from "../../types/interfaces";
import { BASE_URL } from "../../utils/constants";
import Carousel from "../UI/Carousel/Carousel";
import Timer from "../UI/Timer/Timer";
import styles from "./Order.module.css";

interface IOrderProps {
  currentOrder: IOrder;
}

const Order: FC<IOrderProps> = ({ currentOrder }) => {
  const router = useRouter();

  const [isBrowser, setIsBrowser] = useState<boolean>(false);

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState<boolean>(false);

  const [timeLeft, setTimeLeft] = useState<number>(
    Math.ceil(
      Math.round(
        new Date(currentOrder.overudeAfter).getTime() -
          new Date(Date.now()).getTime()
      ) / 1000
    )
  );

  const priceRub = Math.ceil(
    parseFloat(currentOrder.priceCNY) * parseFloat(currentOrder.currentRate)
  );

  const totalPrice = Math.ceil(
    priceRub +
      parseFloat(currentOrder.priceDeliveryChina) +
      parseFloat(currentOrder.priceDeliveryRussia) +
      parseFloat(currentOrder.commission) -
      currentOrder.promoCodePercent
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsBrowser(true);
    }
  });

  function openPopup(index: number) {
    setIsImagePopupOpen(true);
    setCurrentImageIndex(index);
  }

  function closePopup() {
    setIsImagePopupOpen(false);
  }

  function nextImage() {
    currentImageIndex === currentOrder.orderImages.length - 1
      ? setCurrentImageIndex(0)
      : setCurrentImageIndex(currentImageIndex + 1);
  }

  function prevImage() {
    currentImageIndex === 0
      ? setCurrentImageIndex(currentOrder.orderImages.length - 1)
      : setCurrentImageIndex(currentImageIndex - 1);
  }

  function handleTimeLeft() {
    timeLeft <= 0
      ? alert(
          "Время для оплаты заказа истекло. Стоимость товара могла измениться. \n\nЕсли вы готовы оплатить товар, сообщите менеджеру в @telegram"
        )
      : router.push(`pay/${currentOrder._id}`);
  }

  return (
    <section className={styles["order"]}>
      <div className={styles["order__container"]}>
        <div className={styles["order__shoes-image-container"]}>
          <div className={styles["order__shoes-image-inner"]}>
            {currentOrder.orderImages.length > 0 && (
              <img
                className={styles["order__shoes-image"]}
                src={`${BASE_URL}${currentOrder.orderImages[0].path}`}
                alt={currentOrder.model}
                crossOrigin="anonymous"
                onClick={() => openPopup(0)}
              />
            )}
          </div>
        </div>
        <ul className={styles["order__shoes-image-collection"]}>
          {currentOrder.orderImages.length > 0 &&
            currentOrder.orderImages.slice(1).map((image, index) => {
              return (
                <li
                  key={image.name}
                  className={styles["order__shoes-image-collection-item"]}
                >
                  <img
                    src={`${BASE_URL}${image.path}`}
                    crossOrigin="anonymous"
                    onClick={() => openPopup(index + 1)}
                  />
                </li>
              );
            })}
        </ul>
        <h2 className={styles["order__shoes-title"]}>
          {currentOrder.brand} {currentOrder.model}
        </h2>
        <div className={styles["order__shoes-size-container"]}>
          <p className={styles["order__shoes-size"]}>
            Размер: {currentOrder.size}
          </p>
          <a
            className={styles["order__shoes-poizon-link"]}
            href={currentOrder.link}
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
        <h2 className={styles["order__title"]}>
          Итоговая сумма: {totalPrice} ₽
        </h2>
        {isBrowser && currentOrder.priceCNY !== "0" && (
          <table cellPadding={"5px"} className={styles["order__price-table"]}>
            <tbody>
              <tr>
                <td>Цена в CNY</td>
                <td>{parseInt(currentOrder.priceCNY)} ¥</td>
              </tr>
              <tr>
                <td>Курс обмена</td>
                <td>{parseInt(currentOrder.currentRate)} ₽</td>
              </tr>
              <tr>
                <td>Цена в RUB</td>
                <td>{Math.ceil(priceRub)} ₽</td>
              </tr>
              <tr>
                <td>Доставка по Китаю</td>
                <td>{parseInt(currentOrder.priceDeliveryChina)} ₽</td>
              </tr>
              <tr>
                <td>Доставка в РФ</td>
                <td>{parseInt(currentOrder.priceDeliveryRussia)} ₽</td>
              </tr>
              <tr>
                <td>Комиссия сервиса</td>
                <td>{parseInt(currentOrder.commission)} ₽</td>
              </tr>
              {currentOrder.promoCodePercent !== 0 && (
                <tr>
                  <td>Скидка по промо-коду</td>
                  <td>{currentOrder.promoCodePercent} ₽</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {currentOrder.deliveryMethod !== "" && (
          <>
            <div
              className={`${styles["order-divider"]} ${styles["order-divider_horizontal"]}`}
            ></div>
            <p className={styles["order-text"]}>
              <span className={styles["order__bold-span"]}>
                Способ доставки:
              </span>{" "}
              {currentOrder.deliveryMethod}
            </p>
            <p className={styles["order-text"]}>
              <span className={styles["order__bold-span"]}>Адрес:</span>{" "}
              {currentOrder.deliveryAddress}
            </p>
          </>
        )}
        <div
          className={`${styles["order-divider"]} ${styles["order-divider_horizontal"]}`}
        ></div>
        <h2 className={styles["order__title"]}>Отслеживание заказа</h2>
        <ul className={styles["order-timeline"]}>
          <li className={styles["order-timeline-item"]}>
            <div className={styles["order-timeline-item-tail"]}></div>
            <div
              className={`${styles["order-timeline-item-head"]} ${
                (currentOrder.status === "Проверка оплаты" ||
                  currentOrder.status === "Оплачен" ||
                  currentOrder.status === "Ожидает закупки" ||
                  currentOrder.status === "На закупке" ||
                  currentOrder.status === "Закуплен" ||
                  currentOrder.status === "На складе в Китае" ||
                  currentOrder.status === "Доставка в Москву" ||
                  currentOrder.status === "На складе в РФ" ||
                  currentOrder.status === "Доставляется" ||
                  currentOrder.status === "Завершён") &&
                styles["order-timeline-item-head-green"]
              }`}
            ></div>
            <div className={styles["order-timeline-item-content"]}>
              <div className={styles["order-typography"]}>Проверка оплаты</div>
              {currentOrder.payProofImages.length > 0 && (
                <a
                  className={styles["order-typography-screen-link"]}
                  href={`${BASE_URL}${currentOrder.payProofImages[0].path}`}
                  target="_blank"
                >
                  Скриншот оплаты
                </a>
              )}
            </div>
          </li>
          <li className={styles["order-timeline-item"]}>
            <div className={styles["order-timeline-item-tail"]}></div>
            <div
              className={`${styles["order-timeline-item-head"]} ${
                (currentOrder.status === "Оплачен" ||
                  currentOrder.status === "Ожидает закупки" ||
                  currentOrder.status === "На закупке" ||
                  currentOrder.status === "Закуплен" ||
                  currentOrder.status === "На складе в Китае" ||
                  currentOrder.status === "Доставка в Москву" ||
                  currentOrder.status === "На складе в РФ" ||
                  currentOrder.status === "Доставляется" ||
                  currentOrder.status === "Завершён") &&
                styles["order-timeline-item-head-green"]
              }`}
            ></div>
            <div className={styles["order-timeline-item-content"]}>
              <div className={styles["order-typography"]}>Оплачен</div>
            </div>
          </li>
          <li className={styles["order-timeline-item"]}>
            <div className={styles["order-timeline-item-tail"]}></div>
            <div
              className={`${styles["order-timeline-item-head"]} ${
                (currentOrder.status === "На закупке" ||
                  currentOrder.status === "Закуплен" ||
                  currentOrder.status === "На складе в Китае" ||
                  currentOrder.status === "Доставка в Москву" ||
                  currentOrder.status === "На складе в РФ" ||
                  currentOrder.status === "Доставляется" ||
                  currentOrder.status === "Завершён") &&
                styles["order-timeline-item-head-green"]
              }`}
            ></div>
            <div className={styles["order-timeline-item-content"]}>
              <div className={styles["order-typography"]}>На закупке</div>
            </div>
          </li>
          <li className={styles["order-timeline-item"]}>
            <div className={styles["order-timeline-item-tail"]}></div>
            <div
              className={`${styles["order-timeline-item-head"]} ${
                (currentOrder.status === "Закуплен" ||
                  currentOrder.status === "На складе в Китае" ||
                  currentOrder.status === "Доставка в Москву" ||
                  currentOrder.status === "На складе в РФ" ||
                  currentOrder.status === "Доставляется" ||
                  currentOrder.status === "Завершён") &&
                styles["order-timeline-item-head-green"]
              }`}
            ></div>
            <div className={styles["order-timeline-item-content"]}>
              <div className={styles["order-typography"]}>Закуплен</div>
              {currentOrder.buyProofImages.length > 0 &&
                currentOrder.buyProofImages.map((image, index) => {
                  return (
                    <a
                      key={image.name}
                      className={styles["order-typography-screen-link"]}
                      href={`${BASE_URL}${image.path}`}
                      target="_blank"
                    >
                      Чек закупки №{index + 1}
                    </a>
                  );
                })}
            </div>
          </li>
          <li className={styles["order-timeline-item"]}>
            <div className={styles["order-timeline-item-tail"]}></div>
            <div
              className={`${styles["order-timeline-item-head"]} ${
                (currentOrder.status === "На складе в Китае" ||
                  currentOrder.status === "Доставка в Москву" ||
                  currentOrder.status === "На складе в РФ" ||
                  currentOrder.status === "Доставляется" ||
                  currentOrder.status === "Завершён" ||
                  (Math.ceil(
                    new Date(currentOrder.inChinaStockAt).getTime() -
                      new Date(Date.now()).getTime()
                  ) /
                    1000 <
                    0 &&
                    currentOrder.inChinaStockAt !== null)) &&
                styles["order-timeline-item-head-green"]
              }`}
            ></div>
            <div className={styles["order-timeline-item-content"]}>
              <div className={styles["order-typography"]}>
                На складе в Китае
                {currentOrder.poizonCode !== "" && (
                  <p className={styles["order-typography-screen-text"]}>
                    Трек номер Poizon:{" "}
                    <span className={styles["order-span"]}>
                      {currentOrder.poizonCode}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </li>
          <li className={styles["order-timeline-item"]}>
            <div className={styles["order-timeline-item-tail"]}></div>
            <div
              className={`${styles["order-timeline-item-head"]} ${
                (currentOrder.status === "На складе в РФ" ||
                  currentOrder.status === "Доставляется" ||
                  currentOrder.status === "Завершён" ||
                  (Math.ceil(
                    new Date(currentOrder.inChinaStockAt).getTime() -
                      new Date(Date.now()).getTime()
                  ) /
                    1000 <
                    -43200 &&
                    currentOrder.inChinaStockAt !== null)) &&
                styles["order-timeline-item-head-green"]
              }`}
            ></div>
            <div className={styles["order-timeline-item-content"]}>
              <div className={styles["order-typography"]}>
                Доставка в Москву
              </div>
            </div>
          </li>
          <li className={styles["order-timeline-item"]}>
            <div className={styles["order-timeline-item-tail"]}></div>
            <div
              className={`${styles["order-timeline-item-head"]} ${
                (currentOrder.status === "На складе в РФ" ||
                  currentOrder.status === "Доставляется" ||
                  currentOrder.status === "Завершён") &&
                styles["order-timeline-item-head-green"]
              }`}
            ></div>
            <div className={styles["order-timeline-item-content"]}>
              <div className={styles["order-typography"]}>На складе в РФ</div>
            </div>
          </li>
          <li className={styles["order-timeline-item"]}>
            <div className={styles["order-timeline-item-tail"]}></div>
            <div
              className={`${styles["order-timeline-item-head"]} ${
                (currentOrder.status === "Доставляется" ||
                  currentOrder.status === "Завершён") &&
                styles["order-timeline-item-head-green"]
              }`}
            ></div>
            <div className={styles["order-timeline-item-content"]}>
              <div className={styles["order-typography"]}>Доставляется</div>
              {currentOrder.deliveryCode !== "" && (
                <div className={styles["order-typography"]}>
                  Трек-номер CDEK:
                  <span className={styles["order-span"]}>
                    {currentOrder.deliveryCode}
                  </span>
                </div>
              )}
            </div>
          </li>
          <li className={styles["order-timeline-item"]}>
            <div
              className={`${styles["order-timeline-item-head"]} ${
                currentOrder.status === "Завершён" &&
                styles["order-timeline-item-head-green"]
              }`}
            ></div>
            <div className={styles["order-timeline-item-content"]}>
              <div className={styles["order-typography"]}>Завершён</div>
            </div>
          </li>
        </ul>
        {currentOrder.status === "Черновик" && (
          <button
            className={styles["order__pay-button"]}
            onClick={handleTimeLeft}
          >
            {isBrowser && (
              <Timer
                createdAt={currentOrder.createdAt}
                dedline={currentOrder.overudeAfter}
                timeLeft={timeLeft}
                setTimeLeft={setTimeLeft}
              />
            )}
            <span className={styles["order__pay-button-span"]}>Оплатить</span>
            <span>{totalPrice} ₽</span>
          </button>
        )}
      </div>
      <Carousel
        isImagePopupOpen={isImagePopupOpen}
        images={currentOrder.orderImages}
        currentImageIndex={currentImageIndex}
        closePopup={closePopup}
        nextImage={nextImage}
        prevImage={prevImage}
      />
    </section>
  );
};

export default Order;
