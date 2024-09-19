import HTMLReactParser from "html-react-parser";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";
import ".././CourseManage/Lesson/Quiz/UpdateQuiz.css";

import Loader from "../../Common/Loader/Loader";
import AddQuestion from "./AddQuestion";
import { UserContext } from "../../../Context/UserContext";
import { showDeleteWarning } from "../../Common/Alert/Alert";

function UpdateUnit() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const editor = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isUpdate, setIsUpdate] = useState(true);
  const [current_question, setCurrentQuestion] = useState({});

  const [idTest, setIdTest] = useState("");
  const [idTestPart, setidTestPart] = useState("");
  const [audio, setAudio] = useState("");
  const [image, setImage] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");

  const [imagePreview, setImagePreview] = useState("");
  const [audioPreview, setAudioPreview] = useState("");
  const config = useMemo(
    () => ({
      toolbarButtonSize: "small",
      readonly: false,
      height: 600,
    }),
    []
  );

  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };
  const AddToggle = () => {
    setIsUpdate(false);
    toggleModal();
  };

  const updateToggle = (question) => {
    setCurrentQuestion(question);
    setIsUpdate(true);
    toggleModal();
  };
  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const handleDeleteImage = () => {
    var image_upload = document.getElementById("unit_image");
    image_upload.value = "";
    // Đặt lại trạng thái của input type file để cho phép chọn lại file
    image_upload.type = "file";
    setImage("");
  };
  const handleDeleteAudio = () => {
    var audio_upload = document.getElementById("unit_audio");
    audio_upload.value = "";
    // Đặt lại trạng thái của input type file để cho phép chọn lại file
    audio_upload.type = "file";
    setAudio("");
  };

  useEffect(() => {
    let objectURL;
    if (image instanceof File || image instanceof Blob) {
      objectURL = URL.createObjectURL(image);
      setImagePreview(objectURL);
      return () => {
        URL.revokeObjectURL(objectURL);
      };
    } else {
      setImagePreview(image);
    }
  }, [image]);
  useEffect(() => {
    let objectURL;
    if (audio instanceof File || audio instanceof Blob) {
      objectURL = URL.createObjectURL(audio);
      setAudioPreview(objectURL);
      return () => {
        URL.revokeObjectURL(objectURL);
      };
    } else {
      setAudioPreview(audio);
    }
  }, [audio]);
  async function fetchTestUnit() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/TestQuestionUnit/GetTestQuestionUnitById/${id}`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      }
      const data = await response?.json();

      setImage(data.image);
      setAudio(data.audio);
      setParagraph(data.paragraph);
      setTranscript(data.script);
      setTranslation(data.translation);
      setidTestPart(data.idTestPart);
      setIdTest(data.idTest);
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  useEffect(() => {
    fetchTestUnit();
    fetchQuestionByUnit();
  }, []);
  useEffect(() => {
    if (!modal) {
      fetchTestUnit();
      fetchQuestionByUnit();
    }
  }, [modal]);
  async function handleUpdateUnit() {
    const formData = new FormData();
    formData.append("idTest", idTest);
    formData.append("idTestPart", idTestPart);
    if (paragraph) {
      formData.append("paragraph", paragraph);
    }
    if (audio) {
      if (audio instanceof File || audio instanceof Blob) {
        formData.append("newAudio", audio);
      } else if (typeof audio === "string" && audio.trim() !== "") {
        formData.append("oldAudio", audio);
      }
    }
    if (image) {
      if (image instanceof File || image instanceof Blob) {
        formData.append("newImage", image);
      } else if (typeof image === "string" && image.trim() !== "") {
        formData.append("oldImage", image);
      }
    }
    if (transcript) {
      formData.append("script", transcript);
    }
    if (translation) {
      formData.append("translation", translation);
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/TestQuestionUnit/UpdateTestQuestionUnit/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error("Chỉnh sửa unit của đề thi thất bại", {});
      } else {
        toast.success("Chỉnh sửa unit của đề thi thành công");
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error}`);
    }
  }

  async function fetchQuestionByUnit() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Question/GetAllQuestionByUnit/${id}`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      }
      const data = await response?.json();
      setQuestions(data);
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  const handleDeleteQuestion = async (id) => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Question/DeleteQuestion/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error(`Xóa câu hỏi thất bại`, {});
      } else {
        toast.success("Xóa câu hỏi thành công");
        fetchQuestionByUnit();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="add-lesson-wrapper">
      <div className="professor-board-header">
        <div className="professor-managment-title">
          <h3 style={{ marginLeft: "1rem" }}>QUẢN LÝ UNIT</h3>
        </div>
        <div>
          <img
            onClick={() => navigate(`/professor/test/${idTest}`)}
            width="50"
            height="50"
            src="https://img.icons8.com/ios-filled/50/2d9358/reply-arrow.png"
            alt="reply-arrow"
          />
        </div>
      </div>
      <div className="add-lesson-form-wrapper">
        <form onSubmit={handleUpdateUnit}>
          <div className="upload-image">
            <h3>Upload Image</h3>
            <input
              type="file"
              id="unit_image"
              onChange={(e) => setImage(e.target.files[0])}
            ></input>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Uploaded"
                style={{ maxWidth: "100%" }}
              />
            )}
            <div>
              <button
                style={{
                  fontSize: 16,
                  padding: "3px 8px",
                  border: "1px solid #000",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteImage();
                }}
              >
                Xóa ảnh
              </button>
            </div>
          </div>
          <div className="upload-audio">
            <h3>Upload Audio</h3>
            <input
              type="file"
              id="unit_audio"
              onChange={(e) => setAudio(e.target.files[0])}
            ></input>
            {audio && <audio src={audioPreview} controls></audio>}
            <div>
              <button
                style={{
                  fontSize: 16,
                  padding: "3px 8px",
                  border: "1px solid #000",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteAudio();
                }}
              >
                Xóa Audio
              </button>
            </div>
          </div>
          <h3>Nội dung đoạn văn</h3>
          <JoditEditor
            ref={editor}
            value={paragraph}
            onChange={(newContent) => setParagraph(newContent)}
            config={config}
          ></JoditEditor>
          <h3>Kiểm tra lại nội dung</h3>
          <div style={{ maxHeight: 400, overflowY: "scroll" }}>
            {HTMLReactParser(String(paragraph))}
          </div>
          <div>
            <h3>Transcript</h3>
            <textarea
              placeholder="Nhập Transcript"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            ></textarea>
          </div>
          <div>
            <h3>Bản dịch</h3>
            <textarea
              placeholder="Nhập bản dịch"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
            ></textarea>
          </div>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <button type="submit" className="professor-add-lesson-btn">
              Cập nhật Unit
            </button>
          </div>
        </form>
      </div>
      {modal && (
        <AddQuestion
          isUpdate={isUpdate}
          toggleModal={toggleModal}
          modal_on={modal}
          initial_question={current_question}
          idUnit={id}
        />
      )}
      <div className="professor-quiz-wrapper">
        <div className="professor-board-header">
          <div className="professor-managment-title">
            <h3 style={{ marginLeft: "1rem" }}>QUẢN LÝ CÂU HỎI ĐỀ THI</h3>
          </div>
          <div className="professor-add-button" onClick={AddToggle}>
            <img
              width="34"
              height="34"
              src="https://img.icons8.com/doodle/48/add.png"
              alt="add"
            />
            <h3>THÊM CÂU HỎI MỚI</h3>
          </div>
        </div>
        <div className="quiz-question-list-wrapper">
          {questions &&
            questions.map((question, index) => {
              return (
                <div key={index} className="question-list-item">
                  <div className="qquestion-list-item">
                    <div>{question.content}</div>
                    <div className="question-choice">
                      A. {question.choice_1}
                    </div>
                    <div className="question-choice">
                      B. {question.choice_2}
                    </div>
                    <div className="question-choice">
                      C. {question.choice_3}
                    </div>
                    <div className="question-choice">
                      D. {question.choice_4}
                    </div>
                    <div>{`=> ${
                      question.answer === "1"
                        ? `A. ${question.choice_1}`
                        : question.answer === "2"
                        ? `B. ${question.choice_2}`
                        : question.answer === "3"
                        ? `C. ${question.choice_3}`
                        : `D. ${question.choice_4}`
                    }`}</div>
                    <div>{question.explaination}</div>
                  </div>
                  <div className="btn-wrapper">
                    <button
                      className="delete-btn"
                      onClick={() =>
                        showDeleteWarning(() =>
                          handleDeleteQuestion(question.idQuestion)
                        )
                      }
                    >
                      Xóa
                    </button>
                    <button
                      className="update-btn"
                      onClick={() => updateToggle(question)}
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
  );
}

export default UpdateUnit;
