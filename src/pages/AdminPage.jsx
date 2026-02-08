import { Button, Container, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
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
import { BLANK_FIELD_KEYS, BLANK_FIELD_LABELS_RU, BLANK_FIELD_VALUE_LABELS_RU } from "../constants/blankForm";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const AdminPage = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState("");
  const [results, setResults] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answerOptionsMap, setAnswerOptionsMap] = useState({});
  const [visitData, setVisitData] = useState([]);
  const [visitPeriod, setVisitPeriod] = useState("week"); // week | month | 3months | year | all

  const parseVisitDate = (dateStr) => {
    if (!dateStr) return null;
    const d = String(dateStr).trim();
    const parts = d.split(/[.\-/]/).map((p) => parseInt(p, 10));
    if (parts.length >= 3) {
      const [a, b, c] = parts;
      if (d.includes(".")) return new Date(c, b - 1, a);
      if (d.includes("-")) return new Date(a, b - 1, c);
      return new Date(b, a - 1, c);
    }
    const parsed = Date.parse(d);
    return isNaN(parsed) ? null : new Date(parsed);
  };

  const getFilteredVisitData = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let from = new Date(0);
    if (visitPeriod === "week") {
      from = new Date(today);
      from.setDate(from.getDate() - 7);
    } else if (visitPeriod === "month") {
      from = new Date(today);
      from.setMonth(from.getMonth() - 1);
    } else if (visitPeriod === "3months") {
      from = new Date(today);
      from.setMonth(from.getMonth() - 3);
    } else if (visitPeriod === "year") {
      from = new Date(today);
      from.setFullYear(from.getFullYear() - 1);
    }
    const filtered = visitData.filter((item) => {
      const date = parseVisitDate(item.date);
      if (!date) return false;
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      return dayStart >= from && dayStart <= today;
    });
    return filtered.sort((a, b) => {
      const da = parseVisitDate(a.date)?.getTime() ?? 0;
      const db = parseVisitDate(b.date)?.getTime() ?? 0;
      return da - db;
    });
  };

  useEffect(() => {
    const load = async () => {
      const qSnap = await getDocs(collection(db, "questionnaires"));
      const items = qSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      items.sort((a, b) => (a.order ?? 999999) - (b.order ?? 999999));
      setQuestionnaires(items);
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
          const raw = r[key] ?? "";
          const valueMap = BLANK_FIELD_VALUE_LABELS_RU[key];
          const cellValue = valueMap && raw && valueMap[raw] != null ? valueMap[raw] : raw;
          row[BLANK_FIELD_LABELS_RU[key] ?? key] = cellValue;
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
  const filteredVisits = getFilteredVisitData();
  const barData = {
    labels: filteredVisits.map((item) => item.date),
    datasets: [
      {
        label: "Dataset 1",
        data: filteredVisits.map((item) => item.visitCount),
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
      {selectedQuestionnaireId && results.length === 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Нет сохранённых результатов по этому опроснику. Кнопка станет активной после того, как пользователи пройдут опрос и отправят ответы.
        </Typography>
      )}
      <FormControl sx={{ minWidth: 200, display: "block", mt: 3, mb: 1 }} size="small">
        <InputLabel>Период статистики посещений</InputLabel>
        <Select
          value={visitPeriod}
          label="Период статистики посещений"
          onChange={(e) => setVisitPeriod(e.target.value)}
        >
          <MenuItem value="week">Неделя</MenuItem>
          <MenuItem value="month">Месяц</MenuItem>
          <MenuItem value="3months">3 месяца</MenuItem>
          <MenuItem value="year">Год</MenuItem>
          <MenuItem value="all">Весь период</MenuItem>
        </Select>
      </FormControl>
      <Bar options={options} data={barData} sx={{ mt: 2 }} />
    </Container>
  );
};
