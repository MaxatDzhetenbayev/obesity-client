import React from "react";
import styles from "./TestBanner.module.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const TestBanner = () => {
  const { t } = useTranslation();

  return (
    <section class={styles.test__banner}>
      <section class={styles.test__banner__row}>
        <h1>{t("banner.text")}</h1>
        <Link to="/calculator">{t("banner.button")}</Link>
      </section>
    </section>
  );
};
