import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import "./VocabularyByTopic.css";
import Heading from "../Common/Header/Heading";
import Loader from "../Common/Loader/Loader";
import { toast } from "react-toastify";
import { useSpeechSynthesis } from "react-speech-kit";

function VocabularyByTopic() {
  const { speak } = useSpeechSynthesis();
  const [words, setWords] = useState([]);
  const [topicName, setTopicName] = useState("");
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchVocabulary() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL ?? "/api"
          }/Vocabulary/GetVocabularyByTopic/${id}`
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
          setWords(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    async function fetchVocabularyTopic() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL ?? "/api"
          }/VocTopic/GetVocTopicById/${id}`
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
        setTopicName(data.name);
      } catch (error) {
        console.log(error);
      }
    }
    fetchVocabulary();
    fetchVocabularyTopic();
    window.scrollTo(0, 0);
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);
  const slideLength = words.length;

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1);
  };

  useEffect(() => {
    setCurrentSlide(0);
  }, []);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="vocabulary-wrapper">
      <div className="container vocabulary-card">
        <Heading subtitle="VictoryU" title={`Từ vựng chủ đề ${topicName}`} />
        <div className="slider">
          <AiOutlineArrowLeft className="arrow prev" onClick={prevSlide} />
          <AiOutlineArrowRight className="arrow next" onClick={nextSlide} />
          {words &&
            words.map((word, index) => {
              return (
                <div
                  key={index}
                  className={index === currentSlide ? "slide current" : "slide"}
                >
                  <label>
                    <input type="checkbox" />
                    <div className="flip-card">
                      <div className="front">
                        <div className="eng-word">{word.engWord}</div>
                        <div>
                          <hr />
                          <p className="flip">Click để lật</p>
                        </div>
                      </div>
                      <div className="back">
                        <div
                          style={{ fontWeight: "bold", fontStyle: "italic" }}
                        >
                          {word.engWord}
                        </div>
                        <hr />
                        <div>
                          <div className="back-item">{`(${word.wordType})`}</div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "5px",
                            }}
                          >
                            <div
                              className="back-item"
                              style={{ fontStyle: "italic" }}
                            >
                              {`/${word.pronunciation ?? "pronunciation"}/`}
                            </div>
                            <img
                              width="24"
                              height="24"
                              src="https://img.icons8.com/material-sharp/24/speaker.png"
                              alt="speaker"
                              onClick={(e) => {
                                e.preventDefault();
                                speak({
                                  text: word.pronunciation ?? "pronunciation",
                                });
                              }}
                            />
                          </div>
                          <div className="back-item">{word.meaning}</div>
                        </div>
                        <hr />
                        <p className="flip">Click để lật</p>
                      </div>
                    </div>
                  </label>
                </div>
              );
            })}
        </div>
        <div className="vocabulary-list-wrapper">
          <div className="vocabulary-list">
            <table>
              <thead>
                <tr>
                  <td className="col1">Từ vựng </td>
                  <td className="col2">Từ loại</td>
                  <td className="col3">Nghĩa</td>
                </tr>
              </thead>
              <tbody>
                {words &&
                  words.map((word, key) => {
                    return (
                      <tr>
                        <td className="col1">{word.engWord}</td>
                        <td className="col2">{word.wordType}</td>
                        <td className="col3">{word.meaning}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VocabularyByTopic;
