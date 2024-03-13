import React from "react";
import styles from "./CalculatorItem.module.css";
import clsn from "classnames";
export const CalculatorItem = () => {
  return (
    <section className={styles.calculator__item}>
      <h2>Соотношение талии к росту</h2>
      <section className={styles.calculator__content}>
        <p>
          Соотношение окружности талии и роста (СОТР) - это мера распределения
          жировой ткани в теле. Она коррелирует с риском заболеваний, связанных
          с ожирением.
        </p>
        <button
          className={clsn(
            styles.calculator__content__button,
            styles.calculator__content__button__blue
          )}
        >
          Вычислить
        </button>
      </section>
      <footer className={styles.calculator__footer}>
        <section className={styles.calculator__footer__item}>
          <p>Талия</p>
          <button>добавить</button>
        </section>
        <hr />
        <section className={styles.calculator__footer__item}>
          <p>Рост</p>
          <button>добавить</button>
        </section>
      </footer>
    </section>
  );
};
