import React from "react";

function QuizResult(props) {
  
  return (
    <div className="quiz-result">
      <div className="congratulation">
        Congratulation
        <img
          width="150"
          height="150"
          src="https://img.icons8.com/clouds/100/confetti.png"
          alt="confetti"
        />
      </div>
      <div className="show-score">
        <div className="quiz-info">
          <div>Score</div>
          <hr />
          {props.score}
        </div>
        <div className="quiz-info">
          <div>Total</div>
          <hr />
          {props.totalScore}
        </div>
        <div className="quiz-info">
          <div>Percent</div>
          <hr />
          {"25%"}
          {/* {parseFloat(props.score) / parseFloat(props.total)} */
          }
        </div>
      </div>
      <button className="quiz-try-again" onClick={props.tryAgain}>
        Try Again
      </button>
    </div>
  );
}

export default QuizResult;
