import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./TestMain.css";
import Loader from "../../Common/Loader/Loader.jsx";
import HTMLReactParser from "html-react-parser";
import { UserContext } from "../../../Context/UserContext.jsx";
import { toast } from "react-toastify";
import { showSubmitWarning } from "../../Common/Alert/DeleteAlert.jsx";

function TestMain() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [parts, setParts] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [current_part, setCurrentPart] = useState(0);
  const [testdata, setTestdata] = useState([]);
  const [testType, setTestType] = useState("");
  const [answers, setAnswers] = useState([]);
  const [freeTest, setFreeTest] = useState(true);

  let question_num = 0;

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

  useEffect(() => {
    fetchParts();
    fetchTestData();
    fetchTestType();
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (user.idUser) {
      fetchFreeTest();
    }
  }, [user]);
  useEffect(() => {
    if (!freeTest && user.role[1] !== "VipStudent") {
      navigate("/vippackage");
    }
  }, [freeTest]);
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
        const errorData = await response.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response.json();
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
        const errorData = await response.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response.json();
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
        const errorData = await response.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response.text();
        setTestType(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  async function fetchFreeTest() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Student/CheckFreeTest/${user.idUser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response.text();
        if (data === "true") {
          setFreeTest(true);
        } else {
          setFreeTest(false);
        }
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
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
        const errorData = await response.json();
        toast.error(`${errorData.message}`, {});
      } else {
        const data = await response.json();
        navigate(`/test/result/${data.idRecord}`);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
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
    <div className="test-container">
      {time && (
        <div className="countdown-clock">
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
                                          name={`question_${question_item.idQuestion}`}
                                          onChange={() =>
                                            handleOptionChange(
                                              question_item.idQuestion,
                                              1
                                            )
                                          }
                                        />
                                        A. {question_item.choice_1}
                                      </div>
                                      <div className="test-choice-option">
                                        <input
                                          type="radio"
                                          name={`question_${question_item.idQuestion}`}
                                          onChange={() =>
                                            handleOptionChange(
                                              question_item.idQuestion,
                                              2
                                            )
                                          }
                                        />
                                        B. {question_item.choice_2}
                                      </div>
                                      <div className="test-choice-option">
                                        <input
                                          type="radio"
                                          name={`question_${question_item.idQuestion}`}
                                          onChange={() =>
                                            handleOptionChange(
                                              question_item.idQuestion,
                                              3
                                            )
                                          }
                                        />
                                        C. {question_item.choice_3}
                                      </div>
                                      <div className="test-choice-option">
                                        <input
                                          type="radio"
                                          name={`question_${question_item.idQuestion}`}
                                          onChange={() =>
                                            handleOptionChange(
                                              question_item.idQuestion,
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
            value={current_part === 6 ? "Submit" : "Next"}
            className="next-button"
            onClick={nextPart}
          />
        </div>
      </div>
    </div>
  );
}

export default TestMain;
