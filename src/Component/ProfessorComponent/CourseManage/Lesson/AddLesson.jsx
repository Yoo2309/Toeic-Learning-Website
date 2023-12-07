import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import "./AddLesson.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../../Common/Loader/Loader";
import HTMLReactParser from "html-react-parser";

function AddLesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);
  const config = useMemo(
    () => ({
      toolbarButtonSize: "small",
      readonly: false,
    }),
    []
  );

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  async function handleAddLesson(data) {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://localhost:7112/api/Lesson/AddLesson`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            idCourse: id,
            title: title,
            content: content,
          }),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error("Add lesson failded", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.success("Add lesson successfully", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 10000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    navigate(`/professor/course/${id}`);
  }

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="add-lesson-wrapper">
      <div className="professor-board-header">
        <div className="professor-managment-title">
          <h3 style={{ marginLeft: "1rem" }}>THÊM BÀI HỌC MỚI</h3>
        </div>
        <img
          onClick={() => navigate(`/professor/course/${id}`)}
          width="50"
          height="50"
          src="https://img.icons8.com/ios-filled/50/2d9358/reply-arrow.png"
          alt="reply-arrow"
        />
      </div>
      <div className="add-lesson-form-wrapper">
        <form onSubmit={handleAddLesson}>
          <div>
            <h3>Tên bài học</h3>
            <input
              placeholder="Nhập tên bài học"
              onChange={(e) => setTitle(e.target.value)}
            ></input>
          </div>

          <h3>Nội dung bài học</h3>
          <JoditEditor
            ref={editor}
            value={content}
            onChange={(newContent) => setContent(newContent)}
            config={config}
          ></JoditEditor>
          <h3>Kiểm tra lại</h3>
          <div>{HTMLReactParser(String(content))}</div>
          <input
            type="submit"
            value="Thêm bài học"
            className="professor-add-lesson-btn"
          />
        </form>
      </div>
    </div>
  );
}

export default AddLesson;
