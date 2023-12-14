import React, { useContext } from "react";
import "./TestResult.css";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context/UserContext";

function TestResult({ props }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <div className="test-result-wrapper">
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
            <h2>{props.listenScore}</h2>
            <p>Trả lời đúng {props.listenCorrect}/100</p>
          </div>
          <div className="test-result-info">
            <img
              width="100"
              height="100"
              src="https://img.icons8.com/external-yogi-aprelliyanto-detailed-outline-yogi-aprelliyanto/100/external-reading-activity-and-hobbies-yogi-aprelliyanto-detailed-outline-yogi-aprelliyanto.png"
              alt="external-reading-activity-and-hobbies-yogi-aprelliyanto-detailed-outline-yogi-aprelliyanto"
            />
            <h3>Reading</h3>
            <h2>{props.readScore}</h2>
            <p>Trả lời đúng {props.readingCorrect}/100</p>
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
            <h2>{props.correctAns}</h2>
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
            <h2>{props.wrongAns}</h2>
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
              {props.correctAns === 0
                ? 0
                : (
                    (props.correctAns / (props.correctAns + props.wrongAns)) *
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
            <h2>{props.totalScore}</h2>
          </div>
        </div>
        <button className="test-backtohome" onClick={props.tryAgain}>
          <Link to="/test">Quay về trang đề thi</Link>
        </button>
      </div>
    </div>
  );
}

export default TestResult;
