import { Button, Container } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { useEffect } from "react";
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

export const AdminPage = () => {
  const [data, setData] = useState([]);
  const [result, setResult] = useState();

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

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
    handleResultPreparation();
  }, [data]);

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

  const [visitData, setVisitData] = useState([]);

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
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Статистика посещения пользователей",
      },
    },
  };

  const labels = visitData.map((item) => item.date);

  const barData = {
    labels,
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
      <Button onClick={handleDownload}>Скачать Результаты Опросника</Button>
      <Bar options={options} data={barData} />
    </Container>
  );
};
