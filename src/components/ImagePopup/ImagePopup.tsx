import { FC, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./ImagePopup.module.css";

interface IImagePopupProps {
  currentImage: string;
  isImagePopupOpen: boolean;
  closePopup: () => void;
}

const ImagePopup: FC<IImagePopupProps> = ({ currentImage, isImagePopupOpen, closePopup }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  });

  const imagePopupElement = (
    <section
      onClick={closePopup}
      className={`${styles["image-popup"]} ${
        isImagePopupOpen && styles["image-popup_visible"]
      }`}
    >
      <img src={currentImage} className={styles["image-popup__main-image"]} />
    </section>
  );

  if (isBrowser && document.getElementById("image-popup")) {
    return ReactDOM.createPortal(
      imagePopupElement,
      document.getElementById("image-popup")!
    );
  } else {
    return null;
  }
}

export default ImagePopup;
