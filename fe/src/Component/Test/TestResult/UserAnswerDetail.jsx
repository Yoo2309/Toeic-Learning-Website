import React, { useEffect, useState } from "react";
import "./UserAnswerDetail.css";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";
import HTMLReactParser from "html-react-parser";

function UserAnswerDetail({ toggleModal, userAnswer, index }) {
  const [unit, setUnit] = useState({});
  const [question, setQuestion] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const handleShowScript = () => {
    setShowScript(!showScript);
  };
  async function fetchTestUnit(idUnit) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/TestQuestionUnit/GetTestQuestionUnitById/${idUnit}`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response?.json();
        setUnit(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  async function getQuestion(idQuestion) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Question/GetQuestionByID/${idQuestion}`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response?.json();
        setQuestion(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  useEffect(() => {
    if (userAnswer.idQuestion) {
      getQuestion(userAnswer.idQuestion);
    }
  }, [userAnswer]);
  useEffect(() => {
    if (question.idUnit) {
      fetchTestUnit(question.idUnit);
    }
  }, [question]);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="answer-detail-modal">
      <div onClick={toggleModal} className="overlay"></div>
      <div className="answer-detail-content">
        <div className="vocabulary-close-btn">
          <svg
            onClick={toggleModal}
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="34"
            height="34"
            viewBox="0 0 512 512"
          >
            <path
              fill="#E04F5F"
              d="M504.1,256C504.1,119,393,7.9,256,7.9C119,7.9,7.9,119,7.9,256C7.9,393,119,504.1,256,504.1C393,504.1,504.1,393,504.1,256z"
            ></path>
            <path
              fill="#FFF"
              d="M285,256l72.5-84.2c7.9-9.2,6.9-23-2.3-31c-9.2-7.9-23-6.9-30.9,2.3L256,222.4l-68.2-79.2c-7.9-9.2-21.8-10.2-31-2.3c-9.2,7.9-10.2,21.8-2.3,31L227,256l-72.5,84.2c-7.9,9.2-6.9,23,2.3,31c4.1,3.6,9.2,5.3,14.3,5.3c6.2,0,12.3-2.6,16.6-7.6l68.2-79.2l68.2,79.2c4.3,5,10.5,7.6,16.6,7.6c5.1,0,10.2-1.7,14.3-5.3c9.2-7.9,10.2-21.8,2.3-31L285,256z"
            ></path>
          </svg>
        </div>
        <div className="answer-detail-wrapper">
          <div className="answer-detail-unit">
            {unit.image && (
              <img style={{ width: "40%" }} src={unit.image} alt="" />
            )}
            {unit.audio && <audio src={unit.audio} controls></audio>}
            {unit.paragraph && HTMLReactParser(String(unit.paragraph))}
            <div
              className="answer-detail-transcript"
              onClick={handleShowScript}
            >
              Hiển thị Transcript
              <i
                style={{ marginLeft: ".5rem" }}
                className="fa-solid fa-caret-down"
              ></i>
            </div>
            {showScript ? (
              <div>
                {unit.script && <div>{unit.script}</div>}
                {unit.translation && <div>{unit.translation}</div>}
              </div>
            ) : (
              <></>
            )}
          </div>
          <hr />
          <div>
            <div
              key={index}
              className="test-question"
              style={{ margin: "5px" }}
            >
              <div className="test-question-number">{index}</div>
              <div className="test-question-content">
                <div>{question.content}</div>
                <div className="test-choice-wrapper">
                  <div
                    className={`test-choice-option ${
                      question.answer === "1" ? "correct-option" : null
                    } ${
                      userAnswer.userChoice !== question.answer &&
                      userAnswer.userChoice === "1"
                        ? "wrong-option"
                        : null
                    }`}
                  >
                    A. {question.choice_1}
                  </div>
                  <div
                    className={`test-choice-option ${
                      question.answer === "2" ? "correct-option" : null
                    } ${
                      userAnswer.userChoice !== question.answer &&
                      userAnswer.userChoice === "2"
                        ? "wrong-option"
                        : null
                    }`}
                  >
                    B. {question.choice_2}
                  </div>
                  <div
                    className={`test-choice-option ${
                      question.answer === "3" ? "correct-option" : null
                    } ${
                      userAnswer.userChoice !== question.answer &&
                      userAnswer.userChoice === "3"
                        ? "wrong-option"
                        : null
                    }`}
                  >
                    C. {question.choice_3}
                  </div>
                  <div
                    className={`test-choice-option ${
                      question.answer === "4" ? "correct-option" : null
                    } ${
                      userAnswer.userChoice !== question.answer &&
                      userAnswer.userChoice === "4"
                        ? "wrong-option"
                        : null
                    }`}
                  >
                    D. {question.choice_4}
                  </div>
                </div>
                <div>
                  {userAnswer.userChoice === "-1" ? "Không chọn đáp án" : ""}
                </div>
              </div>
            </div>
            <div>{question.explaination && `=> ${question.explaination}`}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAnswerDetail;
