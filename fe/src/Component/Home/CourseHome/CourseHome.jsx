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
  }, []);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="lr-card-wrapper">
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
                          {course.isVip ? (
                            <div
                              style={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                              }}
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
      </div>  
    </div>
  );
}

export default CourseHome;
