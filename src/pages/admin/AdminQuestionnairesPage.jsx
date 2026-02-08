import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const emptyQuestionnaire = () => ({
  customId: "",
  title_ru: "",
  title_kz: "",
  description_ru: "",
  description_kz: "",
  levels: [{ min: 0, max: 0, label_ru: "", label_kz: "" }],
});

export const AdminQuestionnairesPage = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyQuestionnaire());

  const load = async () => {
    const snap = await getDocs(collection(db, "questionnaires"));
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    items.sort((a, b) => (a.order ?? 999999) - (b.order ?? 999999));
    setList(items);
  };

  const moveOrder = async (index, direction) => {
    if (direction === "up" && index <= 0) return;
    if (direction === "down" && index >= list.length - 1) return;
    const otherIndex = direction === "up" ? index - 1 : index + 1;
    const a = list[index];
    const b = list[otherIndex];
    const orderA = a.order ?? 999999;
    const orderB = b.order ?? 999999;
    await setDoc(doc(db, "questionnaires", a.id), { order: orderB }, { merge: true });
    await setDoc(doc(db, "questionnaires", b.id), { order: orderA }, { merge: true });
    load();
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyQuestionnaire());
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      customId: "",
      title_ru: item.title_ru ?? "",
      title_kz: item.title_kz ?? "",
      description_ru: item.description_ru ?? "",
      description_kz: item.description_kz ?? "",
      levels: Array.isArray(item.levels) && item.levels.length
        ? item.levels.map((l) => ({ min: l.min ?? 0, max: l.max ?? 0, label_ru: l.label_ru ?? "", label_kz: l.label_kz ?? "" }))
        : [{ min: 0, max: 0, label_ru: "", label_kz: "" }],
    });
    setOpen(true);
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateLevel = (index, key, value) => {
    setForm((prev) => {
      const levels = [...(prev.levels || [])];
      levels[index] = { ...levels[index], [key]: value };
      return { ...prev, levels };
    });
  };

  const addLevel = () => {
    setForm((prev) => ({
      ...prev,
      levels: [...(prev.levels || []), { min: 0, max: 0, label_ru: "", label_kz: "" }],
    }));
  };

  const removeLevel = (index) => {
    setForm((prev) => ({
      ...prev,
      levels: prev.levels.filter((_, i) => i !== index),
    }));
  };

  const save = async () => {
    const maxOrder = list.length === 0 ? -1 : Math.max(...list.map((q) => q.order ?? -1));
    const payload = {
      title_ru: form.title_ru,
      title_kz: form.title_kz,
      description_ru: form.description_ru,
      description_kz: form.description_kz,
      order: editingId ? (list.find((q) => q.id === editingId)?.order ?? list.length) : maxOrder + 1,
      levels: (form.levels || []).map((l) => ({
        min: Number(l.min) ?? 0,
        max: Number(l.max) ?? 0,
        label_ru: String(l.label_ru ?? ""),
        label_kz: String(l.label_kz ?? ""),
      })),
    };
    if (editingId) {
      await setDoc(doc(db, "questionnaires", editingId), payload, { merge: true });
    } else if (form.customId && form.customId.trim()) {
      await setDoc(doc(db, "questionnaires", form.customId.trim()), payload);
    } else {
      await addDoc(collection(db, "questionnaires"), payload);
    }
    setOpen(false);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Удалить опросник? Вопросы и варианты ответов не удалятся автоматически.")) return;
    await deleteDoc(doc(db, "questionnaires", id));
    load();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Опросники</Typography>
      <Button variant="contained" onClick={openCreate} sx={{ mb: 2 }}>Добавить опросник</Button>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Место</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Название (RU)</TableCell>
            <TableCell>Название (KZ)</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell>
                <IconButton size="small" onClick={() => moveOrder(index, "up")} disabled={index === 0} title="Поднять">
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => moveOrder(index, "down")} disabled={index === list.length - 1} title="Опустить">
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
                <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                  {row.order ?? "—"}
                </Typography>
              </TableCell>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.title_ru || "—"}</TableCell>
              <TableCell>{row.title_kz || "—"}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => navigate(`/admin/questionnaires/${row.id}/questions`)} title="Вопросы">
                  Вопросы
                </IconButton>
                <IconButton size="small" onClick={() => openEdit(row)}><EditIcon /></IconButton>
                <IconButton size="small" onClick={() => remove(row.id)}><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Редактировать опросник" : "Новый опросник"}</DialogTitle>
        <DialogContent>
          {!editingId && (
            <TextField fullWidth label="ID документа (опционально, для связей)" value={form.customId} onChange={(e) => updateForm("customId", e.target.value)} margin="dense" placeholder="knowledge, attitude, physical" helperText="Латиница без пробелов. Если пусто — ID сгенерируется автоматически." />
          )}
          <TextField fullWidth label="Название (RU)" value={form.title_ru} onChange={(e) => updateForm("title_ru", e.target.value)} margin="dense" />
          <TextField fullWidth label="Название (KZ)" value={form.title_kz} onChange={(e) => updateForm("title_kz", e.target.value)} margin="dense" />
          <TextField fullWidth label="Описание (RU)" value={form.description_ru} onChange={(e) => updateForm("description_ru", e.target.value)} margin="dense" />
          <TextField fullWidth label="Описание (KZ)" value={form.description_kz} onChange={(e) => updateForm("description_kz", e.target.value)} margin="dense" />
          <Typography variant="subtitle2" sx={{ mt: 2 }}>Шкала уровней (min, max, подписи)</Typography>
          {(form.levels || []).map((lev, i) => (
            <Box key={i} sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
              <TextField type="number" size="small" label="min" value={lev.min} onChange={(e) => updateLevel(i, "min", e.target.value)} sx={{ width: 70 }} />
              <TextField type="number" size="small" label="max" value={lev.max} onChange={(e) => updateLevel(i, "max", e.target.value)} sx={{ width: 70 }} />
              <TextField size="small" label="label_ru" value={lev.label_ru} onChange={(e) => updateLevel(i, "label_ru", e.target.value)} sx={{ flex: 1 }} />
              <TextField size="small" label="label_kz" value={lev.label_kz} onChange={(e) => updateLevel(i, "label_kz", e.target.value)} sx={{ flex: 1 }} />
              <Button size="small" onClick={() => removeLevel(i)}>Удалить</Button>
            </Box>
          ))}
          <Button size="small" onClick={addLevel} sx={{ mt: 1 }}>+ Уровень</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={save}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
