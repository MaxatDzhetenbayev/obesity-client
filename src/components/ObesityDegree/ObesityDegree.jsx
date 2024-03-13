import React from "react";
import styles from "./ObesityDegree.module.css";
import { Container } from "../UI/Container/Container";
import { useTranslation } from "react-i18next";
export const ObesityDegree = () => {
  const { t } = useTranslation();

  return (
    <section class={styles.degree__obesity}>
      <Container>
        <h2 class={styles.degree__obesity__title}>
          {t("obesity_degree.title")}
        </h2>
        <section class={styles.degree__obesity__grid}>
          <article class={styles.degree__obesity__item}>
            <section class={styles.degree__obesity__mass}>
              <h3>25-30 кг</h3>
            </section>
            <section class={styles.degree__obesity__content}>
              <h2> {t("obesity_degree.item_1.title")}</h2>
              <p>{t("obesity_degree.item_1.text")}</p>
            </section>
          </article>
          <article class={styles.degree__obesity__item}>
            <section class={styles.degree__obesity__mass}>
              <h3>35-40 кг</h3>
            </section>
            <section class={styles.degree__obesity__content}>
              <h2> {t("obesity_degree.item_2.title")}</h2>
              <p>{t("obesity_degree.item_2.text")}</p>
            </section>
          </article>
          <article class={styles.degree__obesity__item}>
            <section class={styles.degree__obesity__mass}>
              <h3>30-35 кг</h3>
            </section>
            <section class={styles.degree__obesity__content}>
              <h2> {t("obesity_degree.item_3.title")}</h2>
              <p>{t("obesity_degree.item_3.text")}</p>
            </section>
          </article>
          <article class={styles.degree__obesity__item}>
            <section class={styles.degree__obesity__mass}>
              <h3>{">"}40 кг</h3>
            </section>
            <section class={styles.degree__obesity__content}>
              <h2> {t("obesity_degree.item_4.title")}</h2>
              <p>{t("obesity_degree.item_4.text")}</p>
            </section>
          </article>
        </section>
      </Container>
    </section>
  );
};
