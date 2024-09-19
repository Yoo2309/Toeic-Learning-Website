import React, { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";
import "./ProfessorVocabulary.css";
import { UserContext } from "../../../Context/UserContext";
import { showDeleteWarning } from "../../Common/Alert/Alert";
import AddVocabulary from "./AddVocabulary";

function ProfessorVocabulary() {
  const [curent_topic, setCurrentTopic] = useState("");
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [curent_word, setCurrentWord] = useState({});

  const toggleModal = () => {
    setModal(!modal);
  };
  const AddToggle = () => {
    setCurrentWord(undefined);
    toggleModal();
  };

  const updateToggle = (word) => {
    setCurrentWord(word);
    toggleModal();
  };
  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }
  const goBack = () => {
    navigate("/professor/vocabulary");
  };
  async function fetchVocabulary() {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Vocabulary/GetVocabularyByList/${id}`
      );
      const data = await response?.json();
      if (!response.ok) {
        toast.error(`${data.message}`);
      } else {
        setWords(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  async function fetchVocabularyTopic() {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/VocList/GetVocListById/${id}`
      );
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`, {});
      }
      const data = await response?.json();
      setCurrentTopic(data);
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchVocabulary(), fetchVocabularyTopic()]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteVocabulary = async (idVoc) => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Vocabulary/DeleteVocabulary/${id}&&${idVoc}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({}),
        }
      );
      if (!response.ok) {
        toast.error(`Xóa từ vựng thất bại`, {});
      } else {
        toast.success("Xóa từ vựng thành công");
        fetchData();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <AddVocabulary
        toggleModal={toggleModal}
        modal_on={modal}
        idTopic={id}
        current_word={curent_word}
        reFetchData={fetchData}
      />
      <div className="professor-vocabulary">
        <div className="professor-managment-sub-title">
          <h3>QUẢN LÝ DANH SÁCH TỪ VỰNG</h3>
        </div>
        <div className="professor-add-button-wrapper">
          <div>
            <img
              onClick={goBack}
              width="50"
              height="50"
              src="https://img.icons8.com/ios-filled/50/2d9358/reply-arrow.png"
              alt="reply-arrow"
            />
          </div>
          <div className="topic-title">
            <h2>{curent_topic.title}</h2>
          </div>
          <div className="professor-add-button" onClick={AddToggle}>
            <img
              width="34"
              height="34"
              src="https://img.icons8.com/doodle/48/add.png"
              alt="add"
            />
            <h3>THÊM TỪ MỚI</h3>
          </div>
        </div>
        <div className="wordList-wrapper">
          {words &&
            words.length > 0 &&
            words.map((word, index) => {
              return (
                <Fragment>
                  <div key={index} className="wordList-item-wrapper">
                    <div className="image-desc">
                      <img src={word.image} alt="" />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: 6,
                        justifyContent: "space-evenly",
                      }}
                    >
                      <div className="wordList-item">
                        <div className="word-item-field">{word.topic}</div>
                        <div className="word-item-field">{word.engWord}</div>
                        <div className="word-item-field">{word.wordType}</div>
                        <div
                          className="word-item-field"
                          style={{ fontStyle: "italic" }}
                        >
                          {word.pronunciation}
                        </div>
                        <div className="btn-wrapper">
                          <button
                            className="delete-btn"
                            onClick={() =>
                              showDeleteWarning(() =>
                                handleDeleteVocabulary(word.idVoc)
                              )
                            }
                          >
                            Xóa
                          </button>
                          <button
                            className="update-btn"
                            onClick={() => updateToggle(word)}
                          >
                            Sửa
                          </button>
                        </div>
                      </div>
                      <div className="word-item-field">{word.meaning}</div>
                      <div className="word-item-field">{word.example}</div>
                    </div>
                  </div>
                </Fragment>
              );
            })}
        </div>
      </div>
    </>
  );
}
export default ProfessorVocabulary;
