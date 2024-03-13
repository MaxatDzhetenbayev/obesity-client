import React from "react";
import clsn from "classnames";
import styles from "./BaseLayout.module.css";
import { Container } from "../../components/UI/Container/Container";
import { Outlet, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export const BaseLayout = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.layout}>
      <header>
        <Container>
          <section className={clsn(styles.header__content, styles.row)}>
            <nav className={styles.navigation}>
              <ul className={clsn(styles.navigation__list, styles.row)}>
                <li className={styles.navigation__items}>
                  <Link to="/">{t("menu.main")}</Link>
                </li>
                <li className={styles.navigation__items}>
                  <Link to="questionnaire">{t("menu.questionnaire")}</Link>
                </li>
                <li className={styles.navigation__items}>
                  <Link to="calculator">{t("menu.online_calculator")}</Link>
                </li>
                <li className={styles.navigation__items}>
                  <Link to="faq">{t("menu.faq")}</Link>
                </li>
              </ul>
            </nav>
            <button className={styles.header__adaptive__menu}>menu</button>
            <section className={styles.language}>
              <select>
                <option value="kz">Казахский</option>
                <option value="ru">Русский</option>
              </select>
            </section>
          </section>
        </Container>
      </header>
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
