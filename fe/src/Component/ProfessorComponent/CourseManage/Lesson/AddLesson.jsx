import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import "./AddLesson.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../../Common/Loader/Loader";
import { UserContext } from "../../../../Context/UserContext";
import HTMLReactParser from "html-react-parser";

function AddLesson() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const editor = useRef(null);
  const config = useMemo(
    () => ({
      toolbarButtonSize: "small",
      readonly: false,
      height: 600,
    }),
    []
  );

  const [formData, setFormData] = useState({
    content: "",
    title: "",
    isVip: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddLesson(data) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Lesson/AddLesson`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            idCourse: id,
            title: formData.title,
            content: formData.content,
            isVip: formData.isVip,
          }),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error("Thêm bài học mới thất bại", {});
      } else {
        toast.success("Thêm bài học mới thành công");
      }
    } catch (error) {
      toast.error(`${error}`);
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
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            ></input>
          </div>
          <div style={{ display: "flex", width: "fit-content", gap: 4 }}>
            <input
              style={{ height: 36, width: 26 }}
              type="checkbox"
              checked={formData.isVip}
              onChange={(e) =>
                setFormData({ ...formData, isVip: e.currentTarget.checked })
              }
            />
            <div style={{ padding: 4 }}>Is VIP?</div>
          </div>

          <h3>Nội dung bài học</h3>
          <JoditEditor
            ref={editor}
            value={formData.content}
            onChange={(newContent) =>
              setFormData({ ...formData, content: newContent })
            }
            config={config}
          ></JoditEditor>
          <h3>Kiểm tra lại</h3>
          <div style={{ maxHeight: 400, overflowY: "scroll" }}>
            {HTMLReactParser(String(formData.content))}
          </div>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <button type="submit" className="professor-add-lesson-btn">
              Thêm bài học
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddLesson;
