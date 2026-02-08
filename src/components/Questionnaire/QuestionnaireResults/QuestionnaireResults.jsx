import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import clsn from "classnames";
import styles from "./QuestionnaireResults.module.css";

export const QuestionnaireResults = ({ totalScore, levels, lang, handleSendResults }) => {
  const { t } = useTranslation();
  const thanksText = t("questionnaire.thanks");
  const sendText = t("questionnaire.send");

  const levelList = Array.isArray(levels) ? [...levels].sort((a, b) => (b.min ?? 0) - (a.min ?? 0)) : [];
  let currentLevelIndex = -1;
  levelList.forEach((lev, i) => {
    const min = lev.min ?? 0;
    const max = lev.max ?? 999;
    if (totalScore >= min && totalScore <= max) currentLevelIndex = i;
  });
  // если балл вне всех диапазонов — выделяем ближайший: ниже минимума → уровень с наименьшим min, выше максимума → с наибольшим max
  if (currentLevelIndex === -1 && levelList.length > 0) {
    const globalMin = Math.min(...levelList.map((l) => l.min ?? 0));
    currentLevelIndex = totalScore < globalMin ? levelList.length - 1 : 0;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography textAlign="center" variant="h5">
        {thanksText}
      </Typography>
      <Typography sx={{ marginTop: "16px" }} variant="h6">
        {t("questionnaire.totalScore")}: {totalScore}
      </Typography>
      {levelList.length > 0 && (
        <Box sx={{ marginTop: "24px", width: "100%", maxWidth: 400 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {t("questionnaire.levelOnScale")}
          </Typography>
          <ul className={styles.scaleList}>
            {levelList.map((lev, i) => (
              <li
                key={i}
                className={clsn(styles.scaleItem, {
                  [styles.scaleItemActive]: i === currentLevelIndex,
                  [styles.scaleItemActiveHigh]: i === currentLevelIndex && i === 0,
                  [styles.scaleItemActiveMedium]: i === currentLevelIndex && i > 0 && i < levelList.length - 1,
                  [styles.scaleItemActiveLow]: i === currentLevelIndex && i === levelList.length - 1,
                })}
              >
                <span>{lev[`label_${lang}`] ?? lev.label_ru ?? lev.label_kz ?? `${lev.min}–${lev.max}`}</span>
              </li>
            ))}
          </ul>
        </Box>
      )}
      <Button sx={{ marginTop: "40px" }} variant="contained" onClick={handleSendResults}>
        {sendText}
      </Button>
    </Box>
  );
};
