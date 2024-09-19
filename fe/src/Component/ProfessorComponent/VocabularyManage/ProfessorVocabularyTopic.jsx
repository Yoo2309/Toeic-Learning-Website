import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { showDeleteWarning } from "../../Common/Alert/Alert";
import Loader from "../../Common/Loader/Loader";
import "./ProfessorVocabularyTopic.css";
import AddVocabularyTopic from "./AddVocabularyTopic";
import { UserContext } from "../../../Context/UserContext";
import ReactPaginate from "react-paginate";

function ProfessorVocabularyTopic() {
  const { user } = useContext(UserContext);
  const [topics, setTopic] = useState([]);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
        }/VocList/GetVocListByUser/${user.idUser}`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`, {});
      } else {
        const data = await response?.json();
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
        }/VocList/DeleteVocList/${voc_topic_id}`,
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
        toast.error(`Xóa danh sách từ vựng thất bại`, {});
      } else {
        fetchVocabularyTopic();
        toast.success("Xóa danh sách từ vựng thành công");
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
      <AddVocabularyTopic
        toggleModal={toggleModal}
        modal_on={modal}
        initTopic={currentTopic}
      />
      <div className="professor-vocabulary-wrapper">
        <div className="professor-board-header">
          <div className="professor-managment-title">
            <h3>QUẢN LÝ DANH SÁCH TỪ VỰNG</h3>
          </div>
          <div
            className="professor-add-button"
            onClick={() => {
              toggleModal();
              setCurrentTopic(null);
            }}
          >
            <img
              width="34"
              height="34"
              src="https://img.icons8.com/doodle/48/add.png"
              alt="add"
            />
            <h3>TẠO DANH SÁCH MỚI</h3>
          </div>
        </div>
        <div className="vocabulary-grid-wrapper">
          {topics && topics.length > 0 ? (
            <div className="vocabulary-grid">
              {topics
                ?.slice(currentPage * 8 - 8, currentPage * 8)
                .map((topic, index) => (
                  <a
                    key={index}
                    className="vocabulary-item"
                    href={`/professor/vocabulary/${topic.idVocList}`}
                  >
                    <div className="vocabulary-title text-truncate">
                      {topic.title}
                    </div>
                    <div className="vocabulary-title-detail-description">
                      {topic.description}
                    </div>
                    <div className="vocabulary-title-detail">
                      Ngày tạo: {topic.createDate}
                    </div>
                    <div className="vocabulary-title-detail text-truncate">
                      Số lượng từ: {topic.quantity} từ
                    </div>
                    <div className="vocabulary-title-detail">
                      Trạng thái: {topic.isPublic ? "công khai" : "riêng tư"}
                    </div>
                    <div className="btn-wrapper">
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          showDeleteWarning(() =>
                            DeleteVocabularyTopic(topic.idVocList)
                          );
                        }}
                      >
                        Xóa
                      </button>
                      <button
                        className="update-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentTopic(topic);
                          toggleModal();
                        }}
                      >
                        Sửa
                      </button>
                    </div>
                  </a>
                ))}
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                marginTop: 16,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  padding: "8px 16px",
                  fontSize: 16,
                  fontWeight: 600,
                  background: "#E7FFFC",
                  display: "flex",
                  justifyContent: "center",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <i className="fa-solid fa-circle-info"></i>
                Chưa có danh sách từ vựng, hãy tạo mới!
              </div>
            </div>
          )}
          <div className="pagination-wrapper">
            <ReactPaginate
              containerClassName={"pagination"}
              pageClassName={"page-item"}
              activeClassName={"active"}
              onPageChange={(event) => {
                setCurrentPage(event.selected + 1);
              }}
              pageCount={Math.ceil(topics.length / 8)}
              breakLabel="..."
              previousLabel={<i class="fa-solid fa-chevron-left page-item"></i>}
              nextLabel={<i class="fa-solid fa-chevron-right page-item"></i>}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfessorVocabularyTopic;
