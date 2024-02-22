import styles from "./index.module.css";

import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import leftTopBackground from "../../assets/left_top_background.png";
import rightBottomBackground from "../../assets/right_bottom_background.png";
import star from "./assets/star.png";
import { useRouteContext } from "../../hooks/useRouteContext";
import { useTimeout } from "../../hooks/useTimeout";
import { useAlertOnUnload } from "../../hooks/useAlertOnUnload";

import sweetTartInterrogationMark from "./sweet-tarts/interrogation.webp";
import sweetTartbottomPartPackage from "./sweet-tarts/packageBottom.webp";
import sweetTarttopPartPackage from "./sweet-tarts/packageTop.webp";
import sweetTartCandy from "./sweet-tarts/candy.webp";
import sweetTartbottom from "./sweet-tarts/bottom.webp";

import trolliInterrogationMark from "./trolli/interrogation.webp";
import trollibottomPartPackage from "./trolli/packageBottom.webp";
import trollitopPartPackage from "./trolli/packageTop.webp";
import trolliCandy1 from "./trolli/candy1.webp";
import trolliCandy2 from "./trolli/candy2.webp";
import trolliCandy3 from "./trolli/candy3.webp";
import trollibottom from "./trolli/bottom.webp";

import nerdsInterrogationMark from "./nerds/interrogation.webp";
import nerdsbottomPartPackage from "./nerds/packageBottom.webp";
import nerdstopPartPackage from "./nerds/packageTop.webp";
import nerdsCandy1 from "./nerds/candy1.webp";
import nerdsCandy2 from "./nerds/candy2.webp";
import nerdsbottom from "./nerds/bottom.webp";

import gummyBearInterrogationMark from "./gummy-bear/interrogation.webp";
import gummyBearbottomPartPackage from "./gummy-bear/packageBottom.webp";
import gummyBeartopPartPackage from "./gummy-bear/packageTop.webp";
import gummyBearCandy1 from "./gummy-bear/candy1.webp";
import gummyBearCandy2 from "./gummy-bear/candy2.webp";
import gummyBearCandy3 from "./gummy-bear/candy3.webp";
import gummyBearbottom from "./gummy-bear/bottom.webp";

import laffyTaffyInterrogationMark from "./laffy-taffy/interrogation.webp";
import laffyTaffybottomPartPackage from "./laffy-taffy/packageBottom.webp";
import laffyTaffytopPartPackage from "./laffy-taffy/packageTop.webp";
import laffyTaffyCandy1 from "./laffy-taffy/candy1.webp";
import laffyTaffyCandy2 from "./laffy-taffy/candy2.webp";
import laffyTaffybottom from "./laffy-taffy/bottom.webp";

const candies = {
  st: {
    packageBottomClassName: styles["package-bottom-sweet-tarts"],
    packageTopClassName: styles["package-top-sweet-tarts"],
    bottomClassName: styles["bottom-sweet-tarts"],
    packageBottom: sweetTartbottomPartPackage,
    packageTop: sweetTarttopPartPackage,
    candies: [sweetTartCandy],
    interrogationMark: sweetTartInterrogationMark,
    bottom: sweetTartbottom,
    candySizes: {
      width: 15,
      height: 40,
    },
  },
  tl: {
    packageBottomClassName: styles["package-bottom-trolli"],
    packageTopClassName: styles["package-top-trolli"],
    bottomClassName: styles["bottom-top-trolli"],
    packageBottom: trollibottomPartPackage,
    packageTop: trollitopPartPackage,
    candies: [trolliCandy1, trolliCandy2, trolliCandy3],
    interrogationMark: trolliInterrogationMark,
    bottom: trollibottom,
    candySizes: {
      width: 28,
      height: 48.3,
    },
  },
  nd: {
    packageBottomClassName: styles["package-bottom-nerds"],
    packageTopClassName: styles["package-top-nerds"],
    bottomClassName: styles["bottom-nerds"],
    packageBottom: nerdsbottomPartPackage,
    packageTop: nerdstopPartPackage,
    candies: [nerdsCandy1, nerdsCandy2],
    interrogationMark: nerdsInterrogationMark,
    bottom: nerdsbottom,
    candySizes: {
      width: 28,
      height: 34,
    },
  },
  gb: {
    packageBottomClassName: styles["package-bottom-gummy-bear"],
    packageTopClassName: styles["package-top-gummy-bear"],
    bottomClassName: styles["bottom-gummy-bear"],
    packageBottom: gummyBearbottomPartPackage,
    packageTop: gummyBeartopPartPackage,
    candies: [gummyBearCandy1, gummyBearCandy2, gummyBearCandy3],
    interrogationMark: gummyBearInterrogationMark,
    bottom: gummyBearbottom,
    candySizes: {
      width: 28,
      height: 36,
    },
  },
  lt: {
    packageBottomClassName: styles["package-bottom-laffy-taffy"],
    packageTopClassName: styles["package-top-laffy-taffy"],
    bottomClassName: styles["bottom-laffy-taffy"],
    packageBottom: laffyTaffybottomPartPackage,
    packageTop: laffyTaffytopPartPackage,
    candies: [laffyTaffyCandy1, laffyTaffyCandy2],
    interrogationMark: laffyTaffyInterrogationMark,
    bottom: laffyTaffybottom,
    candySizes: {
      width: 32,
      height: 18,
    },
  },
};

const useDelayedFlag = (delay: number) => {
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setFlag(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);
  return flag;
};

const RefConfetti = (props: ComponentProps<typeof Confetti>) => {
  const { width, height } = useWindowSize();
  const confettiRef = useRef<HTMLCanvasElement>(null);
  return (
    <Confetti
      ref={confettiRef}
      recycle={false}
      width={width}
      height={height}
      friction={1.005}
      colors={["#b0449b", "#ef276f", "#258a75", "#ffc60b", "#f57d2f"]}
      gravity={0.08}
      {...props}
    />
  );
};

const initialConfettiWidth = 100;
const finalConfettiSize = 120;

const useElementSize = (ref: React.RefObject<HTMLDivElement>) => {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    if (ref.current) {
      setSize({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
    }
  }, [ref]);

  return size;
};

export const Animation = ({
  candy = "st",
  state = "lose",
}: {
  candy: keyof typeof candies;
  state?: "win" | "lose" | "already-awarded";
}) => {
  const drawCandy = useCallback(
    function (this: { index?: number }, ctx: CanvasRenderingContext2D) {
      const candyObject = candies[candy ?? "st"];
      const candyImages = candyObject.candies;
      const index =
        this.index !== undefined
          ? this.index
          : Math.floor(Math.random() * candyImages.length);
      this.index = index;
      const candyImage = candyImages[index];
      const base_image = new Image();
      base_image.src = candyImage;
      const { width, height } = candyObject?.candySizes ?? {
        width: 15,
        height: 40,
      };
      ctx.drawImage(base_image, 0, 0, width, height);
      ctx.closePath();
    },
    [candy]
  );

  const startPackageAnimation = useDelayedFlag(2000);
  const finalAnimation = useDelayedFlag(5500);
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(ref);
  useAlertOnUnload();
  const { setPath } = useRouteContext();

  useTimeout(() => {
    if (state === "win") {
      setPath("/winner");
    } else if (state === "lose") {
      setPath("/not-winner");
    } else if (state === "already-awarded") {
      setPath("/already-awarded");
    }
  }, 10000);

  const INITIAL_CONFETTI_PROPS = useMemo(
    () => ({
      run: startPackageAnimation && state === "win",
      numberOfPieces: 200,
      tweenDuration: 1000,
      confettiSource: {
        w: initialConfettiWidth,
        h: 1,
        x: width / 2 - initialConfettiWidth / 2,
        y: height * 0.5,
      },
    }),
    [height, startPackageAnimation, state, width]
  );

  const FINAL_CONFETTI_PROPS = useMemo(
    () => ({
      run: finalAnimation && state === "win",
      initialVelocityY: { min: -10, max: 7 },
      initialVelocityX: { min: -4, max: 4 },
      confettiSource: {
        w: finalConfettiSize,
        h: finalConfettiSize,
        x: width / 2 - finalConfettiSize / 2,
        y: height * 0.3 - finalConfettiSize / 2,
      },
    }),
    [finalAnimation, height, state, width]
  );

  return (
    <div className={styles.container} ref={ref}>
      <img className={styles.star} src={star} alt="" />
      <img
        className={styles["right-bottom-background"]}
        src={rightBottomBackground}
        alt=""
      />
      <img
        className={styles["left-top-background"]}
        src={leftTopBackground}
        alt=""
      />
      {state !== "win" && (
        <div
          className={`${styles["lose-bottom"]} ${styles["background-lose-bottom"]} ${candies[candy].bottomClassName}`}
          style={{
            backgroundImage: `url(${candies[candy].bottom})`,
          }}
        />
      )}
      <img
        className={styles["interrogation-mark"]}
        src={candies[candy].interrogationMark}
        alt=""
      />
      <img
        className={`${styles["bottom-part-package"]} ${candies[candy].packageBottomClassName}`}
        src={candies[candy].packageBottom}
        alt=""
      />
      <img
        className={`${styles["top-part-package"]} ${candies[candy].packageTopClassName}`}
        src={candies[candy].packageTop}
        alt=""
      />
      <div className={styles["initial-message"]}>
        <p>
          let's see
          <br />
          if you're a
          <br />
          <span>winner!</span>
        </p>
      </div>
      <RefConfetti drawShape={drawCandy} {...INITIAL_CONFETTI_PROPS} />
      <RefConfetti {...INITIAL_CONFETTI_PROPS} />
      <RefConfetti
        drawShape={drawCandy}
        numberOfPieces={400}
        tweenDuration={1400}
        {...FINAL_CONFETTI_PROPS}
      />
      <RefConfetti
        numberOfPieces={300}
        tweenDuration={1000}
        {...FINAL_CONFETTI_PROPS}
      />
      {state !== "win" && (
        <div
          className={`${styles["lose-bottom"]} ${candies[candy].bottomClassName}`}
          style={{
            backgroundImage: `url(${candies[candy].bottom})`,
          }}
        />
      )}
      {state === "win" && (
        <div className={styles["win-message"]}>
          <p>
            <span>sweet</span>
            <br />
            <span>sweet</span>
            <br />
            <span>victory</span>
          </p>
        </div>
      )}
      {(state === "lose" || state === "already-awarded") && (
        <div className={styles["lose-message"]}>
          <p>
            <span>SORRY!</span>
            <br />
            {state === "already-awarded" ? (
              <span>
                PRIZE ALREADY
                <br />
                AWARDED
              </span>
            ) : (
              <span>
                YOU DID NOT WIN
                <br />
                TODAY’s PRIZE
              </span>
            )}
            <br />
            <span>
              (But hey, at least you
              <br />
              got some candy!)
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
