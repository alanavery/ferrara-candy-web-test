import { Clock } from "../../components/Clock";
import { Text } from "../../components/Text";
import { Title } from "../../components/Title";
import styles from "./index.module.css";
import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "../../components/TextInput";
import { Checkbox } from "../../components/Checkbox";
import { Button } from "../../components/Button";
import { InputLabel } from "../../components/InputLabel";
import { InputError } from "../../components/InputError";
import { SelectInput } from "../../components/SelectInput";
import { Layout } from "../../components/Layout";
import { useAlertOnUnload } from "../../hooks/useAlertOnUnload";
import { useRouteContext } from "../../hooks/useRouteContext";
import InputMask from "react-input-mask";
import { useFormDataContext } from "../../hooks/useFormDataContext";
import { useCallback } from "react";
import { useAxios } from "../../axios";
import { STATES } from "./states";
import { useTimeout } from "../../hooks/useTimeout";
import { PossibleFlows } from "../../contexts/RouteContext/types";
import dayjs from "dayjs";

const phoneRegex = new RegExp(
  /^\+1\s\(([2-9]{1}[0-9]{2})\)\s([2-9]{1}[0-9]{2})-([0-9]{4})$/
);

enum PossibleResponses {
  sent = "Email has been sent",
  expired = "Your prize has expired",
  notFound = "Email not found",
}

export type FormResponse = {
  response: PossibleResponses;
  success: boolean;
  apiResponse: any;
};

const schema = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  phone_number: z.string().regex(phoneRegex, "Invalid Number!"),
  confirmation: z.boolean().refine((val) => !!val, {
    message: "You must agree to the terms and conditions",
  }),
  month: z.string(),
  day: z.string(),
  year: z.string(),
});
type SchemaType = z.infer<typeof schema>;

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

export const Winner = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    setError,
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
  });
  useAlertOnUnload();
  const { flow, setPath } = useRouteContext();

  const {
    formData: { email },
  } = useFormDataContext();

  const [, submit] = useAxios<FormResponse>(
    {
      url: "/image_recognition/send_email",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
    { manual: true }
  );

  useTimeout(() => {
    if (flow === PossibleFlows.MOBILE) {
      setPath("/email-form");
    } else setPath("/amoe");
  }, 1000 * 60 * 60);

  const onSubmit: SubmitHandler<SchemaType> = useCallback(
    async (formData) => {
      const { name, address, city, state, month, day, year, phone_number } =
        formData;

      const birthdate = new Date(`${month} ${day}, ${year}`).toISOString();
      const isAbove18 = dayjs().diff(birthdate, "year") >= 18;

      if (isAbove18) {
        const body = {
          email,
          name,
          address,
          city,
          state,
          phone_number: phone_number.replace(/\D/g, ""),
          birthdate: new Date(`${month} ${day}, ${year}`).toISOString(),
        };

        try {
          const { data } = await submit({
            data: body,
          });
          if (data.response === PossibleResponses.sent)
            console.log('Gigya API response:', JSON.parse(data.apiResponse));
            setPath("/winner-confirmation");
        } catch (e) {
          console.log(e);
        }
      } else {
        setError("year", { message: "You must be 18 years or older" });
      }
    },
    [email, setError, setPath, submit]
  );

  return (
    <Layout headerProps={{ centerImage: "winner" }}>
      <div className={styles.container}>
        <Title>You're today's winner</Title>
        <Text>
          You have <span>ONE HOUR</span> to claim your prize. Fill out the form
          below and you will receive your prize in 4-6 weeks.
        </Text>
        <Clock />
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Name"
            {...register("name")}
            required
            error={errors.name?.message}
          />
          <TextInput
            label="Address"
            {...register("address")}
            required
            error={errors.address?.message}
          />
          <div className={styles.row}>
            <TextInput
              label="City"
              style={{ flex: 3 }}
              {...register("city")}
              required
              error={errors.city?.message}
            />
            <SelectInput
              defaultValue=""
              label="State"
              options={[
                {
                  label: "",
                  value: "",
                  disabled: true,
                },
                ...STATES.map((state) => ({
                  label: state,
                  value: state,
                })),
              ]}
              style={{ flex: 2 }}
              {...register("state")}
              required
              error={errors.state?.message}
            />
          </div>
          <Controller
            name="phone_number"
            control={control}
            defaultValue=""
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <InputMask
                mask="+1 (999) 999-9999"
                maskChar=""
                value={field.value}
                onChange={field.onChange}
                required
              >
                <TextInput
                  label="Phone Number"
                  error={errors.phone_number?.message}
                />
              </InputMask>
            )}
          />
          <div style={{ width: "100%" }}>
            <InputLabel label="Date of Birth" required />
            <div className={styles.row}>
              <SelectInput
                defaultValue=""
                required
                style={{ flex: 1 }}
                {...register("month")}
                options={[
                  {
                    value: "",
                    label: "Month",
                    disabled: true,
                  },
                  { value: "jan", label: "Jan" },
                  { value: "feb", label: "Feb" },
                  { value: "mar", label: "Mar" },
                  { value: "apr", label: "Apr" },
                  { value: "may", label: "May" },
                  { value: "jun", label: "Jun" },
                  { value: "jul", label: "Jul" },
                  { value: "aug", label: "Aug" },
                  { value: "sep", label: "Sep" },
                  { value: "oct", label: "Oct" },
                  { value: "nov", label: "Nov" },
                  { value: "dec", label: "Dec" },
                ]}
              />
              <SelectInput
                defaultValue=""
                required
                style={{ flex: 1 }}
                {...register("day")}
                options={[
                  {
                    value: "",
                    label: "Day",
                    disabled: true,
                  },
                  ...Array.from({ length: 31 }, (_, i) => i + 1).map((i) => ({
                    value: i.toString(),
                    label: i.toString(),
                  })),
                ]}
              />
              <SelectInput
                defaultValue=""
                required
                style={{ flex: 1 }}
                {...register("year")}
                options={[
                  {
                    value: "",
                    label: "Year",
                    disabled: true,
                  },
                  ...years.map((year) => ({
                    value: year.toString(),
                    label: year.toString(),
                  })),
                ]}
              />
            </div>
            <InputError
              error={
                errors.month?.message ??
                errors.day?.message ??
                errors.year?.message
              }
            />
          </div>
          <Checkbox
            {...register("confirmation")}
            required
            error={errors.confirmation?.message}
          >
            I have read and agree to the{" "}
            <a href="/official-rules" target="_blank">
              Official Rules
            </a>
            .
          </Checkbox>
          <Button type="submit">submit</Button>
        </form>
      </div>
    </Layout>
  );
};
