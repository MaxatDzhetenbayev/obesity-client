import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./FaqList.module.css";
import { useTranslation } from "react-i18next";

export const FaqList = () => {
  const { t } = useTranslation();

  const [questionList, setQuestionList] = useState([
    {
      question: () => t("faq.whats__obesity__title"),
      answer: () => t("faq.whats__obesity__text"),
      isAnswerView: false,
    },
  ]);

  const handleSetView = (quest) => {
    const updatedList = questionList.map((item) => {
      return item.question() === quest
        ? { ...item, isAnswerView: !item.isAnswerView }
        : item;
    });

    setQuestionList(updatedList);
  };

  const variant = {
    open: {
      style: { borderColor: "var(--main-color)" },
      borderColor: "var(--main-color)",
      height: "auto",
      padding: "0px 20px",
    },
    closed: {
      borderColor: "transparent",
      height: 0,
      padding: "0px 20px",
      overflow: "hidden",
    },
  };

  return (
    <motion.ul className={styles.questionList}>
      {questionList.map((item) => (
        <motion.li
          animate={item.isAnswerView ? "open" : "closed"}
          key={item.question()}
          className={styles.questionItem}
        >
          <motion.button
            variants={{
              open: {
                backgroundColor: "var(--main-color)",
                color: "#fff",
              },
            }}
            className={styles.questionItem_button}
            onClick={() => handleSetView(item.question())}
          >
            <p>{item.question()}</p>
          </motion.button>
          <motion.div variants={variant} className={styles.questionItem_info}>
            <p style={{ padding: "20px 0px" }}>{item.answer()}</p>
          </motion.div>
        </motion.li>
      ))}
    </motion.ul>
  );
};
