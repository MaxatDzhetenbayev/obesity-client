import { useState } from "react";
import { useTranslation } from "react-i18next";
import { QuestionnaireBlank } from "../components/Questionnaire/QuestionnaireBlank/QuestionnaireBlank";
import { Container, Paper } from "@mui/material";
import { QuestionnaireTest } from "../components/Questionnaire/QuestionnaireTest/QuestionnaireTest";
import { QuestionnaireResults } from "../components/Questionnaire/QuestionnaireResults/QuestionnaireResults";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { db } from "../firebaseConfig";
import { questionsData } from "../constants";

const stagesList = ["knowledge", "attitude", "action"];

export const QuestionnairePage = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    age: "",
    nationality: "",
    height: "",
    weight: "",
    pulse: "",
  });

  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [stages, setStages] = useState("knowledge");
  const {
    i18n: { language },
  } = useTranslation();

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState([]);
  console.log(answers);

  const handleSetAnswer = (question, answer) => {
    setAnswers((prev) => [...prev, { question, answer }]);
  };

  const handleStart = (e) => {
    e.preventDefault();
    setIsStarted(true);
  };

  const handleNextQuestion = (question, answer) => {
    handleSetAnswer(question, answer);
    if (currentQuestion === questionsData[stages].questions.length - 1) {
      if (stagesList.indexOf(stages) === stagesList.length - 1) {
        setIsFinished(true);
      } else {
        setStages(stagesList[stagesList.indexOf(stages) + 1]);
        setCurrentQuestion(0);
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSendResults = async () => {
    try {
      const docId = uuid();
      const docRef = doc(db, "results", docId);

      await setDoc(docRef, { ...userInfo, answers });
      console.log("Результат успешно отправлен", docRef.id);
    } catch (error) {
      console.error("Ошибка при отправлении результата: ", error);
    }

    // navigate("/");
  };

  // Функция для получения правильного языка
  const getTranslatedContent = (content) => {
    return content[language] || content["ru"]; // На случай, если нет перевода, используем русский по умолчанию
  };

  return (
    <Container>
      <Paper elevation={2} sx={{ padding: "20px 10px", marginTop: "40px" }}>
        {!isStarted && (
          <div>
            <QuestionnaireBlank
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              handleStart={handleStart}
            />
          </div>
        )}
        {isStarted && !isFinished && (
          <QuestionnaireTest
            stage={getTranslatedContent(questionsData[stages].title)} // Переводим заголовок
            currentQuestion={{
              ...questionsData[stages].questions[currentQuestion],
              title: questionsData[stages].questions[currentQuestion].title,
            }}
            nextQuestion={handleNextQuestion}
          />
        )}
        {isFinished && (
          <QuestionnaireResults handleSendResults={handleSendResults} />
        )}
      </Paper>
    </Container>
  );
};
