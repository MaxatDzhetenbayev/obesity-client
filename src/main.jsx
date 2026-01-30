import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./i18n";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { BaseLayout } from "./layouts/BaseLayout/BaseLayout.jsx";
import { AdminLayout } from "./layouts/AdminLayout/AdminLayout.jsx";
import { MainPage } from "./pages/MainPage.jsx";
import { QuestionnairePage } from "./pages/QuestionnairePage.jsx";
import { CalculatorPage } from "./pages/CalculatorPage.jsx";
import { FaqPage } from "./pages/FaqPage.jsx";
import "./firebaseConfig.js";
import { FactsPage } from "./pages/FactsPage.jsx";
import { AdminPage } from "./pages/AdminPage.jsx";
import { AdminQuestionnairesPage } from "./pages/admin/AdminQuestionnairesPage.jsx";
import { AdminQuestionsPage } from "./pages/admin/AdminQuestionsPage.jsx";
import { AdminAnswerOptionsPage } from "./pages/admin/AdminAnswerOptionsPage.jsx";

const router = createBrowserRouter([
  {
    element: <BaseLayout />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/questionnaire",
        element: <QuestionnairePage />,
      },
      {
        path: "/calculator",
        element: <CalculatorPage />,
      },
      {
        path: "/faq",
        element: <FaqPage />,
      },
      {
        path: "/facts/:fact",
        element: <FactsPage />,
      },
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminPage /> },
          { path: "questionnaires", element: <AdminQuestionnairesPage /> },
          { path: "questionnaires/:questionnaireId/questions", element: <AdminQuestionsPage /> },
          { path: "questions/:questionId/options", element: <AdminAnswerOptionsPage /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
