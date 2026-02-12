import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

const NATIONALITY_KEYS = ["kazakh", "russian", "uzbek", "tajik", "kyrgyz", "turkmen", "other"];
const EDUCATION_KEYS = ["higher", "secondary_special", "secondary", "other"];

export const QuestionnaireBlank = ({ userInfo, setUserInfo, handleStart, selectedQuestionnaire }) => {
  const { t, i18n: { language } } = useTranslation();
  const lang = language === "kz" ? "kz" : "ru";
  const title = selectedQuestionnaire
    ? (selectedQuestionnaire[`title_${lang}`] || selectedQuestionnaire.title_ru || selectedQuestionnaire.title_kz)
    : t("questionnaire.title");
  const inviteText = t("questionnaire.invite");
  const topicText = t("questionnaire.topic").replace(/\{\{title\}\}/g, title);
  const instructionText = t("questionnaire.instruction");

  const update = (key, value) => setUserInfo((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      onSubmit={handleStart}
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Container maxWidth="sm" disableGutters sx={{ mb: 3 }}>
        <Typography
          textAlign="center"
          variant="h5"
          sx={{ fontWeight: 700, textTransform: "uppercase", mb: 1 }}
        >
          {t("questionnaire.title")}
        </Typography>
        <Typography
          textAlign="center"
          variant="h6"
          sx={{ fontWeight: 700, mb: 1 }}
        >
          {t("questionnaire.text")}
        </Typography>
        <Typography textAlign="center" variant="body1" sx={{ mb: 0.5 }}>
          {inviteText}{" "}
          <Box
            component="span"
            sx={{
              fontWeight: 900,
              fontSize: "1.05rem",
            }}
          >
            {topicText}
          </Box>
        </Typography>
        <Typography textAlign="center" variant="body1" sx={{ mb: 1 }}>
          {instructionText}
        </Typography>
        <Typography
          textAlign="center"
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: "italic", textDecoration: "underline" }}
        >
          {t("questionnaire.anonymousNote")}
        </Typography>
      </Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginTop: "20px",
          maxWidth: 480,
          width: "100%",
        }}
      >
        <TextField
          required
          label={t("questionnaire.blank.field.age.label")}
          helperText={t("questionnaire.blank.field.age.helper")}
          variant="standard"
          value={userInfo.age}
          type="number"
          onChange={(e) => update("age", e.target.value)}
          InputLabelProps={{ sx: { fontWeight: 700, color: "black", fontSize: "1rem" } }}
          FormHelperTextProps={{ sx: { fontSize: "0.875rem" } }}
        />

        <FormControl component="fieldset" required>
          <Typography component="span" variant="body2" sx={{ fontWeight: 700, color: "black", fontSize: "1rem" }}>
            {t("questionnaire.blank.field.gender.label")}
          </Typography>
          <RadioGroup row value={userInfo.gender} onChange={(e) => update("gender", e.target.value)}>
            <FormControlLabel value="male" control={<Radio />} label={t("questionnaire.blank.field.gender.male")} />
            <FormControlLabel value="female" control={<Radio />} label={t("questionnaire.blank.field.gender.female")} />
          </RadioGroup>
        </FormControl>

        <TextField
          select
          required
          label={t("questionnaire.blank.field.nationality.label")}
          helperText={t("questionnaire.blank.field.nationality.helper")}
          value={userInfo.nationality}
          onChange={(e) => update("nationality", e.target.value)}
          variant="standard"
          InputLabelProps={{ sx: { fontWeight: 700, color: "black", fontSize: "1rem" } }}
          FormHelperTextProps={{ sx: { fontSize: "0.875rem" } }}
        >
          {NATIONALITY_KEYS.map((key) => (
            <MenuItem key={key} value={key}>
              {t("questionnaire.blank.nationality." + key)}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label={t("questionnaire.blank.field.region.label")}
          helperText={t("questionnaire.blank.field.region.helper")}
          variant="standard"
          value={userInfo.region}
          onChange={(e) => update("region", e.target.value)}
          InputLabelProps={{ sx: { fontWeight: 700, color: "black", fontSize: "1rem" } }}
          FormHelperTextProps={{ sx: { fontSize: "0.875rem" } }}
        />

        <FormControl component="fieldset">
          <Typography component="span" variant="body2" sx={{ fontWeight: 700, color: "black", fontSize: "1rem" }}>
            {t("questionnaire.blank.field.residenceType.label")}
          </Typography>
          <RadioGroup row value={userInfo.residenceType} onChange={(e) => update("residenceType", e.target.value)}>
            <FormControlLabel value="city" control={<Radio />} label={t("questionnaire.blank.field.residenceType.city")} />
            <FormControlLabel value="village" control={<Radio />} label={t("questionnaire.blank.field.residenceType.village")} />
          </RadioGroup>
        </FormControl>

        <TextField
          select
          label={t("questionnaire.blank.field.education.label")}
          helperText={t("questionnaire.blank.field.education.helper")}
          value={userInfo.education}
          onChange={(e) => update("education", e.target.value)}
          variant="standard"
          InputLabelProps={{ sx: { fontWeight: 700, color: "black", fontSize: "1rem" } }}
          FormHelperTextProps={{ sx: { fontSize: "0.875rem" } }}
        >
          {EDUCATION_KEYS.map((key) => (
            <MenuItem key={key} value={key}>
              {t("questionnaire.blank.field.education." + key)}
            </MenuItem>
          ))}
        </TextField>

        {userInfo.education === "other" && (
          <TextField
            label={t("questionnaire.blank.field.educationOther.label")}
            helperText={t("questionnaire.blank.field.educationOther.helper")}
            variant="standard"
            value={userInfo.educationOther}
            onChange={(e) => update("educationOther", e.target.value)}
            FormHelperTextProps={{ sx: { fontSize: "0.875rem" } }}
          />
        )}

        <TextField
          label={t("questionnaire.blank.field.placeOfWork.label")}
          helperText={t("questionnaire.blank.field.placeOfWork.helper")}
          variant="standard"
          value={userInfo.placeOfWork}
          onChange={(e) => update("placeOfWork", e.target.value)}
          InputLabelProps={{ sx: { fontWeight: 700, color: "black", fontSize: "1rem" } }}
          FormHelperTextProps={{ sx: { fontSize: "0.875rem" } }}
        />

        <TextField
          required
          label={t("questionnaire.blank.field.height.label")}
          helperText={t("questionnaire.blank.field.height.helper")}
          InputProps={{ startAdornment: <InputAdornment position="start">cm</InputAdornment> }}
          variant="standard"
          type="number"
          value={userInfo.height}
          onChange={(e) => update("height", e.target.value)}
          FormHelperTextProps={{ sx: { fontSize: "0.875rem" } }}
        />
        <TextField
          required
          label={t("questionnaire.blank.field.weight.label")}
          helperText={t("questionnaire.blank.field.weight.helper")}
          InputProps={{ startAdornment: <InputAdornment position="start">kg</InputAdornment> }}
          variant="standard"
          type="number"
          value={userInfo.weight}
          onChange={(e) => update("weight", e.target.value)}
          FormHelperTextProps={{ sx: { fontSize: "0.875rem" } }}
        />
      </Box>
      <Button sx={{ marginTop: "20px" }} type="submit">
        {t("questionnaire.start")}
      </Button>
    </form>
  );
};
