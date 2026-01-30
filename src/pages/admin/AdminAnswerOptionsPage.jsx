import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { collection, getDocs, query, where, doc, setDoc, deleteDoc, addDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export const AdminAnswerOptionsPage = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ order: 0, text_ru: "", text_kz: "", points: 0 });

  const loadQuestion = async () => {
    if (!questionId) return;
    const d = await getDoc(doc(db, "questions", questionId));
    setQuestion(d.exists() ? { id: d.id, ...d.data() } : null);
  };

  const load = async () => {
    if (!questionId) return;
    const q = query(collection(db, "answer_options"), where("questionId", "==", questionId));
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    setList(items);
  };

  useEffect(() => {
    loadQuestion();
  }, [questionId]);

  useEffect(() => {
    load();
  }, [questionId]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ order: list.length, text_ru: "", text_kz: "", points: 0 });
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      order: item.order ?? 0,
      text_ru: item.text_ru ?? "",
      text_kz: item.text_kz ?? "",
      points: item.points ?? item.points_ru ?? item.points_kz ?? 0,
    });
    setOpen(true);
  };

  const save = async () => {
    const payload = {
      questionId,
      order: Number(form.order) ?? 0,
      text_ru: form.text_ru.trim(),
      text_kz: form.text_kz.trim(),
      points: Number(form.points) ?? 0,
    };
    if (editingId) {
      await setDoc(doc(db, "answer_options", editingId), payload, { merge: true });
    } else {
      await addDoc(collection(db, "answer_options"), payload);
    }
    setOpen(false);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Удалить вариант ответа?")) return;
    await deleteDoc(doc(db, "answer_options", id));
    load();
  };

  const moveUp = async (index) => {
    if (index <= 0) return;
    const curr = list[index];
    const prev = list[index - 1];
    const currOrder = curr.order ?? index;
    const prevOrder = prev.order ?? index - 1;
    await setDoc(doc(db, "answer_options", curr.id), { order: prevOrder }, { merge: true });
    await setDoc(doc(db, "answer_options", prev.id), { order: currOrder }, { merge: true });
    load();
  };

  const moveDown = async (index) => {
    if (index >= list.length - 1) return;
    const curr = list[index];
    const next = list[index + 1];
    const currOrder = curr.order ?? index;
    const nextOrder = next.order ?? index + 1;
    await setDoc(doc(db, "answer_options", curr.id), { order: nextOrder }, { merge: true });
    await setDoc(doc(db, "answer_options", next.id), { order: currOrder }, { merge: true });
    load();
  };

  if (!questionId) return <Typography>Нет ID вопроса</Typography>;
  if (!question) return <Typography>Вопрос не найден</Typography>;

  const questionnaireId = question.questionnaireId;

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/admin/questionnaires/${questionnaireId}/questions`)} sx={{ mb: 1 }}>
        К вопросам
      </Button>
      <Typography variant="h6" gutterBottom>
        Варианты ответов — вопрос: {(question.title_ru || question.title_kz || questionId).slice(0, 60)}…
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Связь: questionId = {questionId}
      </Typography>
      <Button variant="contained" onClick={openCreate} sx={{ mb: 2 }}>Добавить вариант</Button>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Порядок</TableCell>
            <TableCell>Текст (RU)</TableCell>
            <TableCell>Текст (KZ)</TableCell>
            <TableCell>Баллы</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell>
                {row.order}
                <IconButton size="small" onClick={() => moveUp(index)} disabled={index === 0} title="Поднять" aria-label="Поднять">
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => moveDown(index)} disabled={index === list.length - 1} title="Опустить" aria-label="Опустить">
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
              </TableCell>
              <TableCell sx={{ maxWidth: 180 }}>{row.text_ru || "—"}</TableCell>
              <TableCell sx={{ maxWidth: 180 }}>{row.text_kz || "—"}</TableCell>
              <TableCell>{row.points ?? row.points_ru ?? row.points_kz ?? 0}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => openEdit(row)}><EditIcon /></IconButton>
                <IconButton size="small" onClick={() => remove(row.id)}><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Редактировать вариант" : "Новый вариант ответа"}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">questionId: {questionId}</Typography>
          <TextField fullWidth label="Текст (RU)" value={form.text_ru} onChange={(e) => setForm((f) => ({ ...f, text_ru: e.target.value }))} margin="dense" />
          <TextField fullWidth label="Текст (KZ)" value={form.text_kz} onChange={(e) => setForm((f) => ({ ...f, text_kz: e.target.value }))} margin="dense" />
          <TextField type="number" inputProps={{ min: 0, max: 4 }} label="Баллы" value={form.points} onChange={(e) => setForm((f) => ({ ...f, points: e.target.value }))} margin="dense" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={save}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
