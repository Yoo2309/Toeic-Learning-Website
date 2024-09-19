import React, { useContext, useEffect, useState } from "react";
import "./QuizManage.css";
import Loader from "../../../../Common/Loader/Loader";
import { toast } from "react-toastify";
import AddQuiz from "./AddQuiz";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../../Context/UserContext";
import { showDeleteWarning } from "../../../../Common/Alert/Alert";

function QuizManage({ idLesson }) {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [modal, setModal] = useState(false);
  const [quizes, setQuizes] = useState([]);
  const navigate = useNavigate();

  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  async function fetchQuizes() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Quiz/GetAllQuizByLesson/${idLesson}`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response?.json();
        setQuizes(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  const handleDeleteQuiz = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Quiz/DeleteQuiz/${id}`,
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
        toast.error(`Xóa Quiz thât bại`, {});
      } else {
        toast.success("Xóa Quiz thành công");
        fetchQuizes();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  useEffect(() => {
    fetchQuizes();
  }, []);
  useEffect(() => {
    if (!modal) {
      fetchQuizes();
    }
  }, [modal]);

  if (isLoading) {
    <Loader />;
  }

  return (
    <>
      <AddQuiz toggleModal={toggleModal} modal_on={modal} idLesson={idLesson} />
      <div className="professor-quiz-wrapper">
        <div className="professor-board-header">
          <div className="professor-managment-title">
            <h3 style={{ marginLeft: "1rem" }}>QUẢN LÝ QUIZ</h3>
          </div>
          <div className="professor-add-button" onClick={toggleModal}>
            <img
              width="34"
              height="34"
              src="https://img.icons8.com/doodle/48/add.png"
              alt="add"
            />
            <h3>THÊM QUIZ MỚI</h3>
          </div>
        </div>
        <div className="professor-quiz-list">
          {quizes.map((quiz, index) => {
            return (
              <div key={index} className="professor-quiz-item">
                <div>{quiz.title}</div>
                <div className="btn-wrapper">
                  <button
                    className="delete-btn"
                    onClick={() =>
                      showDeleteWarning(() => handleDeleteQuiz(quiz.idQuiz))
                    }
                  >
                    Xóa
                  </button>
                  <button
                    className="update-btn"
                    onClick={() =>
                      navigate(`/professor/course/lesson/quiz/${quiz.idQuiz}`)
                    }
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

export default QuizManage;
