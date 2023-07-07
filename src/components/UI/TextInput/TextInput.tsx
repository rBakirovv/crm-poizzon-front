import { FC } from "react";
import styles from "./TextInput.module.css";

interface IInputProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  handleChange?: (e: React.SyntheticEvent) => void;
  handleClick?: () => void;
  required: boolean;
  readonly?: boolean; 
  autoFocus?: boolean;
}

const TextInput: FC<IInputProps> = ({
  label,
  name,
  placeholder,
  value,
  handleChange,
  handleClick,
  required,
  readonly,
  autoFocus,
}) => {
  return (
    <div className={styles["input__container"]}>
      <label className={styles["input__label"]}>
        {label}
        {required && <span className={styles["red-star"]}>*</span>}
      </label>
      <input
        className={`${styles["input__item"]} ${readonly && styles["input__item_disabled"]}`}
        type="text"
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        required={required}
        readOnly={readonly}
        onClick={handleClick}
        autoFocus={autoFocus}
      />
    </div>
  );
};

export default TextInput;
