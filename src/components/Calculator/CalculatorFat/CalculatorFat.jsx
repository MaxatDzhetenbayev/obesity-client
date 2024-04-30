import React, { useState } from "react";
import styles from "./CalculatorFat.module.css";
import clsn from "classnames";
import { Modal } from "../../UI/Modal/Modal";

const resultContentList = [
  {
    title: "Необходимый жир",
    precentage: "10%-14%",
  },
  {
    title: "Атлеты",
    precentage: "15%-21%",
  },
  {
    title: "Фитнес",
    precentage: "22%-25%",
  },
  {
    title: "Приемлимый",
    precentage: "26%-32%",
  },
  {
    title: "Ожирение",
    precentage: ">32%",
  },
];

export const CalculatorFat = () => {
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

    setResultProcentage(calculateResult.toFixed(1));
    handleResultText(calculateResult);
  }

  function handleResultText(resultProcentage) {
    if (resultProcentage >= 10 && resultProcentage <= 14) {
      setResultText("Необходимый жир");
    } else if (resultProcentage > 14 && resultProcentage < 21) {
      setResultText("Атлеты");
    } else if (resultProcentage > 21 && resultProcentage < 25) {
      setResultText("Фитнес");
    } else if (resultProcentage > 25 && resultProcentage < 32) {
      setResultText("Приемлимый");
    } else if (resultProcentage > 32) {м
		
      setResultText("Ожирение");
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
    if (neck != null && waist != null && height != null) {
      console.log("work");

      handleFatCalucalte();
    }
  }
  return (
    <>
      <section className={styles.calculator__item}>
        <h2>Процент жира</h2>
        <section className={styles.calculator__content}>
          {resultProcentage ? (
            <section className={styles.calculator__result}>
              <p className={styles.calculator__result__percentage}>
                {resultProcentage} %
              </p>
              <p className={styles.calculator__result__text}>{resultText}</p>
              <p className={styles.calculator__result__sub}>
                {Number(neck).toFixed(2)} см {Number(waist).toFixed(2)} см{" "}
                {Number(height).toFixed(2)} см
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
              <p>
                Процент жировой ткани в теле позволяет измерить, сколько
                процентов вашего тела составляет жир.
              </p>
              <button
                className={clsn(
                  styles.calculator__content__button,
                  styles.calculator__content__button__blue
                )}
                onClick={showResultContent}
                disabled={true}
              >
                Вычислить
              </button>
            </section>
          )}
        </section>
        <footer className={styles.calculator__footer}>
          <section className={styles.calculator__footer__item}>
            <p>Шея</p>
            <button onClick={() => showModal("neck")}>
              {neck ? (
                <>
                  {neck} см <span>{">"}</span>
                </>
              ) : (
                "добавить"
              )}
            </button>
          </section>
          <section className={styles.calculator__footer__item}>
            <p>Рост</p>
            <button onClick={() => showModal("height")}>
              {height ? (
                <>
                  {height} см <span>{">"}</span>
                </>
              ) : (
                "добавить"
              )}
            </button>
          </section>
          <section className={styles.calculator__footer__item}>
            <p>Талия</p>
            <button onClick={() => showModal("waist")}>
              {waist ? (
                <>
                  {waist} см <span>{">"}</span>
                </>
              ) : (
                "добавить"
              )}
            </button>
          </section>
          {resultProcentage && (
            <button onClick={handleFatCalucalte}>Рассчитать</button>
          )}
        </footer>
      </section>

      <Modal isView={isViewModal} onClose={() => setIsViewModal(false)}>
        <input
          type="text"
          onChange={(e) => saveInput(e.target.value)}
          autoFocus
        />
        <button onClick={() => setIsViewModal(false)}>Сохранить</button>
      </Modal>
    </>
  );
};
