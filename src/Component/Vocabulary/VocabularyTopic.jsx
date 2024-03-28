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
          `${
            process.env.REACT_APP_API_BASE_URL ?? "/api"
          }/VocTopic/GetAllVocTopic`
        );
        setIsLoading(false);
        if (!response.ok) {
          const errorData = await response.json();
          toast.error(`${errorData.message}`);
        }
        const data = await response.json();
        setTopic(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchVocabularyTopic();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="vocabulary-topic-wrapper">
      <div className="container vocabulary-topic">
        <Heading
          subtitle="VictoryU"
          title="Các Topic từ vựng thường gặp trong TOEIC"
        />
        {isLoading ? <Loader /> : <></>}
        <div className="vocabulary-topic-grid-wrapper">
          <div className="vocabulary-topic-gridview">
            {topics &&
              topics.map((val, index) => {
                return (
                  <Link
                    key={val.index}
                    className="vocabulary-topic-item"
                    to={`/vocabulary-by-topic/${val.idVocTopic}`}
                  >
                    <img
                      src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-vocabulary-literature-flaticons-lineal-color-flat-icons-2.png"
                      alt=""
                    />
                    <div className="vocabulary-topic-title">{val.name}</div>
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
