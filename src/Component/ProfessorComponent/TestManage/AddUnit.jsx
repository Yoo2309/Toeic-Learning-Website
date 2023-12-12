import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import "./AddUnit.css";
import { useNavigate, useParams } from "react-router-dom";
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
    }),
    []
  );
  useEffect(() => {
    let objectURL;
    if (image) {
      objectURL = URL.createObjectURL(image);
      setImagePreview(objectURL);
      return () => {
        URL.revokeObjectURL(objectURL);
      };
    }
  }, [image]);
  useEffect(() => {
    let objectURL;
    if (audio) {
      objectURL = URL.createObjectURL(audio);
      setAudioPreview(objectURL);
      return () => {
        URL.revokeObjectURL(objectURL);
      };
    }
  }, [audio]);

  async function handleAddUnit() {
    const formData = new FormData();
    formData.append("idTest", id);
    formData.append("idTestPart", idTestPart);
    formData.append("paragraph", paragraph);
    formData.append("audio", audio);
    formData.append("image", image);
    formData.append("script", script);
    formData.append("translation", translation);

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/TestQuestionUnit/AddTestQuestionUnit`,

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
        toggle_modal();
        fetchUnit();
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
              onChange={(e) => setImage(e.target.files[0])}
            ></input>
            {image && (
              <img
                src={imagePreview}
                alt="Uploaded"
                style={{ maxWidth: "100%" }}
              />
            )}
          </div>
          <div className="upload-audio">
            <h3>Upload Audio</h3>
            <input
              type="file"
              onChange={(e) => setAudio(e.target.files[0])}
            ></input>
            {audio && <audio src={audioPreview} controls></audio>}
          </div>
          <h3>Nội dung đoạn văn</h3>
          <JoditEditor
            ref={editor}
            value={paragraph}
            onChange={(newContent) => setParagraph(newContent)}
            config={config}
          ></JoditEditor>
          <h3>Kiểm tra lại nội dung</h3>
          <div>{HTMLReactParser(String(paragraph))}</div>
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
          <input
            type="submit"
            value="Thêm Unit"
            className="professor-add-lesson-btn"
          />
        </form>
      </div>
    </div>
  );
}

export default AddUnit;
