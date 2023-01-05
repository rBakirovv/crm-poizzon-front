import { useEffect, useState } from "react";

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(1 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((timeLeft) => (timeLeft >= 1 ? timeLeft - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timeLeft]);

  const hours = Math.floor(timeLeft / 60 / 60);
  const minutes = Math.floor(timeLeft / 60) - hours * 60;
  const seconds = timeLeft % 60;

  return (
    <span>
      {hours <= 9 && "0"}
      {hours}:{minutes <= 9 && "0"}
      {minutes}:{seconds <= 9 && "0"}
      {seconds}
    </span>
  );
}
