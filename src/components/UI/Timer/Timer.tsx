import { FC, useEffect } from "react";

interface ITimerProps {
  createdAt: Date;
  dedline: Date;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
}

const Timer: FC<ITimerProps> = ({
  createdAt,
  dedline,
  timeLeft,
  setTimeLeft,
}) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((timeLeft: number) => (timeLeft >= 1 ? timeLeft - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timeLeft]);

  const hours = Math.floor(timeLeft / 60 / 60);
  const minutes = Math.floor(timeLeft / 60) - hours * 60;
  const seconds = timeLeft % 60;

  return (
    <>
      {timeLeft > 0 && (
        <span>
          {hours <= 9 && "0"}
          {hours}:{minutes <= 9 && "0"}
          {minutes}:{seconds <= 9 && "0"}
          {seconds}
        </span>
      )}

      {timeLeft <= 0 && (
        <span>
          {"0"}
          {"0"}:{"0"}
          {"0"}:{"0"}
          {"0"}
        </span>
      )}
    </>
  );
};

export default Timer;
