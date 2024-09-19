import React, { useContext, useEffect, useState } from "react";
import "./ProfessorTestManage.css";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";
import AddTest from "./AddTest";
import { UserContext } from "../../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { showDeleteWarning } from "../../Common/Alert/Alert";
import ReactPaginate from "react-paginate";

function ProfessorTestManage() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const [tests, setTest] = useState([]);
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  async function fetchTests() {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Test/GetAllTestByProfessor/${user.idUser}`
      );
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      }
      const data = await response?.json();
      setTest(data);
      setIsLoading(false);
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  useEffect(() => {
    fetchTests();
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (!modal) {
      fetchTests();
    }
  }, [modal]);

  async function DeleteTest(testId) {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Test/DeleteTest/${testId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) {
        toast.error(`${"Xóa đề thi thất bại"}`, {});
      }
      setIsLoading(false);
      toast.success("Xóa đề thi thành công", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 10000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      fetchTests();
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {<AddTest toggleModal={toggleModal} modal_on={modal} />}
      <div className="professor-test-wrapper">
        <div className="professor-board-header">
          <div className="professor-managment-title">
            <h3>QUẢN LÝ ĐỀ THI THỬ</h3>
          </div>
          <div className="professor-add-button" onClick={toggleModal}>
            <img
              width="34"
              height="34"
              src="https://img.icons8.com/doodle/48/add.png"
              alt="add"
            />
            <h3>THÊM ĐỀ THI MỚI</h3>
          </div>
        </div>
        <div className="test-grid-wrapper">
          <div className="test-grid">
            {tests &&
              tests
                .slice(currentPage * 8 - 8, currentPage * 8)
                .map((test, index) => {
                  return (
                    <div key={index} className="test-item">
                      <img
                        src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/100/external-online-test-online-education-flaticons-lineal-color-flat-icons-2.png"
                        alt=""
                      />
                      <div className="test-title">{test.name}</div>
                      <div className="btn-wrapper">
                        <button
                          className="delete-btn"
                          onClick={() =>
                            showDeleteWarning(() => DeleteTest(test.idTest))
                          }
                        >
                          Xóa
                        </button>
                        <button
                          className="update-btn"
                          onClick={() => {
                            navigate(`/professor/test/${test.idTest}`);
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
        <div className="pagination-wrapper">
          <ReactPaginate
            containerClassName={"pagination"}
            pageClassName={"page-item"}
            activeClassName={"active"}
            onPageChange={(event) => {
              setCurrentPage(event.selected + 1);
            }}
            pageCount={Math.ceil(tests.length / 8)}
            breakLabel="..."
            previousLabel={<i class="fa-solid fa-chevron-left page-item"></i>}
            nextLabel={<i class="fa-solid fa-chevron-right page-item"></i>}
          />
        </div>
      </div>
    </>
  );
}

export default ProfessorTestManage;
