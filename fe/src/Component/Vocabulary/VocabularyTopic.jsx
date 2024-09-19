import { CiCalendar } from "react-icons/ci";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Loader from "../Common/Loader/Loader";
import styles from "./VocabularyTopic.module.css";
import Heading from "../Common/Header/Heading";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineFlipToFront } from "react-icons/md";
import classNames from "classnames/bind";
import { UserContext } from "../../Context/UserContext";
import ReactPaginate from "react-paginate";

const cx = classNames.bind(styles);

function VocabularyTopic() {
  const [topics, setTopic] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);

  async function fetchVocabularyTopic() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/VocList/GetAllPublicVocList`
      );
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response?.json();
        setTopic(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchVocabularyTopic();
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) return <Loader />;
  return (
    <div className="vocabulary-topic-wrapper">
      <div className="container vocabulary-topic">
        <Heading
          subtitle="VictoryU"
          title="Danh sách từ vựng thường gặp trong bài thi TOEIC"
        />
        {user.auth && (
          <Link
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
            to={`/vocabulary-by-user/${user.idUser}`}
          >
            <button
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#007BFF",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                transition: "background-color 0.3s",
                marginRight: 16,
              }}
            >
              Đến trang Từ vựng của bạn
            </button>
          </Link>
        )}
        <div className={cx("wrapper")}>
          <div className={cx("gridview")}>
            {topics &&
              topics?.slice(currentPage * 9 - 9, currentPage * 9).map((val) => {
                return (
                  <Link
                    key={val.idVocList}
                    className={cx("item")}
                    to={`/vocabulary-by-topic/${val.idVocList}`}
                  >
                    <div className={cx("content")}>
                      <div className={cx("title")}>{val.title}</div>
                      <p className={cx("description")}>{val.description}</p>
                      <p className={cx("author")}>
                        <AiOutlineUser />
                        {val.author}
                      </p>
                      <div className={cx("quantity")}>
                        <p className={cx("label")}>
                          <MdOutlineFlipToFront /> Số lượng từ:{" "}
                        </p>
                        {val.quantity} từ
                      </div>
                      <div className={cx("createdate")}>
                        <p className={cx("label")}>
                          {" "}
                          <CiCalendar /> Ngày tạo:{" "}
                        </p>
                        {val.createDate}
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
          <div className="pagination-wrapper">
            <ReactPaginate
              containerClassName={"pagination"}
              pageClassName={"page-item"}
              activeClassName={"active"}
              onPageChange={(event) => {
                console.log(event.selected);
                setCurrentPage(event.selected + 1);
              }}
              pageCount={Math.ceil(topics.length / 9)}
              breakLabel="..."
              previousLabel={<i class="fa-solid fa-chevron-left page-item"></i>}
              nextLabel={<i class="fa-solid fa-chevron-right page-item"></i>}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VocabularyTopic;
