import React, { useEffect } from "react";
import styles from "./BaseLayout.module.css";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "../../components/Header/Header";
import { Container } from "@mui/material";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
export const BaseLayout = () => {
  const { t } = useTranslation();

  const handleSetUserVisit = async () => {
    const today = new Date().toLocaleDateString();
    const visitCollectionRef = collection(db, "visits");
    const visitQuery = query(visitCollectionRef, where('date', '==', today));

    const querySnapshot = await getDocs(visitQuery);

    if (querySnapshot.empty) {
      await setDoc(doc(db, "visits", today), { date: today, visitCount: 1 });
      return;
    } else {
      const visitDoc = querySnapshot.docs[0];
      const visitDocRef = doc(db, "visits", visitDoc.id);
      await setDoc(visitDocRef, { visitCount: +visitDoc.data().visitCount + 1 }, { merge: true });
    }
  }

  useEffect(() => {
    handleSetUserVisit()
  }, [])




  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{<Outlet />}</main>
      <footer class={styles.footer}>
        <Container>
          <section class={styles.footer__col}>
            <p class={styles.footer__text}>{t("footer.text")}</p>
            <p class={styles.footer__right}>{t("footer.all_rights")}</p>
          </section>
        </Container>
      </footer>
    </div>
  );
};
