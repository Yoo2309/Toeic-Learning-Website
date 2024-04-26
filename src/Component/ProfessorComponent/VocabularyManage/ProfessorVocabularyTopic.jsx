import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { showDeleteWarning } from "../../Common/Alert/Alert";
import Loader from "../../Common/Loader/Loader";
import { useNavigate } from "react-router-dom";
import "./ProfessorVocabularyTopic.css";
import AddVocabularyTopic from "./AddVocabularyTopic";
import { UserContext } from "../../../Context/UserContext";

function ProfessorVocabularyTopic() {
  const { user } = useContext(UserContext);
  const [topics, setTopic] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }
  async function fetchVocabularyTopic() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/VocTopic/GetAllVocTopic`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`${errorData.message}`, {});
      } else {
        const data = await response.json();
        setTopic(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  async function DeleteVocabularyTopic(voc_topic_id) {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/VocTopic/DeleteVocTopic/${voc_topic_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error(`Xóa chủ đề từ vựng thất bại`, {});
      } else {
        fetchVocabularyTopic();
        toast.success("Xóa chủ đề từ vựng thành công");
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  useEffect(() => {
    fetchVocabularyTopic();
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (!modal) {
      fetchVocabularyTopic();
    }
  }, [modal]);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <AddVocabularyTopic toggleModal={toggleModal} modal_on={modal} />
      <div className="professor-vocabulary-wrapper">
        <div className="professor-board-header">
          <div className="professor-managment-title">
            <h3>QUẢN LÝ CHỦ ĐỀ TỪ VỰNG</h3>
          </div>
          <div className="professor-add-button" onClick={toggleModal}>
            <img
              width="34"
              height="34"
              src="https://img.icons8.com/doodle/48/add.png"
              alt="add"
            />
            <h3>THÊM CHỦ ĐỀ MỚI</h3>
          </div>
        </div>
        <div className="vocabulary-grid-wrapper">
          <div className="vocabulary-grid">
            {topics &&
              topics.map((topic, index) => {
                return (
                  <div key={index} className="vocabulary-item">
                    <img
                      src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-vocabulary-literature-flaticons-lineal-color-flat-icons-2.png"
                      alt=""
                    />
                    <div className="vocabulary-title">{topic.name}</div>
                    <div className="btn-wrapper">
                      <button
                        className="delete-btn"
                        onClick={() =>
                          showDeleteWarning(() =>
                            DeleteVocabularyTopic(topic.idVocTopic)
                          )
                        }
                      >
                        Xóa
                      </button>
                      <button
                        className="update-btn"
                        onClick={() => {
                          navigate(`/professor/vocabulary/${topic.idVocTopic}`);
                        }}
                      >
                        Sửa
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfessorVocabularyTopic;
