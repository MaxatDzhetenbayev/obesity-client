import React from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Container,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

const nationality = [
  "questionnaire.blank.nationality.kazakh",
  "questionnaire.blank.nationality.russian",
  "questionnaire.blank.nationality.uzbek",
  "questionnaire.blank.nationality.tajik",
  "questionnaire.blank.nationality.kyrgyz",
  "questionnaire.blank.nationality.turkmen",
  "questionnaire.blank.nationality.other",
];

export const QuestionnaireBlank = ({ userInfo, setUserInfo, handleStart }) => {
  const { t } = useTranslation();

  return (
    <form
      onSubmit={handleStart}
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Container maxWidth="sm" disableGutters>
        <Typography textAlign="center">{t("questionnaire.info")}</Typography>
      </Container>
      <Typography sx={{ marginTop: "10px" }} textAlign="center" variant="h6">
        {t("questionnaire.title")}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          marginTop: "20px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>

          <TextField
            required
            label={t("questionnaire.blank.field.age.label")}
            helperText={t("questionnaire.blank.field.age.helper")}
            variant="standard"
            value={userInfo.age}
            type="number"
            onChange={(e) =>
              setUserInfo((prev) => ({ ...prev, age: e.target.value }))
            }
          />
          <TextField
            select
            required
            label={t("questionnaire.blank.field.nationality.label")}
            helperText={t("questionnaire.blank.field.nationality.helper")}
            value={t(userInfo.nationality)}
            onChange={(e) =>
              setUserInfo((prev) => ({
                ...prev,
                nationality: t(e.target.value),
              }))
            }
            variant="standard"
          >
            {nationality.map((option) => (
              <MenuItem key={option} value={t(option)}>
                {t(option)}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            required
            label={t("questionnaire.blank.field.height.label")}
            helperText={t("questionnaire.blank.field.height.helper")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">cm</InputAdornment>
              ),
            }}
            variant="standard"
            type="number"
            onChange={(e) =>
              setUserInfo((prev) => ({ ...prev, height: e.target.value }))
            }
            value={userInfo.height}
          />
          <TextField
            required
            label={t("questionnaire.blank.field.weight.label")}
            helperText={t("questionnaire.blank.field.weight.helper")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">kg</InputAdornment>
              ),
            }}
            variant="standard"
            type="number"
            onChange={(e) =>
              setUserInfo((prev) => ({ ...prev, weight: e.target.value }))
            }
            value={userInfo.weight}
          />
          <TextField
            required
            label={t("questionnaire.blank.field.pulse.label")}
            helperText={t("questionnaire.blank.field.pulse.helper")}
            variant="standard"
            type="number"
            onChange={(e) =>
              setUserInfo((prev) => ({ ...prev, pulse: e.target.value }))
            }
            value={userInfo.pulse}
          />
        </Box>
      </Box>
      <Button sx={{ marginTop: "20px" }} type="submit">
        {t("questionnaire.start")}
      </Button>
    </form>
  );
};
