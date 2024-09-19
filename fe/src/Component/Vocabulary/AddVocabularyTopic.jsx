import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddVocabularyTopic.css";
import { useForm } from "react-hook-form";
import { UserContext } from "../../Context/UserContext";
import { toast } from "react-toastify";
import Loader from "../Common/Loader/Loader";
import { IoAddOutline } from "react-icons/io5";

function AddVocabularyTopic({ toggleModal, modal_on, wordId }) {
  const { user } = useContext(UserContext);
  const [userList, setUserList] = useState([]);
  const [voc, setVoc] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register: vocabulary_topic,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  async function handleAddVocabularyTopic(listId, wordId) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Vocabulary/AddVocFromExistList`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idVoc: wordId,
            idList: listId,
          }),
        }
      );
      setIsLoading(false);
      toggleModal();
      if (!response.ok) {
        toast.error(`Thêm từ vựng thất bại`);
      } else {
        toast.success("Thêm từ vựng thành công.");
      }
      reset();
    } catch (error) {
      console.log(error);
      toast.error(`${error}`);
    }
  }
  useEffect(() => {
    async function fetchUserList() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL ?? "/api"
          }/VocList/GetVocListByUser/${user.idUser}`
        );
        setIsLoading(false);
        if (!response.ok) {
          const errorData = await response?.json();
          toast.error(`${errorData.message}`);
        } else {
          const data = await response?.json();
          setUserList(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserList();
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    reset();
  }, [modal_on]);
  if (isloading) {
    return <Loader />;
  }
  return (
    <div className="professor-vocabulary-topic">
      {modal_on && (
        <div className="vocabulary-topic-modal">
          <div onClick={() => toggleModal(!modal_on)} className="overlay"></div>
          <div className="vocabulary-topic-panel">
            <div className="vocabulary-topic-content">
              <div className="vocabulary-topic-close-btn">
                <svg
                  onClick={() => toggleModal(!modal_on)}
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="34"
                  height="34"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#E04F5F"
                    d="M504.1,256C504.1,119,393,7.9,256,7.9C119,7.9,7.9,119,7.9,256C7.9,393,119,504.1,256,504.1C393,504.1,504.1,393,504.1,256z"
                  ></path>
                  <path
                    fill="#FFF"
                    d="M285,256l72.5-84.2c7.9-9.2,6.9-23-2.3-31c-9.2-7.9-23-6.9-30.9,2.3L256,222.4l-68.2-79.2c-7.9-9.2-21.8-10.2-31-2.3c-9.2,7.9-10.2,21.8-2.3,31L227,256l-72.5,84.2c-7.9,9.2-6.9,23,2.3,31c4.1,3.6,9.2,5.3,14.3,5.3c6.2,0,12.3-2.6,16.6-7.6l68.2-79.2l68.2,79.2c4.3,5,10.5,7.6,16.6,7.6c5.1,0,10.2-1.7,14.3-5.3c9.2-7.9,10.2-21.8,2.3-31L285,256z"
                  ></path>
                </svg>
              </div>
              <form onSubmit={handleSubmit(handleAddVocabularyTopic)}>
                <div className="add-vocabulary-topic-title">
                  <h2>Lựa chọn danh sách từ vựng của bạn</h2>
                </div>
                <div className="vocabulary-topic-grid-wrapper">
                  <div className="">
                    {userList && userList.length > 0 ? (
                      userList.map((val, index) => {
                        return (
                          <div
                            key={val.idVocList}
                            className="vocabulary__topic-item"
                            style={{
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              padding: "10px",
                              marginBottom: "10px",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              backgroundColor: "#f9f9f9",
                            }}
                          >
                            <div>
                              <div
                                style={{ fontSize: "16px", fontWeight: "bold" }}
                              >
                                {val.title}
                              </div>
                              <div style={{ fontSize: "13px" }}>
                                Có {val.quantity} từ
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                handleAddVocabularyTopic(val.idVocList, wordId);
                              }}
                              style={{
                                padding: "8px 12px",
                                border: "none",
                                borderRadius: "4px",
                                backgroundColor: "#007BFF",
                                color: "#fff",
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#47849e")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#007BFF")
                              }
                            >
                              Thêm
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div
                        style={{
                          fontSize: "16px",
                          display: "flex",
                        }}
                      >
                        Bạn chưa có danh sách từ. Hãy tạo mới!
                        <button
                          onClick={() => {
                            navigate(`/vocabulary-by-user/${user.idUser}`);
                          }}
                          style={{
                            padding: "8px 12px",
                            border: "none",
                            borderRadius: "4px",
                            backgroundColor: "#007BFF",
                            color: "#fff",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                            marginLeft: "20px",
                            display: "flex",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#47849e")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#007BFF")
                          }
                        >
                          <IoAddOutline />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddVocabularyTopic;
