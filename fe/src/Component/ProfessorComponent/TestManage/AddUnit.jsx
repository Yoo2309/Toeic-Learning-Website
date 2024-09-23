import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import "./AddUnit.css";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../.././Common/Loader/Loader";
import HTMLReactParser from "html-react-parser";
import { UserContext } from "../../../Context/UserContext";

function AddUnit({ idTestPart, toggle_modal, fetchUnit }) {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const editor = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const [audio, setAudio] = useState("");
  const [image, setImage] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [script, setScript] = useState("");
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
  async function handleAddUnit() {
    const formData = new FormData();
    formData.append("idTest", id);
    formData.append("idTestPart", idTestPart);
    if (paragraph) {
      formData.append("paragraph", paragraph);
    }
    if (audio) {
      formData.append("audio", audio);
    }
    if (image) {
      formData.append("image", image);
    }
    if (script) {
      formData.append("script", script);
    }
    if (translation) {
      formData.append("translation", translation);
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/TestQuestionUnit/AddTestQuestionUnit`,

        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error("Thêm bài học mới thất bại", {});
      } else {
        toast.success("Thêm bài học mới thành công");
        toggle_modal();
        fetchUnit();
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error}`);
    }
  }

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="add-lesson-wrapper">
      <div className="add-lesson-form-wrapper">
        <form onSubmit={handleAddUnit}>
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
                Xóa Ảnh
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
            {audioPreview && <audio src={audioPreview} controls></audio>}
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
            <h3>Script</h3>
            <textarea
              placeholder="Nhập Transcript"
              onChange={(e) => setScript(e.target.value)}
            ></textarea>
          </div>
          <div>
            <h3>Bản dịch</h3>
            <textarea
              placeholder="Nhập bản dịch"
              onChange={(e) => setTranslation(e.target.value)}
            ></textarea>
          </div>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <button type="submit" className="professor-add-lesson-btn">
              Thêm Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUnit;
