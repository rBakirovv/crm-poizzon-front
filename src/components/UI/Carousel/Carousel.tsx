import React, { FC, useEffect, useRef } from "react";
import { IOrderImages } from "../../../types/interfaces";
import { BASE_URL } from "../../../utils/constants";
import styles from "./Carousel.module.css";

interface ICarouselProps {
  isImagePopupOpen: boolean;
  images: Array<IOrderImages>;
  currentImageIndex: number;
  closePopup: () => void;
  nextImage: () => void;
  prevImage: () => void;
}

const Carousel: FC<ICarouselProps> = ({
  isImagePopupOpen,
  images,
  currentImageIndex,
  closePopup,
  nextImage,
  prevImage,
}) => {
  const ref = useRef(null);

  function closeSlider(e: MouseEvent) {
    if (e && e.target === ref.current) {
      closePopup();
    }
  }

  useEffect(() => {
    document.addEventListener("click", closeSlider);
    return () => document.removeEventListener("click", closeSlider);
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles["carousel"]} ${
        isImagePopupOpen && styles["carousel_active"]
      }`}
    >
      <div className={styles["carousel__nav"]}>
        <button className={styles["carousel__nav-button"]} onClick={prevImage}>
          {"◀"}
        </button>
        {currentImageIndex + 1} / {images.length}
        <button className={styles["carousel__nav-button"]} onClick={nextImage}>
          {"◀"}
        </button>
        <button className={styles["carousel__close"]} onClick={closePopup}>
          ×
        </button>
      </div>
      <div className={styles["carousel__container"]}>
        {images.map((image, index) => {
          return (
            currentImageIndex === index && (
              <img
                key={image.name}
                className={styles["carousel__image"]}
                crossOrigin="anonymous"
                src={`${BASE_URL}${image.path}`}
                alt=""
              />
            )
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
