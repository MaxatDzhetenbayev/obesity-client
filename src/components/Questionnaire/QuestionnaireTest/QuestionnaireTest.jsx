import { Box, Button, Typography } from "@mui/material";
import React from "react";

export const QuestionnaireTest = ({ stage, currentQuestion, nextQuestion }) => {
  const { title: questionTitle, options } = currentQuestion;

  return (
    <Box>
      <Typography textAlign="center" variant="h4">
        {stage}
      </Typography>
      <Typography textAlign="center" marginTop="30px">
        {questionTitle}
      </Typography>
      <Box display="flex" flexDirection="column" marginTop="30px">
        {options.map((answer, index) => (
          <Button
            key={index}
            onClick={() => nextQuestion(questionTitle, answer)}
          >
            {answer}
          </Button>
        ))}
      </Box>
    </Box>
  );
};
