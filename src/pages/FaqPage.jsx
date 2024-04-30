import React from "react";
import { Container } from "../components/UI/Container/Container";
import { motion } from "framer-motion";
import { FaqList } from "../components/FaqList/FaqList";

export const FaqPage = () => {
  return (
    <Container>
      <FaqList />
    </Container>
  );
};
