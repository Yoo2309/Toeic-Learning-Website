import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Heading from "../../Common/Header/Heading";
import "./CourseHome.css";
import Loader from "../../Common/Loader/Loader";
import { toast } from "react-toastify";

function CourseHome({ subtitle, title }) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://localhost:7112/api/Course/GetAllCourses"
        );
        setIsLoading(false);
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
        setCourses(data);
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
    fetchCourses();
  }, []);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="lr-card-wrapper">
      <section>
        <div className="lr-card">
          <Heading subtitle={subtitle} title={title} />
          <div className="card-wrapper-container">
            <div className="card-wrapper">
              {courses &&
                courses.map((course, index) => {
                  return (
                    <div key={index} className="card">
                      <Link to={`/course-lessons/${course.idCourse}`}>
                        <div className="card-content">
                          <div className="image">
                            <img
                              src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-online-course-university-flaticons-flat-flat-icons-3.png"
                              alt=""
                            />
                          </div>
                          <h2>{course.name}</h2>
                          <p>{course.description}</p>
                        </div>
                      </Link>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CourseHome;
