import React from "react";
import "./AboutCard.css";
import Heading from "../../Common/Header/Heading";
import { useNavigate } from "react-router-dom";

function AboutCard() {
  const navigate = useNavigate();
  return (
    <div className="aboutHome">
      <Heading subtitle="VictoryU" title="Nền tảng luyện thi TOEIC" />
      <div className="about-card-wrapper">
        <div className="left row">
          <img
            src="https://scintillating-smakager-860376.netlify.app/images/about.webp"
            alt=""
          />
        </div>
        <div className="right row">
          <div className="item" onClick={() => navigate("/test")}>
            <div className="icon-img">
              <img
                src="https://img.icons8.com/external-nawicon-outline-color-nawicon/64/external-exam-back-to-school-nawicon-outline-color-nawicon.png"
                alt=""
              />
            </div>
            <div className="text">
              <h2>Đề thi thử</h2>
              <p>
                Cung cấp các đề thi thử toàn phần và từng phần, giúp học viên
                rèn luyện kỹ năng làm bài cũng như cọ sát với độ khó của đề thi
                thực
              </p>
            </div>
          </div>
          <div className="item" onClick={() => navigate("/courses")}>
            <div className="icon-img">
              <img
                src="https://img.icons8.com/external-justicon-flat-justicon/64/external-lesson-elearning-and-education-justicon-flat-justicon.png"
                alt=""
              />
            </div>
            <div className="text">
              <h2>Các Lesson ngữ pháp</h2>
              <p>
                Cung cấp các bài học ngữ pháp từ căn bản đến nâng cao giúp học
                viên dễ dàng học từ con số 0.
              </p>
            </div>
          </div>
          <div
            className="item"
            onClick={() => navigate("/practice-vocabulary")}
          >
            <div className="icon-img">
              <img
                src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-vocabulary-literature-flaticons-lineal-color-flat-icons-2.png"
                alt=""
              />
            </div>
            <div className="text">
              <h2>Từ vựng về các chủ đề</h2>
              <p>
                Có từ vựng theo từng chủ đề thường gặp trong đời sống cũng như
                trong đề thi, giúp học viên đa dạng hóa vốn từ vựng của bản
                thân.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutCard;
