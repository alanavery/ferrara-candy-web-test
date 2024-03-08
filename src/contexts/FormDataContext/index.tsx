import { createContext, useState } from "react";

export type FormDataType = Partial<{
  email: string;
  confirmation: boolean;
}>;

export const FormDataContext = createContext<{
  formData: FormDataType;
  spreadFormData: (value: FormDataType) => void;
}>({
  formData: {},
  spreadFormData: (value: FormDataType) => {
    return value;
  },
});

export const FormDataProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [formData, setFormData] = useState<FormDataType>(
    {},
  );
  const spreadFormData = (value: FormDataType) => {
    setFormData((prev) => ({ ...prev, ...value }));
  };
  return (
    <FormDataContext.Provider
      value={{ formData, spreadFormData }}
    >
      {children}
    </FormDataContext.Provider>
  );
};
