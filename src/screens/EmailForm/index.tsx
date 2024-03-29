import { useRef } from "react";
import { Button } from "../../components/Button";
import { Checkbox } from "../../components/Checkbox";
import { Text } from "../../components/Text";
import { TextInput } from "../../components/TextInput";
import { Title } from "../../components/Title";
import styles from "./index.module.css";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouteContext } from "../../hooks/useRouteContext";
import { Layout } from "../../components/Layout";
import { PossibleFlows } from "../../contexts/RouteContext/types";
import { useAxios } from "../../axios";
import { useFormDataContext } from "../../hooks/useFormDataContext";
import { PrizeResponse, usePrizeResponse } from "../../hooks/usePrizeResponse";
import { Clock } from "../../components/Clock";

const schema = z.object({
  email: z.string().email(),
  confirmation: z.boolean(),
});
type SchemaType = z.infer<typeof schema>;

export const EmailForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      confirmation: true,
    },
  });

  const [{ loading }] = useAxios(
    {
      url: "/api/entry",
      method: "POST",
    },
    { manual: true }
  );

  const { flow } = useRouteContext();
  const { spreadFormData } = useFormDataContext();
  const errorMessage = useRef("");

  const [, submitOnMobile] = useAxios<PrizeResponse>(
    {
      url: "/check_if_user_entered_today",
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
    },
    { manual: true }
  );

  const [, submitOnDesktop] = useAxios<PrizeResponse>(
    {
      url: "/amoe_prize_award",
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
    },
    { manual: true }
  );

  const setPrizeResponse = usePrizeResponse();

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    const email = data.email.toLowerCase();
    spreadFormData({ email, confirmation: data.confirmation });

    try {
      const form = new FormData();
      let responseData;

      form.append("email", email);

      if (flow === PossibleFlows.MOBILE) {
        const response = await submitOnMobile({ data: form });
        responseData = response.data;
      } else {
        const labelArray = [
          "black-forest",
          "laffy-taffy",
          "nerds",
          "sweet-tarts",
          "trolli",
        ];
        const randomIndex = Math.floor(Math.random() * labelArray.length);
        const labelName = labelArray[randomIndex];

        form.append("label_name", labelName);
        const response = await submitOnDesktop({ data: form });
        responseData = response.data;
      }

      setPrizeResponse(responseData, {
        successCallback: (message) => (errorMessage.current = message),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout
      footerProps={{
        showFreeMethodEntryMessage: flow === "MOBILE",
      }}
    >
      <div className={styles.container}>
        <Title>ready, set, go</Title>
        <Text>
          Enter your email below to get started and enter for a chance to WIN!
        </Text>
        <Clock />
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            center
            label="Email address"
            {...register("email")}
            type="email"
            required
            error={errors.email?.message}
          />
          <Checkbox
            center
            {...register("confirmation")}
            error={errors.confirmation?.message}
          >
            Yes, I consent to Ferrara Candy Company and its affiliates using my
            Personal Information to provide me with product and marketing
            information by email, and other electronic means, and I have read
            and agree to the{" "}
            <a target="_blank" href="https://www.ferrarausa.com/terms-of-use">
              Terms of Use
            </a>{" "}
            and{" "}
            <a target="_blank" href="https://www.ferrarausa.com/privacy-policy">
              Privacy Policy
            </a>
            , which describe how the information I provide may be used.
          </Checkbox>
          <Button disabled={loading} type="submit">
            submit
          </Button>
          <div className={styles.message}>{errorMessage.current}</div>
        </form>
      </div>
    </Layout>
  );
};
