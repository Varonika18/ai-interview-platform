import React, { useState } from "react";
import axios from "axios";

import QuestionCard from "../components/QuestionCard";
import AnswerBox from "../components/AnswerBox";
import ScoreCard from "../components/ScoreCard";

function InterviewPage() {

  const question = "Explain the difference between stack and queue.";

  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(null);

  const submitAnswer = async () => {

    try {
      const res = await axios.post("http://127.0.0.1:8000/evaluate", {
        answer: answer
      });

      setScore(res.data.score);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{
      maxWidth: "800px",
      margin: "40px auto",
      padding: "20px"
    }}>
      
      <QuestionCard question={question} />

      <AnswerBox
        answer={answer}
        setAnswer={setAnswer}
        submitAnswer={submitAnswer}
      />

      <ScoreCard score={score} />

    </div>
  );
}

export default InterviewPage;