import { Box, Button, Typography } from "@mui/material";

export const QuestionnaireTest = ({ question, lang, onAnswer, progress }) => {
  const title = question[`title_${lang}`] ?? question.title_ru ?? question.title_kz ?? "";
  const options = question.options ?? [];

  const handleSelect = (opt) => {
    const points = opt.points ?? 0;
    onAnswer(question.id, opt.id, points);
  };

  return (
    <Box>
      {progress && (
        <Typography textAlign="center" variant="body2" color="text.secondary">
          {progress}
        </Typography>
      )}
      <Typography textAlign="center" marginTop="20px" variant="h6">
        {title}
      </Typography>
      <Box display="flex" flexDirection="column" marginTop="30px" gap={1}>
        {options.map((opt) => (
          <Button
            key={opt.id}
            variant="outlined"
            onClick={() => handleSelect(opt)}
          >
            {opt[`text_${lang}`] ?? opt.text_ru ?? opt.text_kz ?? opt.id}
          </Button>
        ))}
      </Box>
    </Box>
  );
};
