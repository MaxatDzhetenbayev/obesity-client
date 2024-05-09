import { Box, Button, Typography } from "@mui/material";
import React from "react";

export const QuestionnaireResults = ({ handleSendResults }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography textAlign="center" variant="h4">
        Спасибо за прохождение опросника!
      </Typography>
      <Button sx={{marginTop: "40px"}} onClick={handleSendResults}>Отправить результаты</Button>
    </Box>
  );
};
