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
        </section>
      </section>
    </Container>
  );
};
