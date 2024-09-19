import React, { useContext, useEffect, useState } from "react";
import "./TestResult.css";
import UserAnswerDetail from "./UserAnswerDetail";
import { UserContext } from "../../../Context/UserContext";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";

function UserAnswer({ id }) {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [curent_userAnswer, setCurentAnswer] = useState({});
  const [question_num, setQuestion_num] = useState({});

  //modal
  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };
  useEffect(() => {
    if (modal) {
      document.body.classList.add("active-modal");
    } else {
      document.body.classList.remove("active-modal");
    }
    return () => {
      document.body.classList.remove("active-modal");
    };
  }, [modal]);

  async function GetUserAnswersByRecord() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/UserAnswer/GetUserAnswerByRecord/${id}`,
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
        const errorData = await response?.json();
        toast.error(`${errorData.message}`, {});
      }
      const data = await response?.json();
      setUserAnswers(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (user.idUser) {
      GetUserAnswersByRecord();
    }
  }, [user.idUser]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="user-answer-list-wrapper">
        {userAnswers &&
          userAnswers.map((userAnswer, index) => {
            return (
              <div className="user-answer-item">
                <div className="test-question-number">{index + 1}</div>
                {userAnswer.userChoice === "1"
                  ? "A"
                  : userAnswer.userChoice === "2"
                  ? "B"
                  : userAnswer.userChoice === "3"
                  ? "C"
                  : userAnswer.userChoice === "4"
                  ? "D"
                  : "Chưa trả lời"}
                {userAnswer.state ? (
                  <i
                    className="fa-solid fa-check"
                    style={{ color: "#0cb300" }}
                  ></i>
                ) : (
                  <i className="fa-solid fa-x" style={{ color: "#ff0000" }}></i>
                )}
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    setQuestion_num(index + 1);
                    setCurentAnswer(userAnswer);
                    toggleModal();
                  }}
                >
                  Xem chi tiết
                </a>
              </div>
            );
          })}
      </div>
      {modal ? (
        <UserAnswerDetail
          toggleModal={toggleModal}
          userAnswer={curent_userAnswer}
          index={question_num}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default UserAnswer;
