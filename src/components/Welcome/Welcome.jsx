import React from "react";
import styles from "./Welcome.module.css";
import { useTranslation } from "react-i18next";
import { Container } from '@mui/material';
export const Welcome = () => {
  const { t } = useTranslation();

  return (
    <section class={styles.welcome}>
      <Container>
        <section class={styles.welcome__wrapper}>
          <h1>{t("welcome.title")}</h1>
          <p>{t("welcome.text")}</p>
        </section>
      </Container>
    </section>
  );
};
