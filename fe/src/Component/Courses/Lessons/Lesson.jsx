/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Heading from "../../Common/Header/Heading";
import "./Lesson.css";
import Quiz from "../Lessons/Quiz/Quiz";
import Loader from "../../Common/Loader/Loader";
import { toast } from "react-toastify";
import HTMLReactParser from "html-react-parser";
import Comment from "./Comment/Comment";
import { UserContext } from "../../../Context/UserContext";

function Lesson() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [other_lessons, setOtherLesson] = useState([]);
  const [current_lesson, setCurrentLesson] = useState({});
  const [quizes, setQuizes] = useState([]);
  const [current_quizID, setCurrentQuizID] = useState(
    "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  );
  const [quizData, setQuizData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchLessons() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Lesson/GetLessonById/${id}`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response?.json();
        setCurrentLesson(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  async function fetchOtherLessons() {
    try {
      const courseid = current_lesson.idCourse;
      if (courseid) {
        setIsLoading(true);
        const response = await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL ?? "/api"
          }/Lesson/GetAllLessonByCourse/${courseid}`
        );
        setIsLoading(false);
        if (!response.ok) {
          const errorData = await response?.json();
          toast.error(`${errorData.message}`);
        } else {
          const data = await response?.json();
          setOtherLesson(data.filter((lesson) => lesson.idLesson !== id));
        }
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  async function fetchQuizes() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Quiz/GetAllQuizByLesson/${id}`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response?.json();
        setQuizes(data);
        if (data[0]) {
          setCurrentQuizID(data[0].idQuiz);
        }
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  async function fetchQuestionByQuiz() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Question/GetAllQuestionByQuiz/${current_quizID}`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response?.json();
        setQuizData(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  useEffect(() => {
    fetchLessons();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    fetchOtherLessons();
    fetchQuizes();
  }, [current_lesson]);

  useEffect(() => {
    fetchQuestionByQuiz();
  }, [current_quizID]);

  if (isLoading) {
    return <Loader />;
  }
  if (current_lesson?.isVip && user.idUser && user.role[1] !== "VipStudent") {
    navigate("/vippackage");
  }
  return (
    <div className="lesson-wrapper">
      <Heading subtitle="VictoryU" title="TOEIC BASIC" />
      <div className="lesson-main">
        <div className="lesson-left-row">
          <div className="lesson-left-row-title">Các bài học khác</div>
          <div className="dividing-line">
            <hr />
          </div>
          <div className="other-lessons">
            {other_lessons &&
              other_lessons.map((lesson, index) => {
                return (
                  <Link key={index} to={`/lesson/${lesson.idLesson}`}>
                    <div className="other-lessons-item">
                      <div className="other-lesson-title">{lesson.title}</div>
                    </div>
                  </Link>
                );
              })}
          </div>
          <div className="dividing-line">
            <hr />
          </div>
          <div className="lesson-quiz-list">
            {quizes &&
              quizes.map((quiz, index) => {
                return (
                  <input
                    className={`lesson-quiz-item ${
                      quiz.idQuiz === current_quizID
                        ? "lesson-quiz-current"
                        : ""
                    }`}
                    key={index}
                    type="button"
                    value={quiz.title}
                    onClick={() => {
                      setCurrentQuizID(quiz.idQuiz);
                    }}
                  />
                );
              })}
          </div>
        </div>
        <div className="lesson-right-row">
          <div className="lesson-content-wrapper">
            <div className="lesson-title-wrapper">
              <div className="lesson-title">{current_lesson.title}</div>
              <hr />
            </div>
            <div className="lesson-content">
              {HTMLReactParser(String(current_lesson.content))}
            </div>
          </div>
          <div className="lesson-quiz-main">
            {quizData && quizData.length <= 0 ? (
              ""
            ) : (
              <Quiz
                quizData={quizData}
                quizTitle={
                  quizes.find((obj) => obj.idQuiz === current_quizID) &&
                  quizes.find((obj) => obj.idQuiz === current_quizID).title
                }
              />
            )}
          </div>
        </div>
      </div>
        <Comment id={id} />
    </div>
  );
}

export default Lesson;
