import React, { useContext, useEffect, useState } from "react";
import "./UpdateQuiz.css";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../../../Common/Loader/Loader";
import AddQuestion from "./AddQuestion";
import { UserContext } from "../../../../../Context/UserContext";
import { showDeleteWarning } from "../../../../Common/Alert/Alert";

function UpdateQuiz() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [current_quiz, setCurrentQuiz] = useState({});
  const [questions, setQuestions] = useState([]);
  const { id } = useParams();
  const [showButton, setShowButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdate, setIsUpdate] = useState(true);
  const [current_question, setCurrentQuestion] = useState({});

  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };
  const AddToggle = () => {
    setIsUpdate(false);
    toggleModal();
  };

  const updateToggle = (question) => {
    setIsUpdate(true);
    setCurrentQuestion(question);
    toggleModal();
  };
  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }
  const {
    register: quiz,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleUpdateQuiz = async (register) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Quiz/UpdateQuiz/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            idLesson: current_quiz.idLesson,
            title: register.title,
          }),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error("Chỉnh sửa Quiz thất bại", {});
      } else {
        toast.success("Chỉnh sửa Quiz thành công");
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  async function fetchQuiz() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Quiz/GetQuizById/${id}`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      }
      const data = await response?.json();
      setCurrentQuiz(data);
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  async function fetchQuestionByQuiz() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Question/GetAllQuestionByQuiz/${id}`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      }
      const data = await response?.json();
      setQuestions(data);
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  const handleDeleteQuestion = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Question/DeleteQuestion/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({}),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error(`Xóa câu hỏi thất bại`, {});
      } else {
        toast.success("Xóa câu hỏi thành công");
        fetchQuestionByQuiz();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  useEffect(() => {
    fetchQuiz();
    fetchQuestionByQuiz();
  }, []);
  useEffect(() => {
    fetchQuestionByQuiz();
  }, [modal]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <AddQuestion
        toggleModal={toggleModal}
        modal_on={modal}
        idQuiz={id}
        isUpdate={isUpdate}
        initial_question={current_question}
      />
      <div className="professor-update-quiz">
        <div className="professor-board-header">
          <div className="professor-managment-sub-title">
            <h3 style={{ marginLeft: "1rem", paddingRight: "1rem" }}>
              QUẢN LÝ CÂU HỎI CỦA QUIZ
            </h3>
          </div>
          <img
            onClick={() =>
              navigate(`/professor/course/lesson/${current_quiz.idLesson}`)
            }
            width="50"
            height="50"
            src="https://img.icons8.com/ios-filled/50/2d9358/reply-arrow.png"
            alt="reply-arrow"
          />
        </div>
        <form className="update-quiz" onSubmit={handleSubmit(handleUpdateQuiz)}>
          <div style={{ width: "100%", textAlign: "center" }}>
            <div className="input-field">
              <input
                type="text"
                defaultValue={current_quiz.title}
                onFocus={() => setShowButton(true)}
                {...quiz("title", { required: true })}
              />
            </div>
            <error>
              {errors.title?.type === "required" && "Không được để trống tên"}
            </error>
          </div>
          {showButton && (
            <input
              type="submit"
              className="quiz-submit"
              value="Cập nhật"
            ></input>
          )}
        </form>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div className="professor-add-button" onClick={AddToggle}>
            <img
              width="34"
              height="34"
              src="https://img.icons8.com/doodle/48/add.png"
              alt="add"
            />
            <h3>THÊM CÂU HỎI MỚI</h3>
          </div>
        </div>
        <div className="quiz-question-list-wrapper">
          {questions &&
            questions.map((question, index) => {
              return (
                <div key={index} className="question-list-item">
                  <div className="question-wrapper">
                    <div>{question.content}</div>
                    <div className="question-choice">
                      A. {question.choice_1}
                    </div>
                    <div className="question-choice">
                      B. {question.choice_2}
                    </div>
                    <div className="question-choice">
                      C. {question.choice_3}
                    </div>
                    <div className="question-choice">
                      D. {question.choice_4}
                    </div>
                    <div>{`=> ${
                      question.answer === "1"
                        ? `A. ${question.choice_1}`
                        : question.answer === "2"
                        ? `B. ${question.choice_2}`
                        : question.answer === "3"
                        ? `C. ${question.choice_3}`
                        : `D. ${question.choice_4}`
                    }`}</div>
                    <div>{question.explaination}</div>
                  </div>
                  <div className="btn-wrapper">
                    <button
                      className="delete-btn"
                      onClick={() =>
                        showDeleteWarning(() =>
                          handleDeleteQuestion(question.idQuestion)
                        )
                      }
                    >
                      Xóa
                    </button>
                    <button
                      className="update-btn"
                      onClick={() => updateToggle(question)}
                    >
                      Sửa
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default UpdateQuiz;
