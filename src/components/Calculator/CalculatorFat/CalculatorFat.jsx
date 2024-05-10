import React, { useState } from "react";
import styles from "./CalculatorFat.module.css";
import clsn from "classnames";
import { Modal } from "../../UI/Modal/Modal";
import { useTranslation } from "react-i18next";

const resultContentList = [
  {
    title: "calculator.essential_fat",
    precentage: "10%-14%",
  },
  {
    title: "calculator.athletes",
    precentage: "15%-21%",
  },
  {
    title: "calculator.fitness",
    precentage: "22%-25%",
  },
  {
    title: "calculator.acceptable",
    precentage: "26%-32%",
  },
  {
    title: "calculator.obesity",
    precentage: ">32%",
  },
];

export const CalculatorFat = () => {

  const {t} = useTranslation()

  const [isViewModal, setIsViewModal] = useState(false);

  const [waist, setWaist] = useState(null);
  const [height, setHeight] = useState(null);
  const [neck, setNeckSize] = useState(null);
  const [modalType, setModalType] = useState(null);

  const [resultProcentage, setResultProcentage] = useState(null);
  const [resultText, setResultText] = useState(null);

  function handleFatCalucalte() {
    let calculateResult =
      495 /
        (1.0324 -
          0.19077 * Math.log10(waist - neck) +
          0.15456 * Math.log10(height)) -
      450;
          console.log(calculateResult)
    setResultProcentage(calculateResult.toFixed(1));
    handleResultText(calculateResult);
  }

  function handleResultText(resultProcentage) {
    console.log(resultProcentage)
    if ( resultProcentage <= 14) {
      setResultText("essential_fat");
    } else if (resultProcentage > 14 && resultProcentage < 21) {
      setResultText("athletes");
    } else if (resultProcentage > 21 && resultProcentage < 25) {
      setResultText("fitness");
    } else if (resultProcentage > 25 && resultProcentage < 32) {
      setResultText("acceptable");
    } else if (resultProcentage >= 32) {
      setResultText("obesity");
    }
  }

  const showModal = (type) => {
    setModalType(type);
    setIsViewModal(true);
  };
  const saveInput = (value) => {
    if (modalType === "neck") setNeckSize(value);
    if (modalType === "height") setHeight(value);
    if (modalType === "waist") setWaist(value);
  };

  function showResultContent() {
    console.log("213")
    if (neck != null && waist != null && height != null) {

      handleFatCalucalte();
    }
  }
  return (
    <>
      <section className={styles.calculator__item}>
        <h2>{t("calculator.fat_procentage")}</h2>
        <section className={styles.calculator__content}>
          {resultProcentage ? (
            <section className={styles.calculator__result}>
              <p className={styles.calculator__result__percentage}>
                {resultProcentage} %
              </p>
              <p className={styles.calculator__result__text}>{t("calculator." +resultText)}</p>
              <p className={styles.calculator__result__sub}>
                {Number(neck).toFixed(2)} см {Number(waist).toFixed(2)} см{" "}
                {Number(height).toFixed(2)} см
              </p>
              <ul className={styles.calculator__result__list}>
                {resultContentList.map((item) => (
                  <li
                    className={clsn(styles.calculator__result__item, {
                      [styles.calculator__result__item__changed]:
                        resultText == item.title.split(".")[1],
                    })}
                  >
                    <p>{t(item.title)}</p> <p>{item.precentage}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <section className={styles.calculator__info}>
              <p>
                {t("calculator.fat_procentage__text")}
              </p>
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
            <p>{t("calculator.neck")}</p>
            <button onClick={() => showModal("neck")}>
              {neck ? (
                <>
                  {neck} см <span>{">"}</span>
                </>
              ) : (
                t("add")
              )
              }
            </button>
          </section>
          <section className={styles.calculator__footer__item}>
            <p>{t("calculator.height")}</p>
            <button onClick={() => showModal("height")}>
              {height ? (
                <>
                  {height} см <span>{">"}</span>
                </>
              ) :  t("add")}
            </button>
          </section>
          <section className={styles.calculator__footer__item}>
            <p>{t("calculator.waist")}</p>
            <button onClick={() => showModal("waist")}>
              {waist ? (
                <>
                  {waist} см <span>{">"}</span>
                </>
              ) :  t("add")}
            </button>
          </section>
          {resultProcentage && (
            <button style={{marginTop: "10px"}} className={styles.calculator__content__button} onClick={handleFatCalucalte}>{t("calculate")}</button>
          )}
        </footer>
      </section>

      <Modal isView={isViewModal} onClose={() => setIsViewModal(false)}>
        <input
          type="text"
          onChange={(e) => saveInput(e.target.value)}
          autoFocus
        />
        <button  onClick={() => setIsViewModal(false)}>{t("save")}</button>
      </Modal>
    </>
  );
};
