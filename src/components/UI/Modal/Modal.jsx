import React from "react";
import styles from "./Modal.module.css";
import CloseIconOutlined from "@mui/icons-material/Close";
export const Modal = ({ isView, children, onClose }) => {
  if (isView) {
    return (
      <section className={styles.modal__wrapper}>
        <section className={styles.modal__content}>
          <header className={styles.modal__header}>
            <button onClick={onClose}>
              <CloseIconOutlined />
            </button>
          </header>
          <section className={styles.modal__section}>{children}</section>
        </section>
      </section>
    );
  }
};
