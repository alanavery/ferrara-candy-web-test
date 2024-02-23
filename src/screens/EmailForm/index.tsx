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

const schema = z.object({
  email: z.string().email(),
  confirmation: z.boolean().refine((val) => !!val, {
    message: "You must agree to the terms and conditions",
  }),
});
type SchemaType = z.infer<typeof schema>;

export const EmailForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
  });

  const [{ loading }] = useAxios(
    {
      url: "/api/entry",
      method: "POST",
    },
    { manual: true }
  );

  const { flow, setPath } = useRouteContext();
  const { spreadFormData } = useFormDataContext();

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

  const setPrizeResponse = usePrizeResponse();

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    const { email } = data;
    spreadFormData({ email });
    if (flow === PossibleFlows.MOBILE) {
      setPath("/instructions");
    } else {
      try {
        const labelArray = ['black-forest', 'laffy-taffy', 'nerds', 'sweet-tarts', 'trolli'];
        const labelName = labelArray[4];

        const form = new FormData();
        form.append("email", email);
        form.append("label_name", labelName);
        const { data } = await submit({
          data: form,
        });
        const responseData = data;
        setPrizeResponse(responseData);
      } catch (e) {
        console.error(e);
      }
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
            required
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
        </form>
      </div>
    </Layout>
  );
};
