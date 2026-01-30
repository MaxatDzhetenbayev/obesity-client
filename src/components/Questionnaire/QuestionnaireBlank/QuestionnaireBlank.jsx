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

const nationalityKeys = [
  "kazakh",
  "russian",
  "uzbek",
  "tajik",
  "kyrgyz",
  "turkmen",
  "other",
];

const educationKeys = ["higher", "secondary_special", "secondary", "other"];

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
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, age: e.target.value }))
          }
        />

        <FormControl component="fieldset" required>
          <Typography component="span" variant="body2" color="text.secondary">
            {t("questionnaire.blank.field.gender.label")}
          </Typography>
          <RadioGroup
            row
            value={userInfo.gender}
            onChange={(e) =>
              setUserInfo((prev) => ({ ...prev, gender: e.target.value }))
            }
          >
            <FormControlLabel
              value="male"
              control={<Radio />}
              label={t("questionnaire.blank.field.gender.male")}
            />
            <FormControlLabel
              value="female"
              control={<Radio />}
              label={t("questionnaire.blank.field.gender.female")}
            />
          </RadioGroup>
        </FormControl>

        <TextField
          select
          required
          label={t("questionnaire.blank.field.nationality.label")}
          helperText={t("questionnaire.blank.field.nationality.helper")}
          value={userInfo.nationality}
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, nationality: e.target.value }))
          }
          variant="standard"
        >
          {nationalityKeys.map((key) => (
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
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, region: e.target.value }))
          }
        />

        <FormControl component="fieldset">
          <Typography component="span" variant="body2" color="text.secondary">
            {t("questionnaire.blank.field.residenceType.label")}
          </Typography>
          <RadioGroup
            row
            value={userInfo.residenceType}
            onChange={(e) =>
              setUserInfo((prev) => ({
                ...prev,
                residenceType: e.target.value,
              }))
            }
          >
            <FormControlLabel
              value="city"
              control={<Radio />}
              label={t("questionnaire.blank.field.residenceType.city")}
            />
            <FormControlLabel
              value="village"
              control={<Radio />}
              label={t("questionnaire.blank.field.residenceType.village")}
            />
          </RadioGroup>
        </FormControl>

        <TextField
          select
          label={t("questionnaire.blank.field.education.label")}
          helperText={t("questionnaire.blank.field.education.helper")}
          value={userInfo.education}
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, education: e.target.value }))
          }
          variant="standard"
        >
          {educationKeys.map((key) => (
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
            onChange={(e) =>
              setUserInfo((prev) => ({ ...prev, educationOther: e.target.value }))
            }
          />
        )}

        <TextField
          label={t("questionnaire.blank.field.placeOfWork.label")}
          helperText={t("questionnaire.blank.field.placeOfWork.helper")}
          variant="standard"
          value={userInfo.placeOfWork}
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, placeOfWork: e.target.value }))
          }
        />

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
          value={userInfo.height}
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, height: e.target.value }))
          }
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
          value={userInfo.weight}
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, weight: e.target.value }))
          }
        />
      </Box>
      <Button sx={{ marginTop: "20px" }} type="submit">
        {t("questionnaire.start")}
      </Button>
    </form>
  );
};
