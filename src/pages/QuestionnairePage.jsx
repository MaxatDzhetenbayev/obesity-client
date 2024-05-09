import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { utils, writeFile } from "xlsx";
import { QuestionnaireBlank } from "../components/Questionnaire/QuestionnaireBlank/QuestionnaireBlank";
import { Button, Container, Paper } from "@mui/material";
import { QuestionnaireTest } from "../components/Questionnaire/QuestionnaireTest/QuestionnaireTest";
import { QuestionnaireResults } from "../components/Questionnaire/QuestionnaireResults/QuestionnaireResults";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { db } from "../firebaseConfig";
const knowledgeOption = [
  "Определенно",
  "Вероятно",
  "Скорее всего нет",
  "Определенно нет",
  "Не знаю",
];
const confidenceOption = [
  "Чрезмерно уверен(а)",
  "Очень уверен(а)",
  "Умеренно уверен(а)",
  "Слегка уверен (а)",
  "Совсем не уверен (а)",
];
const contentmentOption = [
  "Чрезмерно уверен(а)",
  "Удовлетворен (а)",
  "Ни То, ни другое",
  "Не удовлетворен(а)",
  "Очень недоволен (а)",
];
const timeOption = ["Всегда", "Очень часто", "Иногда", "Редко", "Никогда"];
const timeOption_1 = [
  "Никогда",
  "Редко",
  "1‑2 раза в неделю",
  "2‑3 в неделю",
  "Больше 3 раз в неделю",
];
const frequencyOption = [
  "Все 7 дней в неделю",
  "5-6 раз в неделю",
  "3-4 раза в неделю",
  "Раз в неделю",
  "Никогда",
];

const questionsData = {
  knowledge: {
    title: "Знание",
    questions: [
      {
        title:
          "Ожирение можно оценить  с помощью ИМТ (Индекс массы тела — это соотношение роста и веса)",
        options: knowledgeOption,
      },
      {
        title:
          "Накопление жира на животе более опасно, чем общее распределение жира по всему телу, с точки зрения увеличения риска развития сердечно-сосудистых проблем.",
        options: knowledgeOption,
      },
      {
        title:
          "Ожирение связано с сердечными заболеваниями, такими как сердечный приступ, повышенное кровяное давление, повышенный уровень холестерина и т.д.",
        options: knowledgeOption,
      },
      {
        title: "Ожирение связано с диабетом",
        options: knowledgeOption,
      },
      {
        title: "Ожирение связано с остеоартритом (проблемами с суставами)",
        options: knowledgeOption,
      },
      {
        title: "Голодание / пропуск приема пищи - хороший способ похудеть",
        options: knowledgeOption,
      },
      {
        title:
          "Избыточное потребление сахара в виде сладостей; дополнительный сахар в кофе/чае/молоке и т. д. является важным фактором риска, который приводит к избыточному весу/ожирению",
        options: knowledgeOption,
      },
      {
        title:
          "Частое употребление сахаросодержащих напитков (пепси/кока-кола/подслащенные соки и т. д.) приводит к набору веса",
        options: knowledgeOption,
      },
      {
        title:
          "Частое употребление жареной пищи (самса, картофель фри, вафли и т. д.) приводит к набору веса",
        options: knowledgeOption,
      },
      {
        title:
          "Чрезмерное потребление рафинированных продуктов (хлеб / печенье и т.д.) приводит к увеличению веса",
        options: knowledgeOption,
      },
      {
        title:
          "Постоянный стресс является фактором риска, который приводит к увеличению веса",
        options: knowledgeOption,
      },
      {
        title:
          "Регулярные аэробные упражнения, такие как бег, бег трусцой, плавание, занятия спортом на открытом воздухе и т.д., являются важным способом похудения",
        options: knowledgeOption,
      },
      {
        title:
          "Регулярные аэробные упражнения, такие как бег, бег трусцой, плавание, занятия спортом на открытом воздухе и т.д., являются важным способом похудения",
        options: knowledgeOption,
      },
      {
        title:
          "Препараты против ожирения являются предпочтительным способом снижения веса",
        options: knowledgeOption,
      },
      {
        title: "Заменители пищи/добавки — здоровый способ похудеть",
        options: knowledgeOption,
      },
    ],
  },
  attitude: {
    title: "Отношение",
    questions: [
      {
        title: "Я считаю, что у меня есть ожирение",
        options: knowledgeOption,
      },
      {
        title: "Считаю, что мой нынешний вес вреден для моего здоровья",
        options: knowledgeOption,
      },
      {
        title: "Я мотивирован (а) похудеть",
        options: knowledgeOption,
      },
      {
        title: "Мне трудно удерживать свой вес на одном уровне",
        options: knowledgeOption,
      },
      {
        title:
          "Я считаю регулярный прием завтрака является частью здорового образа жизни",
        options: knowledgeOption,
      },
      {
        title:
          "Я считаю, что небольшие и частые приемы пищи помогают в снижении веса",
        options: knowledgeOption,
      },
      {
        title:
          "Я уверен(а), что смог(ла) бы сократил количество сахара / сладостей в своем рационе",
        options: confidenceOption,
      },
      {
        title: "Я уверен (а), что могу не употреблять жареную пищу",
        options: confidenceOption,
      },
      {
        title:
          "Я уверен(а), что предпочел(а) бы салаты / низкокалорийные закуски вместо сладостей / жареной пищи / рафинированных продуктов в своем рационе",
        options: confidenceOption,
      },
      {
        title: "Я доволен(а) своим нынешним уровнем физической активности",
        options: contentmentOption,
      },
      {
        title:
          "Я уверен (а), что я бы занимался (лась) физическими упражнениями, такими как бег трусцой, езда на велосипеде, плавание, спортивные состязания или любая другая деятельность, которая делает меня здоровым",
        options: confidenceOption,
      },
      {
        title:
          "Я уверен(а), что могу заняться какой-нибудь домашней работой, когда есть свободное время",
        options: confidenceOption,
      },
      {
        title: "Я уверен, что воспользовался бы лестницей вместо лифта",
        options: confidenceOption,
      },
      {
        title: "Я уверен, что отправился бы в близлежащие места пешком",
        options: confidenceOption,
      },
      {
        title:
          "Я чувствую грусть/депрессию, учитывая, что у меня ожирение/избыточный вес",
        options: timeOption,
      },
    ],
  },
  action: {
    title: "Действие",
    questions: [
      {
        title: "Я добавляю дополнительный сахар в свой кофе / чай",
        options: timeOption,
      },
      {
        title: "Я ем сладкое после еды",
        options: timeOption,
      },
      {
        title: "Я использую помощников для своих домашних дел",
        options: timeOption,
      },
      {
        title: "Я ем в ответ на стресс",
        options: timeOption,
      },
      {
        title: "Я пью сладкие напитки",
        options: timeOption_1,
      },
      {
        title: "Я ем жареную пищу",
        options: timeOption_1,
      },
      {
        title:
          "Как часто Вы принимаете три основных и два дополнительных приема пищи в неделю?",
        options: frequencyOption,
      },
      {
        title:
          "Помимо трех основных и двух второстепенных приемов пищи, сколько перекусов вы обычно употребляете в день?",
        options: ["0", "1", "2", "3", "Более 3 раз"],
      },
      {
        title: "Я включаю фрукты / салаты в свой рацион",
        options: [
          "Чаще одного раза в день",
          "4-6 раз в неделю",
          "1-3 раза в неделю",
          "Один раз в 15 дней",
          "Никогда",
        ],
      },
      {
        title: "Как часто вы занимаетесь спортом?",
        options: [
          "Каждый день",
          "4-6 раз в неделю",
          "1-3 раза в неделю",
          "Один раз в месяц",
          "Никогда",
        ],
      },
      {
        title: "Как долго вы тренируетесь в день?",
        options: [
          "Никогда",
          "Меньше 15 минут",
          "15-30 минут",
          "30-60 минут",
          "Больше 60 минут",
        ],
      },
      {
        title:
          "Я консультируюсь со своим врачом / диетологом по вопросам снижения веса",
        options: knowledgeOption,
      },
      {
        title: "Какое из следующих утверждений лучше всего относится к вам?",
        options: [
          "В настоящее время я регулярно занимаюсь спортом и занимаюсь этим уже более 6 месяцев",
          "За последние 6 месяцев я начал(а) регулярно заниматься спортом",
          "В настоящее время я занимаюсь спортом, но не регулярно",
          "В настоящее время я не занимаюсь физическими упражнениями и намерен(а) начать регулярные физические упражнения в ближайшие 6 месяцев",
          "В настоящее время я не занимаюсь физическими упражнениями и не собираюсь начинать регулярные физические упражнения в ближайшие 6 месяцев",
        ],
      },
    ],
  },
};

const stagesList = ["knowledge", "attitude", "action"];

export const QuestionnairePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: "",
    age: "",
    nationality: "",
    height: "",
    weight: "",
    pulse: "",
  });

  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [stages, setStages] = useState("knowledge");

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState([]);

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
      console.error("Ошибка при отправлений результата: ", error);
    }

    navigate("/");
  };

  const [data, setData] = useState([]);
  const [result, setResult] = useState();

  const handleResultPreparation = () => {
    setResult(
      data.map(({ id, answers, ...user }) => {
        const answersSheet = {};
        answers.forEach((item) => {
          answersSheet[`${item.question}`] = item.answer;
        });

        return {
          ...{
            Имя: user.name,
            Возраст: user.age,
            Национальность: user.nationality,
            Рост: user.height,
            Вес: user.weight,
            Пульс: user.pulse,
          },
          ...answersSheet,
        };
      })
    );
  };

  const handleDownload = () => {
    const ws = utils.json_to_sheet(result);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFile(
      wb,
      "Отчет Опросника на тему «Медико - социальные аспекты профилактики избыточного веса и ожирения».xlsx"
    );
  };

  useEffect(() => {
    const getAllClientResults = async () => {
      const resultsCollectionRef = collection(db, "results");
      const querySnapshot = await getDocs(resultsCollectionRef);
      const results = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setData(results);
    };

    getAllClientResults();
  }, []);
  useEffect(() => {
    handleResultPreparation();
  }, [data]);

  return (
    <Container>
      <Paper elevation={2} sx={{ padding: "20px 10px", marginTop: "40px" }}>
        {!isStarted && (
          <div>
            <Button onClick={handleDownload}>Скачать</Button>
            <QuestionnaireBlank
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              handleStart={handleStart}
            />
          </div>
        )}
        {isStarted && !isFinished && (
          <QuestionnaireTest
            stage={questionsData[stages].title}
            currentQuestion={questionsData[stages].questions[currentQuestion]}
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
