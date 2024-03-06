import { Layout } from "../../components/Layout";
import { Text } from "../../components/Text";
import { Title } from "../../components/Title";
import styles from "./index.module.css";

export const WinnerFormConfirmation = () => (
  <Layout headerProps={{ centerImage: "winner" }}>
    <div className={styles.container}>
      <Title>REGISTRATION COMPLETE</Title>
      <Text>
        You will receive a confirmation email. Don’t forget to come back in a
        week for another chance to WIN!
      </Text>
    </div>
  </Layout>
);
