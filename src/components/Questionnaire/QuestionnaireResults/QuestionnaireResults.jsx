import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export const QuestionnaireResults = ({ handleSendResults }) => {

  const { t } = useTranslation()

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography textAlign="center" variant="h4">
        {t("questionnaire.thanks")}
      </Typography>
      <Button sx={{ marginTop: "40px" }} onClick={handleSendResults}>{t("questionnaire.send")}</Button>
    </Box>
  );
};
