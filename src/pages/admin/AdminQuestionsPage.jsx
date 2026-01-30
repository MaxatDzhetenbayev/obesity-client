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

export const AdminQuestionsPage = () => {
  const { questionnaireId } = useParams();
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = useState(null);
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ order: 0, title_ru: "", title_kz: "" });

  const loadQuestionnaire = async () => {
    if (!questionnaireId) return;
    const d = await getDoc(doc(db, "questionnaires", questionnaireId));
    setQuestionnaire(d.exists() ? { id: d.id, ...d.data() } : null);
  };

  const load = async () => {
    if (!questionnaireId) return;
    const q = query(collection(db, "questions"), where("questionnaireId", "==", questionnaireId));
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    setList(items);
  };

  useEffect(() => {
    loadQuestionnaire();
  }, [questionnaireId]);

  useEffect(() => {
    load();
  }, [questionnaireId]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ order: list.length, title_ru: "", title_kz: "" });
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      order: item.order ?? 0,
      title_ru: item.title_ru ?? "",
      title_kz: item.title_kz ?? "",
    });
    setOpen(true);
  };

  const save = async () => {
    const payload = {
      questionnaireId,
      order: Number(form.order) ?? 0,
      title_ru: form.title_ru.trim(),
      title_kz: form.title_kz.trim(),
    };
    if (editingId) {
      await setDoc(doc(db, "questions", editingId), payload, { merge: true });
    } else {
      await addDoc(collection(db, "questions"), payload);
    }
    setOpen(false);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Удалить вопрос? Варианты ответов не удалятся автоматически.")) return;
    await deleteDoc(doc(db, "questions", id));
    load();
  };

  const moveUp = async (index) => {
    if (index <= 0) return;
    const curr = list[index];
    const prev = list[index - 1];
    const currOrder = curr.order ?? index;
    const prevOrder = prev.order ?? index - 1;
    await setDoc(doc(db, "questions", curr.id), { order: prevOrder }, { merge: true });
    await setDoc(doc(db, "questions", prev.id), { order: currOrder }, { merge: true });
    load();
  };

  const moveDown = async (index) => {
    if (index >= list.length - 1) return;
    const curr = list[index];
    const next = list[index + 1];
    const currOrder = curr.order ?? index;
    const nextOrder = next.order ?? index + 1;
    await setDoc(doc(db, "questions", curr.id), { order: nextOrder }, { merge: true });
    await setDoc(doc(db, "questions", next.id), { order: currOrder }, { merge: true });
    load();
  };

  if (!questionnaireId) return <Typography>Нет ID опросника</Typography>;
  if (!questionnaire) return <Typography>Опросник не найден</Typography>;

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/admin/questionnaires")} sx={{ mb: 1 }}>
        К опросникам
      </Button>
      <Typography variant="h6" gutterBottom>
        Вопросы — опросник: {questionnaire.title_ru || questionnaire.title_kz || questionnaireId}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Связь: questionnaireId = {questionnaireId}
      </Typography>
      <Button variant="contained" onClick={openCreate} sx={{ mb: 2 }}>Добавить вопрос</Button>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Порядок</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Вопрос (RU)</TableCell>
            <TableCell>Вопрос (KZ)</TableCell>
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
              <TableCell>{row.id}</TableCell>
              <TableCell sx={{ maxWidth: 200 }}>{row.title_ru || "—"}</TableCell>
              <TableCell sx={{ maxWidth: 200 }}>{row.title_kz || "—"}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => navigate(`/admin/questions/${row.id}/options`)} title="Варианты ответов">
                  Варианты
                </IconButton>
                <IconButton size="small" onClick={() => openEdit(row)}><EditIcon /></IconButton>
                <IconButton size="small" onClick={() => remove(row.id)}><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Редактировать вопрос" : "Новый вопрос"}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">questionnaireId: {questionnaireId}</Typography>
          <TextField fullWidth multiline label="Текст вопроса (RU)" value={form.title_ru} onChange={(e) => setForm((f) => ({ ...f, title_ru: e.target.value }))} margin="dense" />
          <TextField fullWidth multiline label="Текст вопроса (KZ)" value={form.title_kz} onChange={(e) => setForm((f) => ({ ...f, title_kz: e.target.value }))} margin="dense" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={save}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
