import { useCallback } from "react";
import { useRouteContext } from "./useRouteContext";
import { PossibleFlows } from "../contexts/RouteContext/types";
import { CandyMap, PossibleCandies } from "../config/candies";

export enum PossibleResponses {
  WIN = "Prize given",
  LOSE = "No prize",
  NOT_FOUND = "No custom labels detected",
  NOT_CUSTOM_LABEL = "Product not found, please try again",
  TRY_AGAIN_TOMORROW = "Try again tomorrow",
  EMAIL_NOT_FOUND = "Email not found",
  ALREADY_ENTERED = "Already entered today",
  ALREADY_WON = "Won less than a week ago",
  READY = "Ready to enter",
}

export type PrizeResponse = {
  response: PossibleResponses;
  success: boolean;
  candy_name: keyof typeof CandyMap;
};

export const usePrizeResponse = () => {
  const { setPath, flow } = useRouteContext();
  const setPrizeResponse = useCallback(
    (
      data: PrizeResponse,
      options?: {
        successCallback?: (message: string) => void;
        failCallback?: () => void;
      }
    ) => {
      const { successCallback, failCallback } = options ?? {};
      const { response, candy_name } = data;

      if (
        [
          PossibleResponses.WIN,
          PossibleResponses.LOSE,
          PossibleResponses.TRY_AGAIN_TOMORROW,
        ].includes(response)
      ) {
        const candyKeys = Object.keys(CandyMap);
        const randomIndex = Math.floor(Math.random() * candyKeys.length);
        const randomCandyKey = candyKeys[randomIndex] ?? "sweet-tarts";
        const candy: PossibleCandies =
          CandyMap[candy_name ?? randomCandyKey] ?? "st";

        if (response === PossibleResponses.WIN) {
          successCallback?.("");
          setPath(`/animation/win/${candy}`);
        } else if (response === PossibleResponses.LOSE) {
          successCallback?.("");
          setPath(`/animation/lose/${candy}`);
        } else {
          successCallback?.("");
          setPath(`/animation/already-awarded/${candy}`);
        }
      } else if (response === PossibleResponses.EMAIL_NOT_FOUND) {
        successCallback?.("");
        setPath(flow === PossibleFlows.AMOE ? "/amoe" : "/email-form");
      } else if (response === PossibleResponses.ALREADY_ENTERED) {
        successCallback?.(
          "Thank you for submitting your email, this email has already been submitted today. Please try again tomorrow."
        );
      } else if (response === PossibleResponses.ALREADY_WON) {
        successCallback?.(
          "Thank you for participating, it looks like you have already won this week. Please try again in one week."
        );
      } else if (response === PossibleResponses.READY) {
        successCallback?.("");
        setPath("/instructions");
      } else {
        failCallback?.();
      }
    },
    [flow, setPath]
  );

  return setPrizeResponse;
};
