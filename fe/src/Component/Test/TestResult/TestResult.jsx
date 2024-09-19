import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterIcon,
  TwitterShareButton,
  LinkedinIcon,
  LinkedinShareButton,
} from "react-share";
import { UserContext } from "../../../Context/UserContext";
import "./TestResult.css";
import Loader from "../../Common/Loader/Loader";
import UserAnswer from "./UserAnswer";

function TestResult() {
  const [isShare, set_isShare] = useState(false);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [record, setRecord] = useState({});
  const [record_user, setrecord_user] = useState({});
  const [test, setTest] = useState({});

  //fetch
  async function fetchRecordById() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Record/GetRecordByID/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response?.json();
        let idUser = data.idUser;
        setRecord(data.record);
        setrecord_user((prevUser) => ({ ...prevUser, idUser }));
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function GetUserInfo(id) {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Authen/GetUserInfo?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`, {});
      }
      const data = await response?.json();
      setrecord_user(data);
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchTest(id) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Test/GetTestById/${id}`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      }
      const data = await response?.json();
      setTest(data);
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  //effect
  useEffect(() => {
    fetchRecordById();
  }, []);
  useEffect(() => {
    if (record.idTest) {
      fetchTest(record.idTest);
    }
  }, [record.idTest]);
  useEffect(() => {
    if (record_user.idUser && record_user.idUser !== user.idUser) {
      set_isShare(true);
    }
    if (record_user.idUser) {
      GetUserInfo(record_user.idUser);
    }
  }, [record_user, user.idUser]);

  return (
    <>
      <Helmet>
        <meta
          property="og:url"
          content={`${window.location.origin}/test/result/${id}`}
        />
        <meta
          property="og:description"
          content={`🏆Chúc mừng ${
            record_user.fullname ?? ""
          } đã đạt được điểm số ${record.totalScore ?? ""}`}
        />
        <meta property="og:image" content="https://i.imgur.com/OxfKelV.png" />
      </Helmet>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="test-result-wrapper">
            <div className="test-result">
              <h2>{test.name ? test.name : ""}</h2>
              <div className="show-score">
                <div className="test-result-info">
                  <img
                    width="64"
                    height="64"
                    src="https://img.icons8.com/external-smashingstocks-detailed-outline-smashing-stocks/66/external-Listening-overclocking-smashingstocks-detailed-outline-smashing-stocks.png"
                    alt="external-Listening-overclocking-smashingstocks-detailed-outline-smashing-stocks"
                  />
                  <h3>Listening</h3>
                  <h2>{record.listenScore}</h2>
                  <p>Trả lời đúng {record.listenCorrect}/100</p>
                </div>
                <div className="test-result-info">
                  <img
                    width="64"
                    height="64"
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
                  <div style={{ color: "red", fontWeight: "700" }}>
                    Trả lời sai
                  </div>
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
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    width: "50%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <button
                    className="test-backtohome"
                    onClick={() => {
                      navigate(`/test/${record.idTest}`);
                    }}
                  >
                    Quay về trang đề thi
                  </button>
                </div>
                {!isShare ? (
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      padding: "0 1rem",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="5rem"
                      height="5rem"
                      viewBox="0 0 64 64"
                    >
                      <path d="M 9 9 L 9 14 L 9 54 L 51 54 L 56 54 L 55 42 L 51 42 L 51 49.095703 L 13 50 L 13.900391 14 L 21 14 L 21 10 L 9 9 z M 44 9 L 44 17.072266 C 29.919275 17.731863 19 23.439669 19 44 L 23 44 C 23 32.732824 29.174448 25.875825 44 25.080078 L 44 33 L 56 20.5 L 44 9 z"></path>
                    </svg>
                    <FacebookShareButton
                      url={`${window.location.origin}/test/result/${id}`}
                      hashtags={"#VictoryU"}
                    >
                      <FacebookIcon size={36} round />
                    </FacebookShareButton>
                    <TwitterShareButton
                      title={`🏆Chúc mừng ${
                        record_user.fullname ?? ""
                      } đã đạt được điểm số ${record.totalScore ?? ""}`}
                      hashtags={["VictoryU", "TOEIC"]}
                      url={`${window.location.origin}/test/result/${id}\n`}
                    >
                      <TwitterIcon size={36} round />
                    </TwitterShareButton>
                    <LinkedinShareButton
                      title={"Thi thử TOEIC trên VictoryU"}
                      url={`${window.location.origin}/test/result/${id}`}
                    >
                      <LinkedinIcon size={36} round />
                    </LinkedinShareButton>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div style={{ width: "30%" }} className="test-result">
              <div className="test-result-ava">
                <img
                  style={{ width: "90%" }}
                  src={
                    record_user.imageURL
                      ? record_user.imageURL
                      : "https://img.icons8.com/ios/100/user-male-circle--v1.png"
                  }
                  alt=""
                ></img>
              </div>
              <div style={{ fontSize: "18px" }}>
                {record_user.fullname ? record_user.fullname : ""}
              </div>
              {!isShare ? (
                <button
                  onClick={() => {
                    navigate("/test/record");
                  }}
                  className="test-history"
                >
                  Lịch sử làm bài{" "}
                  <i className="fa-solid fa-clock-rotate-left"></i>
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
          {!isShare && id ? <UserAnswer id={id} /> : <></>}
        </>
      )}
    </>
  );
}

export default TestResult;
