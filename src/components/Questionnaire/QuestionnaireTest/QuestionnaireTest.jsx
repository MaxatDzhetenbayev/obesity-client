import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export const QuestionnaireTest = ({ stage, currentQuestion, nextQuestion }) => {
  const { title: questionTitle, options } = currentQuestion;
  console.log(questionTitle);
  const {
    i18n: { language },
  } = useTranslation();

  return (
    <Box>
      <Typography textAlign="center" variant="h4">
        {stage}
      </Typography>
      <Typography textAlign="center" marginTop="30px">
        {questionTitle[language]}
      </Typography>
      <Box display="flex" flexDirection="column" marginTop="30px">
        {options[language].map((answer, index) => (
          <Button
            key={index}
            onClick={() =>
              nextQuestion(questionTitle["ru"], options["ru"][index])
            }
          >
            {answer}
          </Button>
        ))}
      </Box>
    </Box>
  );
};
