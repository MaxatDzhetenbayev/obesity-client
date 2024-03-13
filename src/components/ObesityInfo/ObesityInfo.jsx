import React from "react";
import styles from "./ObesityInfo.module.css";
import { Trans, useTranslation } from "react-i18next";
import { Container } from "../UI/Container/Container";

export const ObesityInfo = () => {
  const { t } = useTranslation();

  return (
    <section class={styles.whats__obesity}>
      <Container>
        <h1>{t("whats__obesity.title")}</h1>
        <p>{t("whats__obesity.text")}</p>
      </Container>
    </section>
  );
};
