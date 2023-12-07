import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";
import "./CourseManageIndex.css";
import AddCourse from "./AddCourse";
import { useNavigate } from "react-router-dom";

function CourseManageIndex() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }
  async function fetchCourses() {
    try {
      const response = await fetch(
        "https://localhost:7112/api/Course/GetAllCourses"
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
      setCourses(data);
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

  async function DeleteCourse(courseId) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://localhost:7112/api/Course/DeleteCourse/${courseId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        toast.error("Delete topic failed", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        setIsLoading(false);
        fetchCourses();
        toast.success("Delete topic successfully", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 10000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
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

  useEffect(() => {
    fetchCourses();
  }, []);
  useEffect(() => {
    if (!modal) {
      fetchCourses();
    }
  }, [modal]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      <>
        <AddCourse toggleModal={toggleModal} modal_on={modal} />
        <div className="professor-course-wrapper">
          <div className="professor-board-header">
            <div className="professor-managment-title">
              <h3>QUẢN LÝ KHÓA HỌC</h3>
            </div>
            <div className="professor-add-button" onClick={toggleModal}>
              <img
                width="34"
                height="34"
                src="https://img.icons8.com/doodle/48/add.png"
                alt="add"
              />
              <h3>THÊM KHÓA HỌC MỚI</h3>
            </div>
          </div>
          <div className="professor-course-grid-wrapper">
            <div className="professor-course-grid">
              {courses &&
                courses.map((course, index) => {
                  return (
                    <div
                      key={course.index}
                      className="professor-courses-list-item"
                    >
                      <div className="image">
                        <img
                          src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-online-course-university-flaticons-flat-flat-icons-3.png"
                          alt=""
                        />
                      </div>
                      <h2>{course.name}</h2>
                      <div className="btn-wrapper">
                        <button
                          className="delete-btn"
                          onClick={() => DeleteCourse(course.idCourse)}
                        >
                          Xóa
                        </button>
                        <button
                          className="update-btn"
                          onClick={() =>
                            navigate(`/professor/course/${course.idCourse}`)
                          }
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
    </div>
  );
}

export default CourseManageIndex;
