import Webcam from "react-webcam";
import { Title } from "../../components/Title";
import styles from "./index.module.css";
import { useCallback, useEffect, useRef } from "react";
import logos from "../../assets/logos.png";
import { useAlertOnUnload } from "../../hooks/useAlertOnUnload";
import { useAxios } from "../../axios";
import { useFormDataContext } from "../../hooks/useFormDataContext";
import { PrizeResponse, usePrizeResponse } from "../../hooks/usePrizeResponse";

declare global {
  interface Window {
    tmImage: any;
  }
}

export const Scan = () => {
  const mediaRef = useRef<Webcam>(null);
  const interval = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initiated = useRef(false);
  const successfulScan = useRef(false);
  const URL = "https://teachablemachine.withgoogle.com/models/YdvUHcLXP/";
  const model = useRef<any>(null);
  const maxPredictions = useRef<number>(0);

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
    try {
      const imageSrc = mediaRef.current?.getCanvas();
      if (imageSrc) {
        const prediction = await model.current.predict(imageSrc);

        for (let i = 0; i < maxPredictions.current; i++) {
          const className = prediction[i].className;
          const probability = prediction[i].probability.toFixed(2);

          if (className !== "No Candy" && probability >= 0.9) {
            let labelName = "";

            successfulScan.current = true;

            switch (className) {
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
                labelName = "sweetarts";
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
                interval.current && clearTimeout(interval.current);
              },
            });
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
    async function intervalFunction() {
      if (!successfulScan.current) {
        await capture();
        interval.current = setTimeout(intervalFunction, 250);
      }
    }

    intervalFunction();
  }, [capture]);

  useEffect(() => {
    async function init() {
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      model.current = await window.tmImage.load(modelURL, metadataURL);
      maxPredictions.current = model.current.getTotalClasses();

      initiated.current = true;
      setTimeout(startInterval, 1500);
      return () => {
        interval.current && clearTimeout(interval.current);
      };
    }

    if (!initiated.current) {
      init();
    }
  }, [startInterval, capture]);

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
