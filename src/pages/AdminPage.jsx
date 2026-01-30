import { Button, Container, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { utils, writeFile } from "xlsx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { BLANK_FIELD_KEYS, BLANK_FIELD_LABELS_RU } from "../constants/blankForm";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const AdminPage = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState("");
  const [results, setResults] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answerOptionsMap, setAnswerOptionsMap] = useState({});
  const [visitData, setVisitData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const qSnap = await getDocs(collection(db, "questionnaires"));
      setQuestionnaires(qSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedQuestionnaireId) {
      setResults([]);
      setQuestions([]);
      return;
    }
    const load = async () => {
      const qRes = query(
        collection(db, "results"),
        where("questionnaireId", "==", selectedQuestionnaireId)
      );
      const resSnap = await getDocs(qRes);
      const resultsList = resSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setResults(resultsList);

      const qQuest = query(
        collection(db, "questions"),
        where("questionnaireId", "==", selectedQuestionnaireId)
      );
      const questSnap = await getDocs(qQuest);
      const questionsList = questSnap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setQuestions(questionsList);

      const optsSnap = await getDocs(collection(db, "answer_options"));
      const opts = {};
      optsSnap.docs.forEach((d) => {
        const o = { id: d.id, ...d.data() };
        if (!opts[o.questionId]) opts[o.questionId] = {};
        opts[o.questionId][o.id] = o;
      });
      setAnswerOptionsMap(opts);
    };
    load();
  }, [selectedQuestionnaireId]);

  const handleDownload = async () => {
    if (!selectedQuestionnaireId || results.length === 0) return;
    const questionnaire = questionnaires.find((q) => q.id === selectedQuestionnaireId);
    const lang = "ru";

    const questionTitles = {};
    questions.forEach((q) => {
      questionTitles[q.id] = q[`title_${lang}`] ?? q.title_ru ?? q.title_kz ?? q.id;
    });

    const rows = await Promise.all(
      results.map(async (r) => {
        const row = {};
        BLANK_FIELD_KEYS.forEach((key) => {
          row[BLANK_FIELD_LABELS_RU[key] ?? key] = r[key] ?? "";
        });
        row["Опросник"] = questionnaire ? (questionnaire[`title_${lang}`] ?? questionnaire.title_ru ?? questionnaire.title_kz) : selectedQuestionnaireId;
        const answersSnap = await getDocs(
          query(collection(db, "result_answers"), where("resultId", "==", r.id))
        );
        const answersByQuestion = {};
        answersSnap.docs.forEach((d) => {
          const a = d.data();
          answersByQuestion[a.questionId] = a.answerOptionId;
        });
        questions.forEach((q) => {
          const optId = answersByQuestion[q.id];
          const opts = answerOptionsMap[q.id] || {};
          const opt = optId ? opts[optId] : null;
          const text = opt ? (opt[`text_${lang}`] ?? opt.text_ru ?? opt.text_kz ?? "") : "";
          row[questionTitles[q.id] ?? q.id] = text;
        });
        row["Итоговый балл"] = r.totalScore ?? "";
        return row;
      })
    );

    const ws = utils.json_to_sheet(rows);
    const wb = utils.book_new();
    const sheetName = questionnaire ? (questionnaire.title_ru || "Data").slice(0, 31) : "Data";
    utils.book_append_sheet(wb, ws, sheetName);
    writeFile(wb, `Отчет_опросник_${selectedQuestionnaireId}.xlsx`);
  };

  const handleGetVisitsData = async () => {
    const visitCollectionRef = collection(db, "visits");
    const querySnapshot = await getDocs(visitCollectionRef);
    const visits = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setVisitData(visits);
  };

  useEffect(() => {
    handleGetVisitsData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Статистика посещения пользователей" },
    },
  };
  const barData = {
    labels: visitData.map((item) => item.date),
    datasets: [
      {
        label: "Dataset 1",
        data: visitData.map((item) => item.visitCount),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <Container sx={{ marginTop: "40px" }}>
      <FormControl sx={{ minWidth: 320, mb: 2 }} size="small">
        <InputLabel>Опросник</InputLabel>
        <Select
          value={selectedQuestionnaireId}
          label="Опросник"
          onChange={(e) => setSelectedQuestionnaireId(e.target.value)}
        >
          <MenuItem value="">
            <em>Выберите опросник</em>
          </MenuItem>
          {questionnaires.map((q) => (
            <MenuItem key={q.id} value={q.id}>
              {q.title_ru ?? q.title_kz ?? q.id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <br />
      <Button
        onClick={handleDownload}
        disabled={!selectedQuestionnaireId || results.length === 0}
      >
        Скачать результаты выбранного опросника
      </Button>
      <Bar options={options} data={barData} sx={{ mt: 4 }} />
    </Container>
  );
};
