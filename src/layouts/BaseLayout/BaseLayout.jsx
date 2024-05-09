import React from "react";
import styles from "./BaseLayout.module.css";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "../../components/Header/Header";
import { Container } from "@mui/material";
export const BaseLayout = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{<Outlet />}</main>
      <footer class={styles.footer}>
        <Container>
          <section class={styles.footer__col}>
            <p class={styles.footer__text}>{t("footer.text")}</p>
            <p class={styles.footer__right}>{t("footer.all_rights")}</p>
          </section>
        </Container>
      </footer>
    </div>
  );
};
