import React, { useContext } from "react";
import "./CourseLessons.css";
import Heading from "../Common/Header/Heading";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Common/Loader/Loader";
import { toast } from "react-toastify";
import { UserContext } from "../../Context/UserContext";

function CourseLessons() {
  const [lessons, setLessons] = useState([]);
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [current_course, setCurrentCourse] = useState({});
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchLessons() {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Lesson/GetAllLessonByCourse/${current_course.idCourse ?? id}`
      );
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response?.json();
        setLessons(data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchOtherCourses() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Course/GetAllCourses`
      );
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response?.json();
        setCurrentCourse(data.find((course) => course.idCourse === id));
        setCourses(data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchLessons(), fetchOtherCourses()]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (current_course) fetchLessons();
  }, [current_course]);

  if (current_course?.isVip && user.role[1] !== "VipStudent") {
    navigate("/vippackage");
  }
  if (isLoading) return <Loader />;
  return (
    <div>
      <div className="course-lesson-wrapper">
        <div data-testid="course-title">
          <Heading subtitle={current_course.name} />
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="course-lesson-card">
            <div className="list-lesson-wrapper">
              <div className="list-lesson">
                {lessons &&
                  lessons.map((lesson, index) => {
                    return (
                      <div
                        key={index}
                        className="list-lesson-item"
                        onClick={() => navigate(`/lesson/${lesson.idLesson}`)}
                      >
                        <div className="list-lesson-name">{lesson.title}</div>
                        {lesson.isVip ? (
                          <div
                            style={{ position: "absolute", top: 12, right: 8 }}
                          >
                            <img
                              width="34"
                              height="34"
                              src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-vip-music-festival-flaticons-flat-flat-icons.png"
                              alt=""
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    );
                  })}
              </div>
              <div className="other-course-wrapper">
                <div className="title">Các khóa học khác</div>
                <div className="other-course-list">
                  {courses &&
                    courses.map((other_course, index) => {
                      if (other_course.idCourse !== current_course.idCourse) {
                        return (
                          <div
                            key={index}
                            className="course-item"
                            onClick={() => setCurrentCourse(other_course)}
                          >
                            {other_course.name}
                            {other_course.isVip && (
                              <img
                                width="34"
                                height="34"
                                src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-vip-music-festival-flaticons-flat-flat-icons.png"
                                alt=""
                              />
                            )}
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseLessons;
