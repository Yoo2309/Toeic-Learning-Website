import React, { useEffect, useState } from "react";
import "./QuizManage.css";
import Loader from "../../../../Common/Loader/Loader";
import { toast } from "react-toastify";
import AddQuiz from "./AddQuiz";
import { useNavigate } from "react-router-dom";

function QuizManage({ idLesson }) {
  const [isLoading, setIsLoading] = useState(true);
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
        `https://localhost:7112/api/Quiz/GetAllQuizByLesson/${idLesson}`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response.json();
        console.log(response);
        toast.error(`${errorData.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT, // Vị trí hiển thị
          autoClose: 5000, // Tự động đóng sau 3 giây
          closeOnClick: true, // Đóng khi click
          pauseOnHover: true, // Tạm dừng khi di chuột qua
          draggable: true, // Có thể kéo thông báo
        });
      } else {
        const data = await response.json();
        console.log(data);
        setQuizes(data);
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

  const handleDeleteQuiz = async (id) => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://localhost:7112/api/Quiz/DeleteQuiz/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response.json();
        console.log(response);
        toast.error(`${errorData.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.success("Delete Topic Successfully", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 10000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        fetchQuizes();
      }
    } catch (error) {
      toast.error(`${error}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
                    onClick={() => handleDeleteQuiz(quiz.idQuiz)}
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
