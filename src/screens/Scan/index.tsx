import Webcam from "react-webcam";
import { Title } from "../../components/Title";
import styles from "./index.module.css";
import { useCallback, useEffect, useRef } from "react";
import logos from "../../assets/logos.png";
import { useAlertOnUnload } from "../../hooks/useAlertOnUnload";
import { useAxios } from "../../axios";
import { useFormDataContext } from "../../hooks/useFormDataContext";
import { PrizeResponse, usePrizeResponse } from "../../hooks/usePrizeResponse";

const resizeImage = (src: string, width = 600) => {
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const elem = document.createElement("canvas");
      const scaleFactor = width / img.width;
      elem.width = width;
      elem.height = img.height * scaleFactor;
      const ctx = elem.getContext("2d");
      ctx?.drawImage(img, 0, 0, elem.width, elem.height);
      const data = ctx?.canvas.toDataURL("image/jpeg", 0.75);
      resolve(data || "");
    };
    img.src = src;
  });
};

const srcToBlob = async (src: string) => {
  const res = await fetch(src);
  const blob = await res.blob();
  return blob;
};

export const Scan = () => {
  const mediaRef = useRef<Webcam>(null);
  const interval = useRef<number | null>(null);
  const initiated = useRef(false);

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
      const imageSrc = mediaRef.current?.getScreenshot();
      if (imageSrc) {
        const form = new FormData();
        const resizedImage = await resizeImage(imageSrc);
        const blob = await srcToBlob(resizedImage);
        form.append("image", blob, "image.jpeg");
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
      } else {
        console.error("Image not available");
      }
    } catch (e) {
      console.error(e);
    }
  }, [formData, setPrizeResponse, submit]);

  const startInterval = useCallback(() => {
    async function intervalFunction() {
      await capture();
      interval.current = setTimeout(intervalFunction, 250);
    }

    intervalFunction();
  }, [capture]);

  useEffect(() => {
    if (!initiated.current) {
      initiated.current = true;
      setTimeout(startInterval, 1500);

      return () => {
        interval.current && clearTimeout(interval.current);
      };
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
