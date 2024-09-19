import React, { useState, useEffect, useContext } from "react";
import QuizResult from "./QuizResult";
import "./Quiz.css";
import Loader from "../../../Common/Loader/Loader";
import { UserContext } from "../../../../Context/UserContext";

function Quiz({ quizData, quizTitle }) {
  const { user } = useContext(UserContext);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [clickedOption, setClickedOption] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [clickedList, setclickedList] = useState(
    Array.from({ length: quizData.length }, () => 0)
  );

  useEffect(() => {
    setShowResult(false);
    setCurrentQuestion(0);
    setClickedOption(0);
    setScore(0);
    setclickedList(Array.from({ length: quizData.length }, () => 0));
  }, [quizData]);
  useEffect(() => {
    if (!showResult && clickedOption !== 0) {
      setclickedList(
        clickedList.map((clickedItem, index) =>
          currentQuestion === index ? clickedOption : clickedItem
        )
      );
    }
  }, [clickedOption]);

  useEffect(() => {
    if (showResult) {
      const result = {
        total: currentQuestion + 1,
        score: score,
      };
      localStorage.setItem(
        `quizResult/userID=${user.idUser}/${quizData[0].idQuiz}`,
        JSON.stringify(result)
      );
    }
  }, [showResult]);

  const nextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setClickedOption(0);
    } else {
      updateScore();
      setShowResult(true);
    }
  };
  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setClickedOption(0);
    }
  };

  const updateScore = () => {
    let score = 0;
    for (let i = 0; i < clickedList.length && i < quizData.length; i++) {
      if (clickedList[i] == quizData[i].answer) {
        score += 1;
      }
    }
    setScore(score);
  };

  const resetAll = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setClickedOption(0);
    setScore(0);
    setclickedList(Array.from({ length: quizData.length }, () => 0));
    localStorage.removeItem(
      `quizResult/userID=${user.idUser}/${quizData[0].idQuiz}`
    );
  };

  if (quizData.length <= 0) {
    return <Loader />;
  }
  if (
    localStorage.getItem(
      `quizResult/userID=${user.idUser}/${quizData[0].idQuiz}`
    )
  ) {
    const quizResult = JSON.parse(
      localStorage.getItem(
        `quizResult/userID=${user.idUser}/${quizData[0].idQuiz}`
      )
    );

    return (
      <QuizResult
        score={quizResult.score}
        totalScore={quizResult.total}
        tryAgain={resetAll}
      ></QuizResult>
    );
  }
  return (
    <div className="quiz-wrapper">
      <div className="quiz-container">
        {showResult ? (
          <QuizResult
            score={score}
            totalScore={quizData.length}
            tryAgain={resetAll}
          ></QuizResult>
        ) : (
          <div className="quiz-main">
            <p className="heading-txt">{quizTitle}</p>
            <div className="question">
              <span className="question-number">{currentQuestion + 1}. </span>
              <span className="question-txt">
                {quizData[currentQuestion].content}
              </span>
            </div>
            <div className="option-container">
              <button
                className={`option-btn ${
                  (clickedOption === 1 &&
                    quizData[currentQuestion].answer !== 1) ||
                  (clickedList[currentQuestion] === 1 &&
                    quizData[currentQuestion].answer !== 1)
                    ? "wrong-option"
                    : null
                } ${
                  (clickedOption !== 0 &&
                    quizData[currentQuestion].answer === 1) ||
                  (clickedList[currentQuestion] !== 0 &&
                    quizData[currentQuestion].answer == 1)
                    ? "correct-option"
                    : null
                }`}
                onClick={() => {
                  if (!clickedList[currentQuestion]) {
                    setClickedOption(1);
                  }
                }}
              >
                {quizData[currentQuestion].choice_1}
              </button>
              <button
                className={`option-btn ${
                  (clickedOption === 2 &&
                    quizData[currentQuestion].answer !== 2) ||
                  (clickedList[currentQuestion] === 2 &&
                    quizData[currentQuestion].answer !== 2)
                    ? "wrong-option"
                    : null
                } ${
                  (clickedOption != 0 &&
                    quizData[currentQuestion].answer == 2) ||
                  (clickedList[currentQuestion] !== 0 &&
                    quizData[currentQuestion].answer == 2)
                    ? "correct-option"
                    : null
                }`}
                onClick={() => {
                  if (!clickedList[currentQuestion]) {
                    setClickedOption(2);
                  }
                }}
              >
                {quizData[currentQuestion].choice_2}
              </button>
              <button
                className={`option-btn ${
                  (clickedOption === 3 &&
                    quizData[currentQuestion].answer !== 3) ||
                  (clickedList[currentQuestion] === 3 &&
                    quizData[currentQuestion].answer !== 3)
                    ? "wrong-option"
                    : null
                } ${
                  (clickedOption != 0 &&
                    quizData[currentQuestion].answer == 3) ||
                  (clickedList[currentQuestion] !== 0 &&
                    quizData[currentQuestion].answer == 3)
                    ? "correct-option"
                    : null
                }`}
                onClick={() => {
                  if (!clickedList[currentQuestion]) {
                    setClickedOption(3);
                  }
                }}
              >
                {quizData[currentQuestion].choice_3}
              </button>
              <button
                className={`option-btn ${
                  (clickedOption === 4 &&
                    quizData[currentQuestion].answer !== 4) ||
                  (clickedList[currentQuestion] === 4 &&
                    quizData[currentQuestion].answer !== 4)
                    ? "wrong-option"
                    : null
                } ${
                  (clickedOption != 0 &&
                    quizData[currentQuestion].answer == 4) ||
                  (clickedList[currentQuestion] !== 0 &&
                    quizData[currentQuestion].answer == 4)
                    ? "correct-option"
                    : null
                }`}
                onClick={() => {
                  if (!clickedList[currentQuestion]) {
                    setClickedOption(4);
                  }
                }}
              >
                {quizData[currentQuestion].choice_4}
              </button>
            </div>
            <div
              className={`question-explaination ${
                clickedOption == 0 && clickedList[currentQuestion] == 0
                  ? "question-explaination-hide"
                  : null
              }`}
            >
              {quizData[currentQuestion].explaination}
            </div>
            <div className="quiz-button">
              <input
                type="button"
                value="Previous"
                className="previous-button"
                onClick={previousQuestion}
              />
              <input
                type="button"
                value={currentQuestion == quizData.length - 1 ? "Done" : "Next"}
                className="next-button"
                onClick={nextQuestion}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
