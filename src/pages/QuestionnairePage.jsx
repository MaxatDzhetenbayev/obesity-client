import { useState } from "react";
import { Container } from "../components/UI/Container/Container";


const questions = [
  {}
]

export const QuestionnairePage = () => {

  const [userInfo, setUserInfo] = useState({
    name: "",
    age: 0,
  })

  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  return <Container>


  </Container>;
};

