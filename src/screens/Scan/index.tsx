import Webcam from "react-webcam";
import { Title } from "../../components/Title";
import styles from "./index.module.css";
import { useCallback, useEffect, useRef } from "react";
import logos from "../../assets/logos.png";
import { useAlertOnUnload } from "../../hooks/useAlertOnUnload";
import { useAxios } from "../../axios";
import { useFormDataContext } from "../../hooks/useFormDataContext";
import { PrizeResponse, usePrizeResponse } from "../../hooks/usePrizeResponse";
import { useRouteContext } from "../../hooks/useRouteContext";

declare global {
  interface Window {
    tmImage: any;
  }
}

export const Scan = () => {
  const { setPath } = useRouteContext();
  const mediaRef = useRef<Webcam>(null);
  const initiated = useRef(false);
  const intervalId = useRef(0);
  const delayId = useRef(0);
  const timeLimitId = useRef(0);
  const candy = useRef("");
  const URL = "https://teachablemachine.withgoogle.com/models/iWdPzKpco/";
  const model = useRef<any>(null);
  const maxPredictions = useRef(0);

  useAlertOnUnload();

  const [, submit] = useAxios<PrizeResponse>(
    {
      url: "/image_recognition/award_prize",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
    { manual: true }
  );

  const { formData } = useFormDataContext();

  const setPrizeResponse = usePrizeResponse();

  const capture = useCallback(async () => {
    const processScan = async () => {
      let labelName = "";

      switch (candy.current) {
        case "Black Forest":
          labelName = "black-forest";
          break;
        case "Laffy Taffy":
          labelName = "laffy-taffy";
          break;
        case "Nerds":
          labelName = "nerds";
          break;
        case "Sweetarts":
          labelName = "sweet-tarts";
          break;
        case "Trolli":
          labelName = "trolli";
          break;
        default:
          break;
      }

      const form = new FormData();
      form.append("label_name", labelName);
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
      const { data } = await submit({
        data: form,
      });
      const responseData = data;
      setPrizeResponse(responseData, {
        successCallback: () => {
          clearTimeout(intervalId.current);
          clearTimeout(timeLimitId.current);
        },
      });
    };

    try {
      const imageSrc = mediaRef.current?.getCanvas();

      if (imageSrc) {
        const prediction = await model.current.predict(imageSrc);

        for (let i = 0; i < maxPredictions.current; i++) {
          const className = prediction[i].className;
          const probability = prediction[i].probability.toFixed(2);

          if (
            !candy.current &&
            className !== "No Candy" &&
            probability >= 0.9
          ) {
            candy.current = className;
            delayId.current = setTimeout(processScan, 2000);
          }

          if (className === candy.current && probability < 0.9) {
            candy.current = "";
            clearTimeout(delayId.current);
          }
        }
      } else {
        console.error("Image not available");
      }
    } catch (e) {
      console.error(e);
    }
  }, [formData, setPrizeResponse, submit]);

  const startInterval = useCallback(() => {
    const intervalFunction = async () => {
      await capture();
      intervalId.current = setTimeout(intervalFunction, 250);
    };

    const resetScanner = () => {
      clearTimeout(intervalId.current);
      setPath("/instructions");
    };

    intervalFunction();
    timeLimitId.current = setTimeout(resetScanner, 15000);
      }, [capture, setPath]);

  useEffect(() => {
    const init = async () => {
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      model.current = await window.tmImage.load(modelURL, metadataURL);
      maxPredictions.current = model.current.getTotalClasses();

      initiated.current = true;
      setTimeout(startInterval, 1500);
    };

    if (!initiated.current) {
      init();
    }
  }, [startInterval]);

  return (
    <div className={styles.container}>
      <Webcam
        ref={mediaRef}
        audio={false}
        screenshotFormat="image/jpeg"
        imageSmoothing={false}
        disablePictureInPicture
        className={styles.video}
        videoConstraints={{
          facingMode: "environment",
        }}
      />
      <div>
        <Title>Center the logo on your screen</Title>
      </div>
      <div className={styles["focus-area"]}>
        <span />
        <span />
        <span />
        <span />
      </div>
      <img className={styles.logos} src={logos} alt="candy logo" />
    </div>
  );
};
