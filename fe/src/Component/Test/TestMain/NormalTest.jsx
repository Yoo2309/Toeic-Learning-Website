import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import css from "./test-main.module.scss";
import Loader from "../../Common/Loader/Loader.jsx";
import HTMLReactParser from "html-react-parser";
import { UserContext } from "../../../Context/UserContext.jsx";
import { toast } from "react-toastify";
import { showSubmitWarning } from "../../Common/Alert/Alert.jsx";
import { useBeforeunload } from "react-beforeunload";

function NormalTest({ id }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [parts, setParts] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [current_part, setCurrentPart] = useState(0);
  const [current_question, setCurrentQuestion] = useState(0);

  const [testdata, setTestdata] = useState([]);
  const [testType, setTestType] = useState("");
  const [answers, setAnswers] = useState([]);

  let question_num = 0;
  let navigate_num = 0;

  //time countdown
  const [time, setTime] = useState();
  var current_time = null;
  useEffect(() => {
    if (time) {
      if (time.hour === 0 && time.min === 0 && time.sec === 0) {
        toast.warning(`Hết thời gian`, {});
        SubmitTest();
      } else {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        current_time = setInterval(() => {
          if (time.sec > 0) {
            setTime((prev) => ({
              ...prev,
              sec: prev.sec - 1,
            }));
          } else {
            if (time.min > 0) {
              setTime((prev) => ({
                ...prev,
                min: prev.min - 1,
                sec: 59,
              }));
            } else {
              if (time.hour > 0) {
                setTime((prev) => ({
                  hour: prev.hour - 1,
                  min: 59,
                  sec: 59,
                }));
              }
            }
          }
        }, 1000);
        return () => clearInterval(current_time);
      }
    }
  }, [time]);
  useEffect(() => {
    if (testType === "FullTest") {
      setTime({
        hour: 2,
        min: 0,
        sec: 0,
      });
    } else if (testType === "MiniTest") {
      setTime({
        hour: 1,
        min: 0,
        sec: 0,
      });
    }
  }, [testType]);

  useBeforeunload((event) => {
    event.preventDefault();
  });

  useEffect(() => {
    fetchParts();
    fetchTestData();
    fetchTestType();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (current_question !== 0) {
      const element = document.getElementById(`question_${current_question}`);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [current_question]);
  useEffect(() => {
    if (answers?.length <= 0 && testdata?.length !== 0) {
      setAnswers(initialAnswerList());
    }
  }, [user, testdata]);

  //fetch func
  async function fetchTestData() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Question/GetDoTest/${id}`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response?.json();
        setTestdata(data.parts);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  async function fetchParts() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/TestPart/GetAllTestParts`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response?.json();
        setParts(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  async function fetchTestType() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/TestType/GetTypeNameByTest/${id}`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response.text();
        setTestType(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  async function SubmitTest() {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/UserAnswer/AddListUserAnswers/${user.idUser}&&${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(answers),
        }
      );

      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`, {});
      } else {
        localStorage.removeItem(`test_answer_${user.idUser}`);
        const data = await response?.json();
        navigate(`/test/result/${data.idRecord}`);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  //helper func
  const initialAnswerList = () => {
    let initalArr = [];
    testdata.forEach((part) => {
      part.units.forEach((unit) => {
        unit.questions.forEach((question) => {
          initalArr.push({ idQuestion: question.idQuestion, userChoice: "-1" });
        });
      });
    });
    return initalArr;
  };
  const handleOptionChange = (questionId, selectedOption) => {
    const existingAnswerIndex = answers.findIndex(
      (answer) => answer.idQuestion === questionId
    );

    if (existingAnswerIndex !== -1) {
      setAnswers((prevAnswers) => {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex].userChoice = String(selectedOption);
        return updatedAnswers;
      });
    } else {
      const newAnswer = {
        idQuestion: questionId,
        userChoice: String(selectedOption),
      };
      setAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
    }
  };
  function nextPart() {
    if (current_part < 6) {
      setCurrentPart(current_part + 1);
    } else if (current_part === 6) {
      showSubmitWarning(() => SubmitTest());
    }
  }
  function previousPart() {
    if (current_part > 0) {
      setCurrentPart(current_part - 1);
    }
  }
  if (!user.auth) {
    navigate("/login");
  }
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={css["test-wrapper"]}>
      <div className={css["test-container"]}>
        {time && (
          <div className={css["countdown-clock"]}>
            <img
              width="30"
              height="30"
              src="https://img.icons8.com/office/30/present.png"
              alt="present"
            />
            <div style={{ fontWeight: 500 }}>
              {time.hour < 10 ? "0" + time.hour : time.hour}:{" "}
              {time.min < 10 ? "0" + time.min : time.min}:{" "}
              {time.sec < 10 ? "0" + time.sec : time.sec}
            </div>
          </div>
        )}
        <div className={css["tab-header"]}>
          {parts &&
            parts.map((part, index) => {
              return (
                <div
                  key={index}
                  className={`${css["tab-item"]} ${
                    current_part === index ? css["tab-index-active"] : null
                  }`}
                  onClick={() => setCurrentPart(index)}
                >
                  {part.partName}
                </div>
              );
            })}
        </div>
        <div className={css["tab-content"]}>
          {testdata &&
            testdata.map((testpart, index) => {
              return (
                <div
                  key={index}
                  className={
                    current_part === index
                      ? css["tab-pane-active"]
                      : css["tab-pane"]
                  }
                >
                  {testpart &&
                    testpart.units.map((unit, index) => {
                      return (
                        <div key={index} className={css["test-unit-wrapper"]}>
                          {unit.paragraph || unit.image ? (
                            <div className={css["test-unit-left"]}>
                              <div className={css["test-img"]}>
                                {unit.image && (
                                  <img src={unit.image} alt={unit.image} />
                                )}
                              </div>
                              <div className={css["test-paragraph"]}>
                                {unit.paragraph &&
                                  HTMLReactParser(String(unit.paragraph))}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          <div className={css["test-unit-right"]}>
                            <div className={css["test-unit-audio"]}>
                              {unit.audio && (
                                <audio
                                  src={unit.audio}
                                  controls
                                  controlsList="nodownload noremoteplayback"
                                ></audio>
                              )}
                            </div>
                            {unit &&
                              unit.questions.map((question_item, index) => {
                                question_num++;
                                return (
                                  <div
                                    key={index}
                                    id={`question_${question_num}`}
                                    className={css["test-question"]}
                                  >
                                    <div
                                      className={css["test-question-number"]}
                                    >
                                      {question_num}
                                    </div>
                                    <div
                                      className={css["test-question-content"]}
                                    >
                                      {question_item.content}

                                      <div
                                        className={css["test-choice-wrapper"]}
                                      >
                                        <div
                                          className={css["test-choice-option"]}
                                        >
                                          <input
                                            type="radio"
                                            name={`question_${question_item.idQuestion}`}
                                            checked={answers.some(
                                              (answer) =>
                                                answer.idQuestion ===
                                                  question_item.idQuestion &&
                                                answer.userChoice === "1"
                                            )}
                                            onChange={() =>
                                              handleOptionChange(
                                                question_item.idQuestion,
                                                1
                                              )
                                            }
                                          />
                                          A. {question_item.choice_1}
                                        </div>
                                        <div
                                          className={css["test-choice-option"]}
                                        >
                                          <input
                                            type="radio"
                                            name={`question_${question_item.idQuestion}`}
                                            onChange={() =>
                                              handleOptionChange(
                                                question_item.idQuestion,
                                                2
                                              )
                                            }
                                            checked={answers.some(
                                              (answer) =>
                                                answer.idQuestion ===
                                                  question_item.idQuestion &&
                                                answer.userChoice === "2"
                                            )}
                                          />
                                          B. {question_item.choice_2}
                                        </div>
                                        <div
                                          className={css["test-choice-option"]}
                                        >
                                          <input
                                            type="radio"
                                            name={`question_${question_item.idQuestion}`}
                                            onChange={() =>
                                              handleOptionChange(
                                                question_item.idQuestion,
                                                3
                                              )
                                            }
                                            checked={answers.some(
                                              (answer) =>
                                                answer.idQuestion ===
                                                  question_item.idQuestion &&
                                                answer.userChoice === "3"
                                            )}
                                          />
                                          C. {question_item.choice_3}
                                        </div>
                                        <div
                                          className={css["test-choice-option"]}
                                        >
                                          <input
                                            type="radio"
                                            name={`question_${question_item.idQuestion}`}
                                            onChange={() =>
                                              handleOptionChange(
                                                question_item.idQuestion,
                                                4
                                              )
                                            }
                                            checked={answers.some(
                                              (answer) =>
                                                answer.idQuestion ===
                                                  question_item.idQuestion &&
                                                answer.userChoice === "4"
                                            )}
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
        </div>
        <div className={css["question-button"]}>
          <input
            type="button"
            value="Trước đó"
            className={css["test-button"]}
            onClick={previousPart}
          />
          <input
            type="button"
            value={current_part === 6 ? "Nộp bài" : "Tiếp theo"}
            className={css["test-button"]}
            onClick={nextPart}
          />
        </div>
      </div>
      <div className={css["test-navigate-pane"]}>
        <button
          className={css["test-button"]}
          onClick={() => {
            showSubmitWarning(() => SubmitTest());
          }}
        >
          Nộp bài
        </button>
        <button
          className={css["test-button"]}
          style={{ backgroundColor: "#c62828" }}
          onClick={() => {
            navigate(`/test/${id}`);
          }}
        >
          Hủy
        </button>
        {testdata &&
          testdata.map((testpart, index_part) => {
            let totalQuestions = 0;

            testpart.units.forEach((unit) => {
              totalQuestions += unit.questions.length;
            });
            return (
              <div key={index_part}>
                <div style={{ fontWeight: "500" }}>{`Part ${
                  index_part + 1
                }`}</div>
                <div className={css["test-navigate-wrapper"]}>
                  {Array.from(
                    { length: totalQuestions },
                    (_, index_question) => {
                      navigate_num++;
                      return (
                        <div
                          className={`${css["test-navigate-item"]} ${
                            current_question == navigate_num
                              ? css["test-navigate-active"]
                              : ""
                          }`}
                          key={navigate_num}
                          id={navigate_num}
                          onClick={(e) => {
                            setCurrentPart(index_part);
                            setCurrentQuestion(e.target.id);
                          }}
                        >
                          {navigate_num}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default NormalTest;
