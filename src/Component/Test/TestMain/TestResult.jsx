import React, { useContext, useEffect, useState } from "react";
import "./TestResult.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../Context/UserContext";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";
import UserAnswerDetail from "./UserAnswerDetail";

function TestResult() {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState({});
  const [userAnswers, setUserAnswers] = useState([]);
  const [curent_userAnswer, setCurentAnswer] = useState({});
  const [question_num, setQuestion_num] = useState({});

  const [isLoading, setIsLoading] = useState(false);

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

  //fetch
  async function fetchRecordById() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/Record/GetRecordByID/${id}`,
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
        toast.error(`${errorData.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT, // Vị trí hiển thị
          autoClose: 5000, // Tự động đóng sau 3 giây
          closeOnClick: true, // Đóng khi click
          pauseOnHover: true, // Tạm dừng khi di chuột qua
          draggable: true, // Có thể kéo thông báo
        });
      } else {
        const data = await response.json();
        setRecord(data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function GetUserAnswersByRecord() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/UserAnswer/GetUserAnswerByRecord/${id}`,
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
        toast.error(`${errorData.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      const data = await response.json();
      setUserAnswers(data);
    } catch (error) {
      console.log(error);
    }
  }

  //effect
  useEffect(() => {
    if (user.idUser) {
      fetchRecordById();
      GetUserAnswersByRecord();
    }
  }, [user.idUser]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <div className="test-result-wrapper">
        <div className="test-result">
          <div className="show-score">
            <div className="test-result-info">
              <img
                width="100"
                height="100"
                src="https://img.icons8.com/external-smashingstocks-detailed-outline-smashing-stocks/66/external-Listening-overclocking-smashingstocks-detailed-outline-smashing-stocks.png"
                alt="external-Listening-overclocking-smashingstocks-detailed-outline-smashing-stocks"
              />
              <h3>Listening</h3>
              <h2>{record.listenScore}</h2>
              <p>Trả lời đúng {record.listenCorrect}/100</p>
            </div>
            <div className="test-result-info">
              <img
                width="100"
                height="100"
                src="https://img.icons8.com/external-yogi-aprelliyanto-detailed-outline-yogi-aprelliyanto/100/external-reading-activity-and-hobbies-yogi-aprelliyanto-detailed-outline-yogi-aprelliyanto.png"
                alt="external-reading-activity-and-hobbies-yogi-aprelliyanto-detailed-outline-yogi-aprelliyanto"
              />
              <h3>Reading</h3>
              <h2>{record.readScore}</h2>
              <p>Trả lời đúng {record.readingCorrect}/100</p>
            </div>
          </div>
          <div className="show-score">
            <div className="test-result-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="64"
                height="64"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#c8e6c9"
                  d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
                ></path>
                <path
                  fill="#4caf50"
                  d="M34.586,14.586l-13.57,13.586l-5.602-5.586l-2.828,2.828l8.434,8.414l16.395-16.414L34.586,14.586z"
                ></path>
              </svg>
              <div style={{ color: "green", fontWeight: "700" }}>
                Trả lời đúng
              </div>
              <hr />
              <h2>{record.correctAns}</h2>
              <p>Câu hỏi</p>
            </div>
            <div className="test-result-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="64"
                height="64"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#f44336"
                  d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
                ></path>
                <path
                  fill="#fff"
                  d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"
                ></path>
                <path
                  fill="#fff"
                  d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"
                ></path>
              </svg>
              <div style={{ color: "red", fontWeight: "700" }}>Trả lời sai</div>
              <hr />
              <h2>{record.wrongAns}</h2>
              <p>Câu hỏi</p>
            </div>
            <div className="test-result-info">
              <img
                width="64"
                height="64"
                src="https://img.icons8.com/fluency/100/dividends.png"
                alt="dividends"
              />
              <div style={{ color: "dodgerblue", fontWeight: "700" }}>
                Độ chính xác
              </div>
              <hr />
              <h2>
                {record.correctAns === 0
                  ? 0
                  : (
                      (record.correctAns /
                        (record.correctAns + record.wrongAns)) *
                      100
                    ).toFixed(0)}
                %
              </h2>
            </div>
            <div className="test-result-info">
              <img
                width="64"
                height="64"
                src="https://img.icons8.com/external-tal-revivo-bold-tal-revivo/64/b8860b/external-symbol-sigma-a-greek-alphabet-used-as-sum-of-series-text-bold-tal-revivo.png"
                alt="external-symbol-sigma-a-greek-alphabet-used-as-sum-of-series-text-bold-tal-revivo"
              />
              <div style={{ color: "darkgoldenrod", fontWeight: "700" }}>
                Tổng điểm
              </div>
              <hr />
              <h2>{record.totalScore}</h2>
            </div>
          </div>
          <button className="test-backtohome" onClick={record.tryAgain}>
            <Link to="/test">Quay về trang đề thi</Link>
          </button>
        </div>
        <div style={{ width: "30%" }} className="test-result">
          <div className="test-result-ava">
            <img
              style={{ width: "90%" }}
              src={
                user.ava ||
                "https://img.icons8.com/papercut/100/user-female-circle.png"
              }
              alt=""
            ></img>
          </div>
          <div style={{ fontSize: "18px" }}>{user.username}</div>
          <button
            onClick={() => {
              navigate("/test/record");
            }}
            className="test-history"
          >
            Lịch sử làm bài <i class="fa-solid fa-clock-rotate-left"></i>
          </button>
        </div>
      </div>
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
                  : "D"}
                {userAnswer.state ? (
                  <i class="fa-solid fa-check" style={{ color: "#0cb300" }}></i>
                ) : (
                  <i class="fa-solid fa-x" style={{ color: "#ff0000" }}></i>
                )}
                <div
                  onClick={() => {
                    setQuestion_num(index + 1);
                    setCurentAnswer(userAnswer);
                    toggleModal();
                  }}
                >
                  Xem chi tiết
                </div>
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
    </>
  );
}

export default TestResult;
