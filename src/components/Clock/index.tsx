import { useEffect, useRef } from "react";
import Countdown from "react-countdown";
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

export const Clock = () => {
  const renderer = ({
    hours,
    minutes,
    seconds,
  }: {
    hours: number;
    minutes: number;
    seconds: number;
  }) => {
    return (
      <div className={styles.container}>
        <Digits digits={`${hours === 1 ? "6" : "0"}${minutes}`.slice(-2)} />
        <div className={styles.separator}>:</div>
        <Digits digits={`0${seconds}`.slice(-2)} />
      </div>
    );
  };

  return (
    <div>
      <Countdown date={Date.now() + 60000 * 1} renderer={renderer} />
      <div className={styles.labels}>
        <span>MINS</span>
        <span>SECS</span>
      </div>
    </div>
  );
};
