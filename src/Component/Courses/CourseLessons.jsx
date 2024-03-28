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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchLessons() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL ?? "/api"
          }/Lesson/GetAllLessonByCourse/${id}`
        );
        setIsLoading(false);
        if (!response.ok) {
          const errorData = await response.json();
          toast.error(`${errorData.message}`);
        } else {
          const data = await response.json();
          setLessons(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    async function fetchOtherCourses() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Course/GetAllCourses`
        );
        setIsLoading(false);
        if (!response.ok) {
          const errorData = await response.json();
          toast.error(`${errorData.message}`);
        } else {
          const data = await response.json();
          setCurrentCourse(data.find((course) => course.idCourse === id));
          setOtherCourses(data.filter((course) => course.idCourse !== id));
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchLessons();
    fetchOtherCourses();
  }, [id]);

  return (
    <div>
      <div className="course-lesson-wrapper">
        <Heading subtitle={current_course.name} />
        {isLoading ? (
          <Loader />
        ) : (
          <div className="container course-lesson-card">
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
        )}
      </div>
    </div>
  );
}

export default CourseLessons;
