import React from "react";
import "./CourseLessons.css";
import Heading from "../Common/Header/Heading";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Loader from "../Common/Loader/Loader";
import { toast } from "react-toastify";

function CourseLessons() {
  const [lessons, setLessons] = useState([]);
  const { id } = useParams();
  const [current_course, setCurrentCourse] = useState({});
  const [other_courses, setOtherCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLessons() {
      try {
        const response = await fetch(
          `https://localhost:7112/api/Lesson/GetAllLessonByCourse/${id}`
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
        setLessons(data);
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
    async function fetchOtherLessons() {
      try {
        const response = await fetch(
          "https://localhost:7112/api/Course/GetAllCourses"
        );
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
        setCurrentCourse(data.find((course) => course.idCourse === id));
        setOtherCourses(data.filter((course) => course.idCourse !== id));
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
    fetchLessons();
    fetchOtherLessons();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="course-lesson-wrapper">
        <div className="container course-lesson-card">
          <Heading subtitle={current_course.name} />
          <div className="list-lesson-wrapper">
            <div className="list-lesson">
              {lessons &&
                lessons.map((lesson, index) => {
                  return (
                    <div key={index} className="list-lesson-item">
                      <Link to={`/lesson/${lesson.idLesson}`}>
                        <div className="list-lesson-name">{lesson.title}</div>
                      </Link>
                    </div>
                  );
                })}
            </div>
            <div className="other-course-wrapper">
              <div className="title">Các khóa học khác</div>
              <div className="other-course-list">
                {other_courses &&
                  other_courses.map((other_course, index) => {
                    return (
                      <div key={index} className="course-item">
                        <Link to={`/course-lessons/${other_course.idCourse}`}>
                          {other_course.name}
                        </Link>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseLessons;
