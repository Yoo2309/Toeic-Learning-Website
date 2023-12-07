import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import "./VocabularyByTopic.css";
import Heading from "../Common/Header/Heading";
import Loader from "../Common/Loader/Loader";
import { toast } from "react-toastify";

function VocabularyByTopic() {
  const [words, setWords] = useState([]);
  const [topicName, setTopicName] = useState("");
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVocabulary() {
      try {
        const response = await fetch(
          `https://localhost:7112/api/Vocabulary/GetVocabularyByTopic/${id}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          toast.error(`${errorData.message}`, {
            position: toast.POSITION.BOTTOM_RIGHT, // Vị trí hiển thị
            autoClose: 5000, // Tự động đóng sau 3 giây
            closeOnClick: true, // Đóng khi click
            pauseOnHover: true, // Tạm dừng khi di chuột qua
            draggable: true, // Có thể kéo thông báo
          });
        }
        const data = await response.json();
        setWords(data);
        setIsLoading(false);
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
    async function fetchVocabularyTopic() {
      try {
        const response = await fetch(
          `https://localhost:7112/api/VocTopic/GetVocTopicById/${id}`
        );
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
        setIsLoading(false);
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
                          <p className="flip">Click to flip</p>
                        </div>
                      </div>
                      <div className="back">
                        <div className="word-type">{word.wordType}</div>
                        <hr />
                        <div className="meaning">{word.meaning}</div>
                        <hr />
                        <p className="flip">Click to flip</p>
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
