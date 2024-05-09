import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./i18n";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { BaseLayout } from "./layouts/BaseLayout/BaseLayout.jsx";
import { MainPage } from "./pages/MainPage.jsx";
import { QuestionnairePage } from "./pages/QuestionnairePage.jsx";
import { CalculatorPage } from "./pages/CalculatorPage.jsx";
import { FaqPage } from "./pages/FaqPage.jsx";
import  './firebaseConfig.js'

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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
