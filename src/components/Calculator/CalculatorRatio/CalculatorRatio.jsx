import React, { useState } from "react";
import styles from "./CalculatorRatio.module.css";
import clsn from "classnames";
import { Modal } from "../../UI/Modal/Modal";

const resultContentList = [
  {
    title: "Стройная",
    precentage: "<46%",
  },
  {
    title: "Норма",
    precentage: "46%-49%",
  },
  {
    title: "Избыточная масса тела",
    precentage: "49%-54%",
  },
  {
    title: "Ожирение",
    precentage: "54%-58%",
  },
  {
    title: "Ожирение II степени",
    precentage: ">58%",
  },
];

export const CalculatorRatio = () => {
  const [isViewModal, setIsViewModal] = useState(false);

  const [waist, setWaist] = useState(null);
  const [height, setHeight] = useState(null);
  const [modalType, setModalType] = useState(null);

  const [resultProcentage, setResultProcentage] = useState(null);
  const [resultText, setResultText] = useState(null);

  function handleRatioCalucalte() {
    const calculateResult = (waist / height) * 100;
    setResultProcentage(calculateResult.toFixed(1));
	 handleResultText(calculateResult);
  }

  function handleResultText(resultProcentage) {
    if (resultProcentage < 46) {
      setResultText("Стройная");
    } else if (resultProcentage >= 46 && resultProcentage < 49) {
      setResultText("Норма");
    } else if (resultProcentage >= 49 && resultProcentage < 54) {
      setResultText("Избыточная масса тела");
    } else if (resultProcentage >= 54 && resultProcentage < 58) {
      setResultText("Ожирение");
    } else if (resultProcentage >= 58) {
      setResultText("Ожирение II степени");
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
        <h2>Соотношение талии к росту</h2>
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
              <p>
                Соотношение окружности талии и роста (СОТР) - это мера
                распределения жировой ткани в теле. Она коррелирует с риском
                заболеваний, связанных с ожирением.
              </p>
              <button
                className={clsn(
                  styles.calculator__content__button,
                  styles.calculator__content__button__blue
                )}
                onClick={showResultContent}
              >
                Вычислить
              </button>
            </section>
          )}
        </section>
        <footer className={styles.calculator__footer}>
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
          <hr />
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
          {resultProcentage && (
            <button onClick={handleRatioCalucalte}>Рассчитать</button>
          )}
        </footer>
      </section>

      <Modal isView={isViewModal}>
        <input type="text" onChange={(e) => saveInput(e.target.value)} />
        <button onClick={() => setIsViewModal(false)}>Сохранить</button>
      </Modal>
    </>
  );
};
