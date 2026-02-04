/**
 * Скрипт заполнения Firestore тремя опросниками из tz.md.
 * Запуск из корня проекта: node scripts/seedQuestionnaires.js
 */
/* eslint-env node */
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, addDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { seedQuestionnairesData } from "../src/data/seedQuestionnaires.js";

const firebaseConfig = {
  apiKey: "AIzaSyApKv3T646LuVdCExxlSVt2dVzy0hcu8V8",
  authDomain: "obesity-da5c1.firebaseapp.com",
  projectId: "obesity-da5c1",
  storageBucket: "obesity-da5c1.appspot.com",
  messagingSenderId: "494870818911",
  appId: "1:494870818911:web:03c32ce652b05c27c42bea",
  measurementId: "G-FBC516W4VW",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function runSeed() {
  console.log("Начало заполнения опросников...\n");

  for (const q of seedQuestionnairesData) {
    const { id, title_ru, title_kz, description_ru, description_kz, levels, questions: questionsList } = q;

    console.log(`Опросник: ${title_ru.slice(0, 50)}...`);

    // Удаляем старые вопросы и их варианты ответов (идемпотентность при повторном запуске)
    const existingQuestionsSnap = await getDocs(query(collection(db, "questions"), where("questionnaireId", "==", id)));
    const existingQuestionIds = existingQuestionsSnap.docs.map((d) => d.id);
    for (const questionId of existingQuestionIds) {
      const optionsSnap = await getDocs(query(collection(db, "answer_options"), where("questionId", "==", questionId)));
      for (const optDoc of optionsSnap.docs) {
        await deleteDoc(doc(db, "answer_options", optDoc.id));
      }
      await deleteDoc(doc(db, "questions", questionId));
    }
    if (existingQuestionIds.length > 0) {
      console.log(`  Удалено старых вопросов: ${existingQuestionIds.length}`);
    }

    await setDoc(doc(db, "questionnaires", id), {
      title_ru,
      title_kz,
      description_ru: description_ru || "",
      description_kz: description_kz || "",
      levels: levels || [],
    });

    for (let i = 0; i < questionsList.length; i++) {
      const qu = questionsList[i];
      const questionRef = await addDoc(collection(db, "questions"), {
        questionnaireId: id,
        order: i,
        title_ru: qu.title_ru,
        title_kz: qu.title_kz,
      });

      const options = qu.options || [];
      for (let j = 0; j < options.length; j++) {
        const opt = options[j];
        await addDoc(collection(db, "answer_options"), {
          questionId: questionRef.id,
          order: j,
          text_ru: opt.text_ru,
          text_kz: opt.text_kz,
          points: opt.points ?? 0,
        });
      }
    }

    console.log(`  Создано вопросов: ${questionsList.length}`);
  }

  console.log("\nГотово. Опросники заполнены.");
  process.exit(0);
}

runSeed().catch((err) => {
  console.error(err);
  process.exit(1);
});
