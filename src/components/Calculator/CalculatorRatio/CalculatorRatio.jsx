import React, { useState } from "react";
import styles from "./CalculatorRatio.module.css";
import clsn from "classnames";
import { Modal } from "../../UI/Modal/Modal";
import { useTranslation } from "react-i18next";

export const CalculatorRatio = () => {
  const [isViewModal, setIsViewModal] = useState(false);

  const [waist, setWaist] = useState(null);
  const [height, setHeight] = useState(null);
  const [modalType, setModalType] = useState(null);

  const [resultProcentage, setResultProcentage] = useState(null);
  const [resultText, setResultText] = useState(null);

  const { t } = useTranslation();

  const resultContentList = [
    {
      title: t("calculator.slim"),
      precentage: "<46%",
    },
    {
      title: t("calculator.norm"),
      precentage: "46%-49%",
    },
    {
      title: t("calculator.excess__body__weight"),
      precentage: "49%-54%",
    },
    {
      title: t("calculator.obesity"),
      precentage: "54%-58%",
    },
    {
      title: t("calculator.obesity__II__degree"),
      precentage: ">58%",
    },
  ];

  function handleRatioCalucalte() {
    const calculateResult = (waist / height) * 100;
    setResultProcentage(calculateResult.toFixed(1));
    handleResultText(calculateResult);
  }

  function handleResultText(resultProcentage) {
    if (resultProcentage < 46) {
      setResultText(() => t("calculator.slim"));
    } else if (resultProcentage >= 46 && resultProcentage < 49) {
      setResultText(() => t("calculator.norm"));
    } else if (resultProcentage >= 49 && resultProcentage < 54) {
      setResultText(() => t("calculator.excess__body__weight"));
    } else if (resultProcentage >= 54 && resultProcentage < 58) {
      setResultText(() => t("calculator.obesity"));
    } else if (resultProcentage >= 58) {
      setResultText(() => t("calculator.obesity__II__degree"));
    }
  }

  console.log(resultText);

  const showModal = (type) => {
    setModalType(type);
    setIsViewModal(true);
  };
  const saveInput = (value) => {
    if (modalType === "waist") setWaist(value);
    if (modalType === "height") setHeight(value);
  };

  function showResultContent() {
    if (waist != null && height != null) {
      handleRatioCalucalte();
    }
  }

  return (
    <>
      <section className={styles.calculator__item}>
        <h2>{t("calculator.waistto__height__ratio__title")}</h2>
        <section className={styles.calculator__content}>
          {resultProcentage ? (
            <section className={styles.calculator__result}>
              <p className={styles.calculator__result__percentage}>
                {resultProcentage} %
              </p>
              <p className={styles.calculator__result__text}>{resultText}</p>
              <p className={styles.calculator__result__sub}>
                {Number(waist).toFixed(2)} см {Number(height).toFixed(2)} см
              </p>
              <ul className={styles.calculator__result__list}>
                {resultContentList.map((item) => (
                  <li
                    className={clsn(styles.calculator__result__item, {
                      [styles.calculator__result__item__changed]:
                        resultText == item.title,
                    })}
                  >
                    <p>{item.title}</p> <p>{item.precentage}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <section className={styles.calculator__info}>
              <p>{t("calculator.waistto__height__ratio__text")}</p>
              <button
                className={clsn(
                  styles.calculator__content__button,
                  styles.calculator__content__button__blue
                )}
                onClick={showResultContent}
              >
                {t("calculate")}
              </button>
            </section>
          )}
        </section>
        <footer className={styles.calculator__footer}>
          <section className={styles.calculator__footer__item}>
            <p>{t("calculator.waist")}</p>
            <button onClick={() => showModal("waist")}>
              {waist ? (
                <>
                  {waist} см <span>{">"}</span>
                </>
              ) : (
                t("add")
              )}
            </button>
          </section>
          <section className={styles.calculator__footer__item}>
            <p>{t("calculator.height")}</p>
            <button onClick={() => showModal("height")}>
              {height ? (
                <>
                  {height} см <span>{">"}</span>
                </>
              ) : (
                t("add")
              )}
            </button>
          </section>
          {resultProcentage && (
            <button
              style={{ marginTop: 10 }}
              className={styles.calculator__content__button}
              onClick={handleRatioCalucalte}
            >
              {t("calculate")}
            </button>
          )}
        </footer>
      </section>

      <Modal isView={isViewModal} onClose={() => setIsViewModal(false)}>
        <input
          type="text"
          autoFocus
          onChange={(e) => saveInput(e.target.value)}
        />
        <button onClick={() => setIsViewModal(false)}>{t("save")}</button>
      </Modal>
    </>
  );
};
