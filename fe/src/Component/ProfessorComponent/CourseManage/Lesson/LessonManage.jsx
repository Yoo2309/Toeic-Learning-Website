import React, { useContext, useEffect, useState } from "react";
import "./LessonManage.css";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../../../../Context/UserContext";
import { showDeleteWarning } from "../../../Common/Alert/Alert";
import Loader from "../../../Common/Loader/Loader";

function LessonManage() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [lessons, setLessons] = useState([]);

  const {
    register: course,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  async function fetchCurrentLesson() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Course/GetCourseById/${id}`
      );
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData}`);
      }
      const data = await response?.json();
      // setCurrentCourse(data);
      setValue("idCourse", data.idCourse);
      setValue("name", data.name);
      setValue("description", data.description);
      setValue("isVip", data.isVip);
      setIsLoading(false);
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  async function UpdateCurrentCourse(course) {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Course/UpdateCourse/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            idUser: user.idUser,
            name: course.name,
            description: course.description,
            isVip: course.isVip,
          }),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error("Chỉnh sửa khóa học thất bại", {});
      } else {
        toast.success("Chỉnh sửa khóa học thành công");
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
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
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response?.json();
        setLessons(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  const handleDeleteLesson = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Lesson/DeleteLesson/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({}),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error(`Xóa bài học thất bại`, {});
      } else {
        toast.success("Xóa bài học thành công");
        fetchLessons();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  useEffect(() => {
    fetchCurrentLesson();
    fetchLessons();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="professor-lesson-list">
      <div className="professor-managment-sub-title">
        <h3 style={{ paddingLeft: "10px" }}>QUẢN LÝ CÁC BÀI HỌC</h3>
      </div>

      <form
        className="update-lesson"
        onSubmit={handleSubmit(UpdateCurrentCourse)}
      >
        <div style={{ width: "50%", textAlign: "center" }}>
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <div className="input-field">
              <input
                type="text"
                onFocus={() => setShowButton(true)}
                {...course("name", { required: true })}
              />
            </div>
            {showButton && (
              <img
                onClick={() => setShowButton(false)}
                width="32"
                height="32"
                src="https://img.icons8.com/windows/32/circled-chevron-down.png"
                alt="circled-chevron-down"
              />
            )}
          </div>
          <error>
            {errors.name?.type === "required" && "Không được để trống tên"}
          </error>
        </div>
        {showButton && (
          <>
            <div style={{ display: "flex", width: "fit-content", gap: 4 }}>
              <input
                style={{ height: 36, width: 26 }}
                type="checkbox"
                {...course("isVip")}
              />
              <div style={{ padding: 4 }}>Is VIP?</div>
            </div>
            <div className="input-field description">
              <textarea
                type="text"
                {...course("description", { required: true })}
              />
            </div>
            <error>
              {errors.description?.type === "required" &&
                "Không được để trống tên"}
            </error>
            <input
              type="submit"
              className="lesson-submit"
              value="Cập nhật"
            ></input>
          </>
        )}
      </form>

      <div className="professor-add-button-wrapper">
        <img
          onClick={() => navigate("/professor/course")}
          width="50"
          height="50"
          src="https://img.icons8.com/ios-filled/50/2d9358/reply-arrow.png"
          alt="reply-arrow"
        />
        <div
          className="professor-add-button"
          onClick={() => navigate(`/professor/course/lesson/add/${id}`)}
        >
          <img
            width="34"
            height="34"
            src="https://img.icons8.com/doodle/48/add.png"
            alt="add"
          />
          <h3>THÊM BÀI HỌC MỚI</h3>
        </div>
      </div>
      <div className="lesson-list-wrapper">
        {lessons &&
          lessons.map((lesson, index) => {
            return (
              <div key={index} className="lesson-list-item">
                <div className="">{lesson.title}</div>
                <div className="btn-wrapper">
                  <button
                    className="delete-btn"
                    onClick={() =>
                      showDeleteWarning(() =>
                        handleDeleteLesson(lesson.idLesson)
                      )
                    }
                  >
                    Xóa
                  </button>
                  <button
                    className="update-btn"
                    onClick={() =>
                      navigate(`/professor/course/lesson/${lesson.idLesson}`)
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
  );
}

export default LessonManage;
