import React, { useState } from "react";
import styles from "./Calcualtor.module.css";
import { Container } from "../UI/Container/Container";
import { CalculatorRatio } from "./CalculatorRatio/CalculatorRatio";
import { CalculatorFat } from "./CalculatorFat/CalculatorFat";
export const Calcualtor = () => {
  return (
    <Container>
      <section className={styles.calculator}>
        <section className={styles.calculator__group}>
          <CalculatorRatio />
          <CalculatorFat />
          {/* <section className={styles.calculator__item}>
            <h2>Процент жира</h2>
            <section className={styles.calculator__content}>
              <p>
                Процент жировой ткани в теле позволяет измерять, сколько
                процентов вашего тела составляет жир.
              </p>
              <button
                className={clsn(
                  styles.calculator__content__button,
                  styles.calculator__content__button__pink
                )}
              >
                Вычислить
              </button>
            </section>
            <footer className={styles.calculator__footer}>
              <section className={styles.calculator__footer__item}>
                <p>Шея</p>
                <button>добавить</button>
              </section>
              <hr />
              <section className={styles.calculator__footer__item}>
                <p>Бедра</p>
                <button>добавить</button>
              </section>
            </footer>
          </section> */}
        </section>
      </section>
    </Container>
  );
};
