import React from "react";
import { Link } from "react-router-dom";
import Loader from "../Common/Loader/Loader";
import "./VocabularyTopic.css";
import Heading from "../Common/Header/Heading";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function VocabularyTopic() {
  const [topics, setTopic] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVocabularyTopic() {
      try {
        const response = await fetch(
          "https://localhost:7112/api/VocTopic/GetAllVocTopic"
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
        setTopic(data);
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
    fetchVocabularyTopic();
    window.scrollTo(0, 0);
  }, []);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="vocabulary-topic-wrapper">
      <div className="container vocabulary-topic">
        <Heading
          subtitle="VictoryU"
          title="Các Topic từ vựng thường gặp trong TOEIC"
        />
        <div className="vocabulary-topic-grid-wrapper">
          <div className="vocabulary-topic-gridview">
            {topics &&
              topics.map((val, index) => {
                return (
                  <Link to={`/vocabulary-by-topic/${val.idVocTopic}`}>
                    <div key={val.index} className="vocabulary-topic-item">
                      <img
                        src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-vocabulary-literature-flaticons-lineal-color-flat-icons-2.png"
                        alt=""
                      />
                      <div className="vocabulary-topic-title">{val.name}</div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VocabularyTopic;
