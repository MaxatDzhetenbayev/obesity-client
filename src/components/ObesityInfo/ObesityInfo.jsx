import styles from "./ObesityInfo.module.css";
import { useTranslation } from "react-i18next";
import { Container } from '@mui/material';

export const ObesityInfo = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.whats__obesity}>
      <Container>
        <h1>{t("whats__obesity.title")}</h1>
        <p>{t("whats__obesity.text")}</p>
      </Container>
    </section>
  );
};
