import React from "react";
import { useState, useEffect } from "react";
import Heading from "../Common/Header/Heading";
import TestHome from "../Home/TestHome/TestHome";
import { Link } from "react-router-dom";
import "./Courses.css";
import Loader from "../Common/Loader/Loader";
import { toast } from "react-toastify";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Course/GetAllCourses`
        );
        setIsLoading(false);
        if (!response.ok) {
          const errorData = await response?.json();
          toast.error(`${errorData.message}`);
        } else {
          const data = await response?.json();
          setCourses(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchCourses();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="courses-list-wrapper">
      <div className="container courses-list">
        <Heading subtitle="VictoryU" title="Các khóa học của VictoryU" />
        {isLoading ? <Loader /> : <></>}
        <div className="courses-list-grid-wrapper">
          <div className="courses-list-gridview">
            {courses &&
              courses.map((course) => {
                return (
                  <div key={course.idCourse} className="courses-list-item">
                    <Link to={`/course-lessons/${course.idCourse}`}>
                      <div className="course-item">
                        <div className="image">
                          <img
                            src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-online-course-university-flaticons-flat-flat-icons-3.png"
                            alt=""
                          />
                          {course.isVip ? (
                            <div
                              style={{ position: "absolute", top: 0, right: 0 }}
                            >
                              <img
                                width="64"
                                height="64"
                                src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-vip-music-festival-flaticons-flat-flat-icons.png"
                                alt=""
                              />
                            </div>
                          ) : (
                            <></>
                          )}
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
        <TestHome subtitle="" title="Thực hiện các bài thi TOEIC" />
      </div>
    </div>
  );
}

export default Courses;
