import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./TestMain.css";
import Loader from "../../Common/Loader/Loader.jsx";
import HTMLReactParser from "html-react-parser";
import TestResult from "./TestResult.jsx";
import { UserContext } from "../../../Context/UserContext.jsx";
import { toast } from "react-toastify";

function TestMain() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [parts, setParts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const [current_part, setCurrentPart] = useState(0);
  const [testdata, setTestdata] = useState([]);
  const [answers, setAnswers] = useState([]);

  let question_num = 0;

  if (!user.auth) {
    navigate("/login");
  }
  async function fetchTestData() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/Question/GetDoTest/${id}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`${errorData.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT, // Vị trí hiển thị
          autoClose: 5000, // Tự động đóng sau 3 giây
          closeOnClick: true, // Đóng khi click
          pauseOnHover: true, // Tạm dừng khi di chuột qua
          draggable: true, // Có thể kéo thông báo
        });
      }
      const data = await response.json();
      setTestdata(data.parts);
      setIsLoading(false);
    } catch (error) {
      toast.error(`${error}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }
  async function fetchParts() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/TestPart/GetAllTestParts`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`${errorData.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT, // Vị trí hiển thị
          autoClose: 5000, // Tự động đóng sau 3 giây
          closeOnClick: true, // Đóng khi click
          pauseOnHover: true, // Tạm dừng khi di chuột qua
          draggable: true, // Có thể kéo thông báo
        });
      }
      const data = await response.json();
      setParts(data);
    } catch (error) {
      toast.error(`${error}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }
  useEffect(() => {
    fetchParts();
    fetchTestData();
    window.scrollTo(0, 0);
  }, []);

  const handleOptionChange = (questionId, selectedOption) => {
    const existingAnswerIndex = answers.findIndex(
      (answer) => answer.questionId === questionId
    );

    if (existingAnswerIndex !== -1) {
      setAnswers((prevAnswers) => {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex].answer = selectedOption;
        return updatedAnswers;
      });
    } else {
      const newAnswer = {
        questionId: questionId,
        answer: selectedOption,
      };
      setAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
    }
  };
  async function SubmitTest() {
    try {
      const response = await fetch("http://localhost:3000/user-answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`${errorData.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error(`${error}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }
  function nextPart() {
    if (current_part < 7) {
      setCurrentPart(current_part + 1);
    } else if (current_part === 7) {
      SubmitTest();
      setIsSubmit(true);
    }
  }
  function previousPart() {
    if (current_part > 1) {
      setCurrentPart(current_part - 1);
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="test-container">
      {isSubmit ? (
        <div className="test-result">
          <TestResult />
        </div>
      ) : (
        <>
          <div className="tab-header">
            {parts &&
              parts.map((part, index) => {
                return (
                  <div
                    key={index}
                    className={`tab-item ${
                      current_part === index ? "tab-index-active" : null
                    }`}
                    onClick={() => setCurrentPart(index)}
                  >
                    {part.partName}
                  </div>
                );
              })}
          </div>
          <div className="tab-content">
            {testdata &&
              testdata.map((testpart, index) => {
                return (
                  <div
                    key={index}
                    className={
                      current_part === index ? "tab-pane-active" : "tab-pane"
                    }
                  >
                    {testpart &&
                      testpart.units.map((unit, index) => {
                        return (
                          <div key={index} className="test-unit-wrapper">
                            {unit.paragraph || unit.image ? (
                              <div className="test-unit-left">
                                <div className="test-img">
                                  {unit.image && (
                                    <img src={unit.image} alt={unit.image} />
                                  )}
                                </div>
                                <div className="test-paragraph">
                                  {unit.paragraph &&
                                    HTMLReactParser(String(unit.paragraph))}
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            <div className="test-unit-right">
                              <div className="test-unit-audio">
                                {unit.audio && (
                                  <audio src={unit.audio} controls></audio>
                                )}
                              </div>
                              {unit &&
                                unit.questions.map((question_item, index) => {
                                  question_num++;
                                  return (
                                    <div key={index} className="test-question">
                                      <div className="test-question-number">
                                        {question_num}
                                      </div>
                                      <div className="test-question-content">
                                        {question_item.content}

                                        <div className="test-choice-wrapper">
                                          <div className="test-choice-option">
                                            <input
                                              type="radio"
                                              name={`question_${question_item.id}`}
                                              onChange={() =>
                                                handleOptionChange(
                                                  question_item.id,
                                                  1
                                                )
                                              }
                                            />
                                            A. {question_item.choice_1}
                                          </div>
                                          <div
                                            key={index}
                                            className="test-choice-option"
                                          >
                                            <input
                                              type="radio"
                                              name={`question_${question_item.id}`}
                                              onChange={() =>
                                                handleOptionChange(
                                                  question_item.id,
                                                  2
                                                )
                                              }
                                            />
                                            B. {question_item.choice_2}
                                          </div>
                                          <div
                                            key={index}
                                            className="test-choice-option"
                                          >
                                            <input
                                              type="radio"
                                              name={`question_${question_item.id}`}
                                              onChange={() =>
                                                handleOptionChange(
                                                  question_item.id,
                                                  3
                                                )
                                              }
                                            />
                                            C. {question_item.choice_3}
                                          </div>
                                          <div
                                            key={index}
                                            className="test-choice-option"
                                          >
                                            <input
                                              type="radio"
                                              name={`question_${question_item.id}`}
                                              onChange={() =>
                                                handleOptionChange(
                                                  question_item.id,
                                                  4
                                                )
                                              }
                                            />
                                            D. {question_item.choice_4}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            <div className="question-button">
              <input
                type="button"
                value="Previous"
                className="previous-button"
                onClick={previousPart}
              />
              <input
                type="button"
                value={current_part === 7 ? "Done" : "Next"}
                className="next-button"
                onClick={nextPart}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TestMain;
