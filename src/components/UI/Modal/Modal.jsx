import React from "react";
import styles from "./Modal.module.css";

export const Modal = ({ isView, children }) => {
  if (isView) {
    return (
      <section className={styles.calculator__modal__wrapper}>
        <section className={styles.calculator__modal__content}>
          {children}
        </section>
      </section>
    );
  }
};
