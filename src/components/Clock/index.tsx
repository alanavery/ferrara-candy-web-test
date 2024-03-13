import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";

const usePreviousValue = (value: string) => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const Digit = ({ digit }: { digit: string }) => {
  const prevDigit = usePreviousValue(digit);
  return (
    <div className={styles.digit} key={digit}>
      {prevDigit !== digit && (
        <>
          <div
            className={`${styles["number-top-part"]} ${styles["old-number-top-part"]}`}
          >
            <span>{prevDigit}</span>
          </div>
          <div
            className={`${styles["number-bottom-part"]} ${styles["old-number-bottom-part"]}`}
          >
            <span>{prevDigit}</span>
          </div>
        </>
      )}
      <div
        className={`${styles["number-top-part"]} ${styles.newNumberTopPart}`}
      >
        <span>{digit}</span>
      </div>
      <div
        className={`${styles["number-bottom-part"]} ${styles["new-number-bottom-part"]}`}
      >
        <span>{digit}</span>
      </div>
    </div>
  );
};

export const Digits = ({ digits }: { digits: string }) => {
  const digitsString = digits.split("");
  return (
    <div className={styles["digits-container"]}>
      <div>
        <div>
          {digitsString.map((digit, index) => (
            <Digit digit={digit} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const Clock = ({
  minutes = 60,
  onEnd,
}: {
  minutes?: number;
  onEnd?: () => void;
}) => {
  const [time, setTime] = useState({
    minutes,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((currentTime) => {
        let minutes = currentTime.minutes;
        let seconds = currentTime.seconds - 1;

        if (seconds < 0) {
          minutes--;
          seconds = 59;
        }

        if (minutes < 0) {
          minutes = 0;
          seconds = 0;
          clearInterval(interval);
          if (onEnd) {
            onEnd();
          }
        }

        return { minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval); // Clear interval on unmount
  }, [onEnd]);

  const formatNumber = (number: number) => `0${number}`.slice(-2);

  return (
    <div>
      <div className={styles.container}>
        <Digits digits={formatNumber(time.minutes)} />
        <div className={styles.separator}>:</div>
        <Digits digits={formatNumber(time.seconds)} />
      </div>
      <div className={styles.labels}>
        <span>MINS</span>
        <span>SECS</span>
      </div>
    </div>
  );
};
