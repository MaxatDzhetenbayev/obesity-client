import { Box, Container, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { EditText } from "../components/EditText/EditText";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useEffect } from "react";

export const FactsPage = () => {
  const { fact } = useParams();
  const { t, i18n } = useTranslation();
  const { language } = i18n;
  const [factContent, setFactContent] = React.useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    const fetchFact = async () => {
      try {
        const factCollection = collection(db, "facts");
        const factQuery = query(
          factCollection,
          where("lang", "==", language),
          where("tag", "==", fact)
        );

        const querySnapshot = await getDocs(factQuery);

        if (!querySnapshot.empty) {
          setFactContent(querySnapshot.docs[0].data());
        } else {
          console.log("No documents found");
        }
      } catch (error) {
        console.error("Error fetching fact:", error);
      }
    };

    fetchFact();
  }, [language, fact, db]);

  console.log(factContent);

  return (
    <Container sx={{ padding: "20px" }}>
      {/* <EditText/> */}
      <Typography
        mt="30px"
        sx={{ fontSize: "clamp(36px, 4vw, 42px)" }}
        variant="h3"
      >
        {factContent.title}
      </Typography>
      <Box
        sx={{ marginTop: "50px" }}
        dangerouslySetInnerHTML={{ __html: factContent.content }}
      />
    </Container>
  );
};
