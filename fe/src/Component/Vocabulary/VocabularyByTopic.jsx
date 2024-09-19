import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineUser,
} from "react-icons/ai";
import "./VocabularyByTopic.css";
import Heading from "../Common/Header/Heading";
import Loader from "../Common/Loader/Loader";
import { toast } from "react-toastify";
import { useSpeechSynthesis } from "react-speech-kit";
import speaker_gif from "../../assets/icons8-speaker.gif";
import AddVocabularyTopic from "./AddVocabularyTopic";
import { UserContext } from "../../Context/UserContext";
import { MdOutlineFlipToFront } from "react-icons/md";
import { CiCalendar } from "react-icons/ci";
import styles from "./VocabularyTopic.module.css";
import classNames from "classnames/bind";
import { showDeleteWarning } from "../Common/Alert/Alert";
import Modal from "./Modal";
import ModalUpdateVoc from "./ModalUpdateVoc";
import { IoAddOutline } from "react-icons/io5";
import vocDefault from "../../assets/voc-default.png";
import { base64ToFile } from "../../constant/convertBase64";
import { getImageFileFromUrl } from "../ProfessorComponent/VocabularyManage/AddVocabulary";
import Autocomplete from "react-autocomplete";
import { VocabularyContext } from "../../Context/VocabularyContext";

const cx = classNames.bind(styles);

function VocabularyByTopic() {
  const [words, setWords] = useState([]);
  const { allWords } = useContext(VocabularyContext);
  const [listInfo, setListInfo] = useState("");
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [play_pronun, setPlay_pronun] = useState(false);
  const onEnd = () => {
    setPlay_pronun(false);
  };
  const { speak } = useSpeechSynthesis({ onEnd });
  const [openAddModal, setOpenAddModal] = useState(false);
  const { user } = useContext(UserContext);
  const [wordId, setWordId] = useState("");
  const [isModalAddVocOpen, setIsModalAddVocOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState({});
  const [vocSelected, setVocSelected] = useState("");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    idList: id,
    topic: "",
    engWord: "",
    pronunciation: "",
    wordType: "",
    meaning: "",
    image: null,
    example: "",
    status: false,
  });

  useEffect(() => {
    if (isEdit && vocSelected) {
      setFormData({
        idList: id,
        topic: vocSelected.topic,
        engWord: vocSelected.engWord,
        pronunciation: vocSelected.pronunciation,
        wordType: vocSelected.wordType,
        meaning: vocSelected.meaning,
        image: vocSelected.image ? base64ToFile(vocSelected.image) : null,
        example: vocSelected.example,
        status: vocSelected.status,
      });
    }
  }, [isEdit, vocSelected]);
  const handleOpenUpdateModal = () => setIsModalAddVocOpen(true);
  const handleCloseUpdateModal = () => {
    setIsModalAddVocOpen(false);
    setIsEdit(false);
    setFormData({
      idList: id,
      topic: "",
      engWord: "",
      pronunciation: "",
      wordType: "",
      meaning: "",
      image: null,
      example: "",
      status: false,
    });
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    let fieldValue;
    if (type === "file") {
      fieldValue = files[0]; // Chỉ lấy file đầu tiên
    } else {
      fieldValue = value;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: fieldValue,
    }));
    validateField(name, fieldValue);
  };
  const validateField = (name, value) => {
    let error = "";

    if (name === "topic") {
      if (!value) {
        error = "Không để trống nội dung này!";
      }
    }

    if (name === "engWord") {
      if (!value) {
        error = "Không để trống nội dung này!";
      }
    }
    if (name === "pronunciation") {
      if (!value) {
        error = "Không để trống nội dung này!";
      }
    }
    if (name === "wordType") {
      if (!value) {
        error = "Không để trống nội dung này!";
      }
    }
    if (name === "meaning") {
      if (!value) {
        error = "Không để trống nội dung này!";
      }
    }
    if (name === "example") {
      if (!value) {
        error = "Không để trống nội dung này!";
      }
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formDataToSend = new FormData();

      for (const key in formData) {
        if (key === "image") {
          if (formData["image"]) formDataToSend.append(key, formData[key]);
          else {
            const autoImg = await getImageFileFromUrl(formData["engWord"]);
            formDataToSend.append("image", autoImg);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Vocabulary/AddVocabulary`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formDataToSend,
        }
      );
      if (!response.ok) {
        toast.error(`Thêm từ vựng thất bại`);
      } else {
        toast.success("Thêm từ vựng thành công.");
      }
      await Promise.all([fetchVocabulary(), handleCloseUpdateModal()]);
    } catch (error) {
      console.log(error);
      toast.error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdate = async (event) => {
    // Do something with formData, like sending it to an API
    event.preventDefault();
    try {
      setIsLoading(true);
      const formDataToSend = new FormData();

      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      const updated = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Vocabulary/UpdateVocabulary/${wordId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formDataToSend,
        }
      );
      if (!updated.ok) {
        toast.error(`Cập nhật từ vựng thất bại`);
      } else {
        toast.success("Cập nhật từ vựng thành công.");
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error}`);
    }
    await Promise.all([fetchVocabulary(), handleCloseUpdateModal()]);
    setIsLoading(false);
  };
  async function fetchVocabulary() {
    try {
      // setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Vocabulary/GetVocabularyByList/${id}`
      );
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response?.json();
        setWords(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      // setIsLoading(false);
    }
  }
  async function fetchVocabularyTopic() {
    try {
      // setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/VocList/GetVocListById/${id}`
      );
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response?.json();
        setListInfo(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      // setIsLoading(false);
    }
  }
  useEffect(() => {
    for (const fieldName in formData) {
      validateField(fieldName, formData[fieldName]);
    }
  }, [formData]);

  useEffect(() => {
    const fetchData = async () => {
      if (wordId) {
        try {
          setIsLoading(true);
          const response = await fetch(
            `${
              process.env.REACT_APP_API_BASE_URL ?? "/api"
            }/Vocabulary/GetVocabularyById/${wordId}`
          );
          setIsLoading(false);
          if (!response.ok) {
            const errorData = await response?.json();
            toast.error(`${errorData.message}`);
          } else {
            const data = await response?.json();
            setVocSelected(data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [wordId]);

  useEffect(() => {
    const fetchInitData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchVocabulary(), fetchVocabularyTopic()]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitData();
    window.scrollTo(0, 0);
  }, []);

  async function DeleteVocabulary(idList, idVoc) {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Vocabulary/DeleteVocabulary/${idList}&&${idVoc}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error(`Xóa từ vựng thất bại`);
      } else {
        toast.success("Xóa từ vựng thành công");
        fetchVocabulary();
        fetchVocabularyTopic();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  const [currentSlide, setCurrentSlide] = useState(0);
  const slideLength = words.length;

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1);
  };

  useEffect(() => {
    setCurrentSlide(0);
  }, []);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="vocabulary-wrapper">
      <div className="container vocabulary-card">
        <Heading
          subtitle="VictoryU"
          title={`Danh sách từ vựng của ${listInfo.author}`}
        />
        <div className="list__info">
          <p className={cx("description")}>{listInfo.description}</p>
          <p className={cx("author")}>
            <AiOutlineUser />
            Tác giả: {listInfo.author}
          </p>
          <p className={cx("quantity")}>
            <p className={cx("label")}>
              <MdOutlineFlipToFront /> Số lượng từ:{" "}
            </p>
            {listInfo.quantity} từ
          </p>
          <p className={cx("createdate")}>
            <p className={cx("label")}>
              <CiCalendar /> Ngày tạo:
            </p>
            {listInfo.createDate}
          </p>
        </div>
        {words?.length > 0 && (
          <div className="slider">
            <AiOutlineArrowLeft className="arrow prev" onClick={prevSlide} />
            <AiOutlineArrowRight className="arrow next" onClick={nextSlide} />
            {words.map((word, index) => {
              return (
                <div
                  key={word.idVoc}
                  className={`slide ${
                    index === currentSlide
                      ? "current"
                      : index === currentSlide - 1
                      ? "pre-slide"
                      : "next-slide"
                  }`}
                >
                  <label>
                    <input type="checkbox" />
                    <div className="flip-card">
                      <div className="front">
                        <div className="eng-word">{word.engWord}</div>
                        <div className="back-item">{`(${word.wordType})`}</div>
                        <div>
                          <hr />
                          <p className="flip">Click để lật</p>
                        </div>
                      </div>
                      <div className="back">
                        <div
                          style={{ fontWeight: "bold", fontStyle: "italic" }}
                        >
                          {word.engWord}
                        </div>
                        <hr />
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "5px",
                            }}
                          >
                            <div
                              className="back-item"
                              style={{ fontStyle: "italic" }}
                            >
                              {word.pronunciation ?? "pronunciation"}
                            </div>
                            <img
                              width="24"
                              height="24"
                              src={
                                play_pronun
                                  ? speaker_gif
                                  : "https://img.icons8.com/material-sharp/24/speaker.png"
                              }
                              alt="speaker"
                              onClick={(e) => {
                                e.preventDefault();
                                setPlay_pronun(true);
                                speak({
                                  text: word.engWord ?? "pronunciation",
                                });
                              }}
                            />
                          </div>
                          <div className="back-item">
                            Ý nghĩa: {word.meaning}
                          </div>
                          <div className="back-item">{word.example}</div>
                        </div>
                        <hr />
                        <p className="flip">Click để lật</p>
                      </div>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        )}
        <div className="vocabulary-list-wrapper">
          {user.auth && user.idUser == listInfo.idUser ? (
            <button
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                backgroundColor: "#007BFF",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                transition: "background-color 0.3s",
                marginLeft: "90%",
                marginBottom: "1rem",
                display: "flex",
                whiteSpace: "nowrap",
              }}
              onClick={handleOpenUpdateModal}
            >
              <IoAddOutline style={{ fontSize: "1.5rem" }} />
              Thêm từ mới
            </button>
          ) : (
            <div />
          )}
          <div className="vocabulary-list">
            {words &&
              words.map((word, key) => {
                return (
                  <div className="vocabulary__item">
                    <div className="vocabulary__item-content">
                      <div>
                        <img
                          src={word.image || vocDefault}
                          alt="vocabulary"
                          style={{ width: "200px", height: "170px" }}
                        />
                      </div>
                      <div className="vocabulary__item-word">
                        <div
                          style={{
                            fontSize: 25,
                            fontWeight: "bold",
                            color: "#47849e",
                          }}
                        >
                          {word.engWord} ({word.wordType})
                        </div>
                        <div style={{ fontSize: 20 }}>
                          <div>
                            <em>Chủ đề: </em> {word.topic}
                          </div>
                          <div>
                            <em>Phiên âm: </em> {word.pronunciation}
                          </div>
                          <div>
                            <em>Ý nghĩa: </em> {word.meaning}
                          </div>
                          <div>
                            <em>Ví dụ: </em> {word.example}
                          </div>
                        </div>
                      </div>
                    </div>
                    {user.auth &&
                      (user.username === listInfo.author ? (
                        <div className={cx("button-group")}>
                          <button
                            className="vocabulary__item-button"
                            onClick={() => {
                              setWordId(word.idVoc);
                              setIsEdit(true);
                            }}
                            style={{ color: "blue" }}
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            className="vocabulary__item-button"
                            onClick={() => {
                              showDeleteWarning(() =>
                                DeleteVocabulary(word.idList, word.idVoc)
                              );
                            }}
                            style={{ color: "red" }}
                          >
                            Xóa
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            className="vocabulary__item-button"
                            onClick={() => {
                              setWordId(word.idVoc);
                              setOpenAddModal(true);
                            }}
                          >
                            Thêm vào danh sách
                          </button>
                        </div>
                      ))}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <AddVocabularyTopic
        modal_on={openAddModal}
        toggleModal={setOpenAddModal}
        wordId={wordId}
      />
      <Modal isOpen={isModalAddVocOpen} contentLabel={"Nhập Thông Tin Từ Vựng"}>
        <form className={cx("modal-form")} onSubmit={handleSubmit}>
          <div>
            <h2 className={cx("description")}>Từ tiếng anh:</h2>
            <div className="autocomplete-wrapper">
              <Autocomplete
                value={formData.engWord}
                items={allWords}
                getItemValue={(item) => item.engWord}
                shouldItemRender={(item) =>
                  item.engWord
                    .toLowerCase()
                    .indexOf(formData.engWord.toLowerCase()) !== -1
                }
                renderMenu={(items) => <div className="dropdown">{items}</div>}
                renderItem={(item, isHighlighted) => (
                  <div
                    className={`item ${isHighlighted ? "selected-item" : ""}`}
                  >
                    {item.engWord}
                  </div>
                )}
                onChange={(event, val) =>
                  setFormData({ ...formData, engWord: val })
                }
                onSelect={(val) => {
                  const result = allWords.find((item) => item.engWord === val);
                  const updatedFormData = {
                    ...formData,
                    topic: result.topic ?? "",
                    engWord: result.engWord ?? "",
                    pronunciation: result.pronunciation ?? "",
                    wordType: result.wordType ?? "",
                    meaning: result.meaning ?? "",
                    example: result.example ?? "",
                    status: result.status ?? false,
                  };
                  setFormData(updatedFormData);
                }}
              />
            </div>
            {errors.engWord && (
              <span className={cx("error")}>{errors.engWord}</span>
            )}
          </div>
          <div>
            <h2 className={cx("description")}>Chủ đề:</h2>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              placeholder="ví dụ: Giao thông, ..."
              onChange={handleInputChange}
              required
            />
            {errors.topic && (
              <span className={cx("error")}>{errors.topic}</span>
            )}
          </div>
          <div>
            <h2 className={cx("description")}>Phiên âm:</h2>
            <input
              type="text"
              id="pronunciation"
              name="pronunciation"
              value={formData.pronunciation}
              placeholder="ví dụ: mo-tor-bike /məʊtəbaɪk/"
              onChange={handleInputChange}
              required
            />
            {errors.pronunciation && (
              <span className={cx("error")}>{errors.pronunciation}</span>
            )}
          </div>
          <div>
            <h2 className={cx("description")}>Từ loại:</h2>
            <input
              type="text"
              id="wordType"
              name="wordType"
              value={formData.wordType}
              placeholder="ví dụ: noun [countable]"
              onChange={handleInputChange}
              required
            />
            {errors.wordType && (
              <span className={cx("error")}>{errors.wordType}</span>
            )}
          </div>
          <div>
            <h2 className={cx("description")}>Nghĩa của từ:</h2>
            <input
              type="text"
              id="meaning"
              name="meaning"
              value={formData.meaning}
              placeholder="ví dụ: xe máy"
              onChange={handleInputChange}
              required
            />
            {errors.meaning && (
              <span className={cx("error")}>{errors.meaning}</span>
            )}
          </div>
          <div>
            <h2 className={cx("description")}>Ảnh minh họa:</h2>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleInputChange}
              ref={fileInputRef}
              //required
            />
            {errors.image && (
              <span className={cx("error")}>{errors.image}</span>
            )}
          </div>
          <div>
            <h2 className={cx("description")}>Ví dụ:</h2>
            <input
              type="text"
              id="example"
              name="example"
              value={formData.example}
              placeholder="ví dụ: Yesterday we had one working motorbike."
              onChange={handleInputChange}
              required
            />
            {errors.example && (
              <span className={cx("error")}>{errors.example}</span>
            )}
          </div>
          <div className={cx("button-group")}>
            <button type="submit">Lưu</button>
            <button type="button" onClick={handleCloseUpdateModal}>
              Đóng
            </button>
          </div>
        </form>
      </Modal>
      <ModalUpdateVoc isOpen={isEdit} contentLabel={"Nhập Thông Tin Chỉnh Sửa"}>
        <form className={cx("modal-form")} onSubmit={handleUpdate}>
          <div>
            <h2 className={cx("description")}>Chủ đề:</h2>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              placeholder="ví dụ: Giao thông, ..."
              onChange={handleInputChange}
              required
            />
            {errors.topic && (
              <span className={cx("error")}>{errors.topic}</span>
            )}
          </div>
          <div>
            <h2 className={cx("description")}>Từ tiếng anh:</h2>
            <input
              type="text"
              id="engWord"
              name="engWord"
              value={formData.engWord}
              placeholder="ví dụ: motorbike ..."
              onChange={handleInputChange}
              required
            />
            {errors.engWord && (
              <span className={cx("error")}>{errors.engWord}</span>
            )}
          </div>
          <div>
            <h2 className={cx("description")}>Phiên âm:</h2>
            <input
              type="text"
              id="pronunciation"
              name="pronunciation"
              value={formData.pronunciation}
              placeholder="ví dụ: mo-tor-bike /məʊtəbaɪk/"
              onChange={handleInputChange}
              required
            />
            {errors.pronunciation && (
              <span className={cx("error")}>{errors.pronunciation}</span>
            )}
          </div>
          <div>
            <h2 className={cx("description")}>Từ loại:</h2>
            <input
              type="text"
              id="wordType"
              name="wordType"
              value={formData.wordType}
              placeholder="ví dụ: noun [countable]"
              onChange={handleInputChange}
              required
            />
            {errors.wordType && (
              <span className={cx("error")}>{errors.wordType}</span>
            )}
          </div>
          <div>
            <h2 className={cx("description")}>Nghĩa của từ:</h2>
            <input
              type="text"
              id="meaning"
              name="meaning"
              value={formData.meaning}
              placeholder="ví dụ: xe máy"
              onChange={handleInputChange}
              required
            />
            {errors.meaning && (
              <span className={cx("error")}>{errors.meaning}</span>
            )}
          </div>
          <div>
            <h2 className={cx("description")}>Ảnh minh họa:</h2>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleInputChange}
              ref={fileInputRef}
              //required
            />
            {errors.image && (
              <span className={cx("error")}>{errors.image}</span>
            )}
          </div>
          <div>
            <h2 className={cx("description")}>Ví dụ:</h2>
            <input
              type="text"
              id="example"
              name="example"
              value={formData.example}
              placeholder="ví dụ: Yesterday we had one working motorbike."
              onChange={handleInputChange}
              required
            />
            {errors.example && (
              <span className={cx("error")}>{errors.example}</span>
            )}
          </div>
          <div className={cx("button-group")}>
            <button type="submit">Lưu</button>
            <button type="button" onClick={handleCloseUpdateModal}>
              Đóng
            </button>
          </div>
        </form>
      </ModalUpdateVoc>
    </div>
  );
}

export default VocabularyByTopic;
