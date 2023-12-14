import React from "react";

function QuizResult(props) {
  return (
    <div className="quiz-result-wrapper">
      <div className="quiz-result-bg"></div>
      <div className="quiz-result">
        <div className="congratulation">
          Congratulation!
          <img
            width="150"
            height="150"
            src="https://img.icons8.com/clouds/100/confetti.png"
            alt="confetti"
          />
        </div>
        <div className="show-score">
          <div style={{ backgroundColor: "lightgreen" }} className="quiz-info">
            <div>Score</div>
            <hr />
            {props.score}
          </div>
          <div style={{ backgroundColor: "gold" }} className="quiz-info">
            <div>Total</div>
            <hr />
            {props.totalScore}
          </div>
          <div style={{ backgroundColor: "darkcyan" }} className="quiz-info">
            <div>Percent</div>
            <hr />
            {props.score === 0 || props.totalScore === 0
              ? 0
              : ((props.score / props.totalScore) * 100).toFixed(0)}
            %
          </div>
        </div>
        <button className="quiz-try-again" onClick={props.tryAgain}>
          Try Again
        </button>
      </div>
    </div>
  );
}

export default QuizResult;
