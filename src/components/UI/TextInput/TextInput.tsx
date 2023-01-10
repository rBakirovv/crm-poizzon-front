import { FC } from "react";
import styles from "./TextInput.module.css";

interface IInputProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  handleChange: (e: React.SyntheticEvent) => void;
  required?: boolean;
}

const TextInput: FC<IInputProps> = ({
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
        {label}<span className={styles["red-star"]}>*</span>
      </label>
      <input
        className={styles["input__item"]}
        type="text"
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        required={required}
      />
    </div>
  );
};

export default TextInput;
