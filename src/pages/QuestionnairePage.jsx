import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { db } from "../firebaseConfig";
import { QuestionnaireBlank } from "../components/Questionnaire/QuestionnaireBlank/QuestionnaireBlank";
import { Container, Paper, Typography, Box, CircularProgress, Snackbar, Alert } from "@mui/material";
import { QuestionnaireTest } from "../components/Questionnaire/QuestionnaireTest/QuestionnaireTest";
import { QuestionnaireResults } from "../components/Questionnaire/QuestionnaireResults/QuestionnaireResults";

export const QuestionnairePage = () => {
  const { t, i18n: { language } } = useTranslation();
  const navigate = useNavigate();
  const lang = language === "kz" ? "kz" : "ru";

  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState(null);
  const [userInfo, setUserInfo] = useState({
    age: "",
    gender: "",
    nationality: "",
    region: "",
    residenceType: "",
    education: "",
    educationOther: "",
    placeOfWork: "",
    height: "",
    weight: "",
  });
  const [isBlankFilled, setIsBlankFilled] = useState(false);
  const [questionsWithOptions, setQuestionsWithOptions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const qSnap = await getDocs(collection(db, "questionnaires"));
        const items = qSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        items.sort((a, b) => (a.order ?? 999999) - (b.order ?? 999999));
        setQuestionnaires(items);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedQuestionnaireId) return;
    const loadQuestions = async () => {
      try {
        const q = query(
          collection(db, "questions"),
          where("questionnaireId", "==", selectedQuestionnaireId)
        );
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order || 0) - (b.order || 0));
        if (list.length === 0) {
          setQuestionsWithOptions([]);
          return;
        }
        const allOptionsSnap = await getDocs(collection(db, "answer_options"));
        const allOptions = allOptionsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const questionIds = new Set(list.map((q) => q.id));
        const optionsByQuestion = {};
        allOptions.forEach((o) => {
          if (questionIds.has(o.questionId)) {
            if (!optionsByQuestion[o.questionId]) optionsByQuestion[o.questionId] = [];
            optionsByQuestion[o.questionId].push(o);
          }
        });
        const withOptions = list.map((q) => ({
          ...q,
          options: (optionsByQuestion[q.id] || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        }));
        setQuestionsWithOptions(withOptions);
      } catch (e) {
        setError(e.message);
      }
    };
    loadQuestions();
  }, [selectedQuestionnaireId]);

  const selectedQuestionnaire = questionnaires.find((q) => q.id === selectedQuestionnaireId);
  const currentQuestion = questionsWithOptions[currentQuestionIndex];

  const handleStart = (e) => {
    e.preventDefault();
    setIsBlankFilled(true);
  };

  const handleAnswer = (questionId, answerOptionId, points) => {
    setAnswers((prev) => [...prev, { questionId, answerOptionId }]);
    setTotalScore((prev) => prev + (points ?? 0));
    if (currentQuestionIndex >= questionsWithOptions.length - 1) {
      setIsFinished(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const getLevelForScore = (score, levels) => {
    if (!Array.isArray(levels) || levels.length === 0) return null;
    const sorted = [...levels].sort((a, b) => (b.min ?? b.max) - (a.min ?? a.max));
    for (let i = 0; i < sorted.length; i++) {
      const { min = 0, max = 999 } = sorted[i];
      if (score >= min && score <= max) return i;
    }
    return 0;
  };

  const handleSendResults = async () => {
    if (!selectedQuestionnaireId || !selectedQuestionnaire) return;
    try {
      const resultId = uuid();
      const levels = selectedQuestionnaire.levels || [];
      const levelIndex = getLevelForScore(totalScore, levels);
      const levelLabel = levels[levelIndex] ? levels[levelIndex][`label_${lang}`] : null;

      await setDoc(doc(db, "results", resultId), {
        ...userInfo,
        questionnaireId: selectedQuestionnaireId,
        totalScore,
        levelLabel,
        createdAt: new Date(),
      });

      const batch = answers.map((a) =>
        setDoc(doc(db, "result_answers", uuid()), {
          resultId,
          questionId: a.questionId,
          answerOptionId: a.answerOptionId,
        })
      );
      await Promise.all(batch);

      setSnackbarOpen(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  if (error) {
    return (
      <Container>
        <Typography color="error" sx={{ p: 2 }}>{error}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {t("questionnaire.sendSuccess")}
        </Alert>
      </Snackbar>
      <Paper elevation={2} sx={{ padding: "20px 10px", marginTop: "40px" }}>
        {!selectedQuestionnaireId && (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("questionnaire.selectQuestionnaire")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 560, mx: "auto", mt: 3 }}>
              {questionnaires.length === 0 ? (
                <Typography color="text.secondary">{t("questionnaire.noQuestionnaires")}</Typography>
              ) : (
                questionnaires.map((q) => (
                  <Paper
                    key={q.id}
                    elevation={0}
                    onClick={() => setSelectedQuestionnaireId(q.id)}
                    sx={{
                      p: 2,
                      textAlign: "left",
                      cursor: "pointer",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "background.paper",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        boxShadow: 2,
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.primary",
                        fontWeight: 500,
                        lineHeight: 1.4,
                        textTransform: "none",
                      }}
                    >
                      {q[`title_${lang}`] || q.title_ru || q.title_kz || q.id}
                    </Typography>
                  </Paper>
                ))
              )}
            </Box>
          </Box>
        )}

        {selectedQuestionnaireId && !isBlankFilled && (
          <QuestionnaireBlank
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            handleStart={handleStart}
            selectedQuestionnaire={selectedQuestionnaire}
          />
        )}

        {selectedQuestionnaireId && isBlankFilled && !isFinished && currentQuestion && (
          <QuestionnaireTest
            question={currentQuestion}
            lang={lang}
            onAnswer={handleAnswer}
            progress={`${currentQuestionIndex + 1} / ${questionsWithOptions.length}`}
          />
        )}

        {isFinished && selectedQuestionnaire && (
          <QuestionnaireResults
            totalScore={totalScore}
            levels={selectedQuestionnaire.levels || []}
            lang={lang}
            handleSendResults={handleSendResults}
          />
        )}
      </Paper>
    </Container>
  );
};
