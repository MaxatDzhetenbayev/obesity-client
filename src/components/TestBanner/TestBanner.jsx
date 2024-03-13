import React from "react";
import styles from "./TestBanner.module.css";

export const TestBanner = () => {
  return (
    <section class={styles.test__banner}>
      <section class={styles.test__banner__row}>
        <h1>
          Пройди тест и онлайн калькулятор, <br />
          чтобы узнать свой результат
        </h1>
        <button>Начать тест</button>
      </section>
    </section>
  );
};
