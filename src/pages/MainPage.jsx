import React from "react";
import { Welcome } from "../components/Welcome/Welcome";
import { ObesityInfo } from "../components/ObesityInfo/ObesityInfo";
import { TestBanner } from "../components/TestBanner/TestBanner";
import { ObesityDegree } from "../components/ObesityDegree/ObesityDegree";

export const MainPage = () => {
  return (
    <>
      <Welcome />
      <ObesityInfo />
      <TestBanner />
      <ObesityDegree />
    </>
  );
};
