import { Button } from "../../components/Button";
import { InstructionList } from "../../components/InstructionList";
import { Layout } from "../../components/Layout";
import { Title } from "../../components/Title";
import { useAlertOnUnload } from "../../hooks/useAlertOnUnload";
import { useRouteContext } from "../../hooks/useRouteContext";
import styles from "./index.module.css";

export const Instructions = () => {
  const { setPath } = useRouteContext();
  useAlertOnUnload();
  return (
    <Layout>
      <div className={styles.container}>
        <Title>Instructions</Title>
        <InstructionList
          instructions={[
            {
              number: 1,
              text: "Grab your favorite participating candy.",
            },
            {
              number: 2,
              text: "Click the button below to launch your camera app.",
            },
            {
              number: 3,
              text: "Center the logo on your screen to begin scanning.",
            },
          ]}
        />
        <Button
          onClick={() => {
            setPath("/scan");
          }}
        >
          let's go
        </Button>
      </div>
    </Layout>
  );
};
