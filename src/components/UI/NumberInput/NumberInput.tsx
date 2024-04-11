import { FC } from "react";
import styles from "./NumberInput.module.css";

interface IInputProps {
  label: string;
  name: string;
  placeholder?: string;
  value: number;
  handleChange?: (e: React.SyntheticEvent) => void;
  required?: boolean;
}

const NumberInput: FC<IInputProps> = ({
  label,
  name,
  placeholder,
  value,
  handleChange,
  required,
}) => {
  return (
    <div className={styles["input__container"]}>
      <label className={styles["input__label"]}>
        {label}
        {required && <span className={styles["red-star"]}>*</span>}
      </label>
      <input
        className={styles["input__item"]}
        type="number"
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        required={required}
      />
    </div>
  );
};

export default NumberInput;
