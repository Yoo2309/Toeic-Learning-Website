import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";
import { useForm } from "react-hook-form";
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
  const [showButton, setShowButton] = useState(false);
  const [curent_word, setCurrentWord] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };
  const AddToggle = () => {
    setIsUpdate(false);
    toggleModal();
  };

  const updateToggle = (word) => {
    setIsUpdate(true);
    setCurrentWord(word);
    toggleModal();
  };
  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }
  const {
    register: vocabulary_topic,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const goBack = () => {
    navigate("/professor/vocabulary");
  };
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
        toast.error(`${errorData.message}`);
      }
      const data = await response.json();
      setWords(data);
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  async function fetchVocabularyTopic() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/VocTopic/GetVocTopicById/${id}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`${errorData.message}`, {});
      }
      const data = await response.json();
      setCurrentTopic(data);
      setIsLoading(false);
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  useEffect(() => {
    fetchVocabulary();
    fetchVocabularyTopic();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!modal) {
      fetchVocabulary();
    }
    window.scrollTo(0, 0);
  }, [modal]);

  const handleUpdateVocabularyTopic = async (register) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/VocTopic/UpdateVocTopic/${id}&&${user.idUser}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            name: register.name,
          }),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error("Chỉnh sửa chủ đề từ vựng thất bại", {});
      } else {
        toast.success("Chỉnh sửa chủ đề từ vựng thành công");
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  const handleDeleteVocabulary = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Vocabulary/DeleteVocabulary/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({}),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error(`Xóa từ vựng thất bại`, {});
      } else {
        toast.success("Xóa từ vựng thành công");
        fetchVocabulary();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <AddVocabulary
        toggleModal={toggleModal}
        modal_on={modal}
        idTopic={id}
        isUpdate={isUpdate}
        current_word={curent_word}
      />
      <div className="professor-vocabulary">
        <div className="professor-managment-sub-title">
          <h3>QUẢN LÝ CHỦ ĐỀ TỪ VỰNG</h3>
        </div>

        <form
          className="update-voc-topic"
          onSubmit={handleSubmit(handleUpdateVocabularyTopic)}
        >
          <div style={{ width: "100%", textAlign: "center" }}>
            <div className="input-field">
              <input
                type="text"
                defaultValue={curent_topic.name}
                onFocus={() => setShowButton(true)}
                {...vocabulary_topic("name", { required: true })}
              />
            </div>
            <error>
              {errors.name?.type === "required" && "Không được để trống tên"}
            </error>
          </div>
          {showButton && (
            <input
              type="submit"
              className="vocabulary-submit"
              value="Cập nhật"
            ></input>
          )}
        </form>
        <div className="professor-add-button-wrapper">
          <img
            onClick={goBack}
            width="50"
            height="50"
            src="https://img.icons8.com/ios-filled/50/2d9358/reply-arrow.png"
            alt="reply-arrow"
          />
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
            words.map((word, index) => {
              return (
                <div key={index} className="wordList-item">
                  <div className="eng-word">{word.engWord}</div>
                  <div className="word-type">{word.wordType}</div>
                  <div className="word-meaning">{word.meaning}</div>
                  <div className="word-meaning">{word.pronunciation}</div>
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
              );
            })}
        </div>
      </div>
    </>
  );
}
export default ProfessorVocabulary;
