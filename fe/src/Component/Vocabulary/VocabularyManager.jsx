import { CiCalendar, CiUnlock, CiLock } from "react-icons/ci";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Loader from "../Common/Loader/Loader";
import styles from "./VocabularyManager.module.css";
import Heading from "../Common/Header/Heading";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineFlipToFront } from "react-icons/md";
import classNames from "classnames/bind";
import { UserContext } from "../../Context/UserContext";
import { showDeleteWarning } from "../Common/Alert/Alert";
import { useParams } from "react-router-dom";
import { IoAddOutline } from "react-icons/io5";
import Modal from "./Modal";

const cx = classNames.bind(styles);

function VocabularyUserManager() {
  const { id } = useParams();
  const [topics, setTopic] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState({});
  const [listInfo, setListInfo] = useState("");
  const [idListSelected, setIdListSelected] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    createDate: new Date().toISOString(),
    status: "-1",
    isPublic: true,
  });

  useEffect(() => {
    if (isEdit && idListSelected) {
      setFormData({
        title: listInfo.title,
        description: listInfo.description,
        createDate: new Date().toISOString(),
        status: listInfo.status,
        isPublic: listInfo.isPublic,
      });
    }
  }, [isEdit, idListSelected, listInfo]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIdListSelected("");
    setFormData({
      title: "",
      description: "",
      createDate: new Date().toISOString(),
      status: "-1",
      isPublic: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [name]: fieldValue,
    });

    validateField(name, fieldValue);
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "title") {
      if (!value) {
        error = "Tiêu đề là bắt buộc";
      }
    }

    if (name === "description") {
      if (!value) {
        error = "Mô tả là bắt buộc";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };
  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/VocList/AddVocList?userId=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            createDate: formData.createDate,
            status: formData.status,
            isPublic: formData.isPublic,
          }),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        console.log("Thêm danh sách thất bại", response);
        toast.error(`Thêm danh sách thất bại`, {});
      } else {
        toast.success("Thêm danh sách thành công.");
        fetchVocabularyTopic();
        handleCloseModal();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleUpdate = async (event) => {
    // Do something with formData, like sending it to an API
    event.preventDefault();
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/VocList/UpdateVocList/${idListSelected}&&${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            createDate: formData.createDate,
            status: formData.status,
            isPublic: formData.isPublic,
          }),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error(`Cập nhật danh sách thất bại`, {});
      } else {
        toast.success("Cập nhật danh sách thành công.");
        fetchVocabularyTopic();
        handleCloseModal();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  async function fetchVocabularyTopic() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/VocList/GetVocListByUser/${id}`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`, {});
      } else {
        const data = await response?.json();
        setTopic(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  async function DeleteVocabularyTopic(voc_topic_id) {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/VocList/DeleteVocList/${voc_topic_id}`,
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
        toast.error(`Xóa danh sách từ vựng thất bại`, {});
      } else {
        fetchVocabularyTopic();
        toast.success("Xóa danh sách từ vựng thành công");
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      if (idListSelected) {
        try {
          setIsLoading(true);
          const response = await fetch(
            `${
              process.env.REACT_APP_API_BASE_URL ?? "/api"
            }/VocList/GetVocListById/${idListSelected}`
          );
          setIsLoading(false);
          if (!response.ok) {
            const errorData = await response?.json();
            toast.error(`${errorData.message}`);
          } else {
            const data = await response?.json();
            setListInfo(data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [idListSelected]);

  useEffect(() => {
    fetchVocabularyTopic();
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    for (const fieldName in formData) {
      validateField(fieldName, formData[fieldName]);
    }
  }, [formData]);

  return (
    <div className="vocabulary-topic-wrapper">
      <div className="container vocabulary-topic">
        <Heading
          subtitle="VictoryU"
          title={`Tất cả danh sách từ vựng của ${user.username}`}
        />
        <div
          style={{
            display: "grid",
            gap: "3rem",
            padding: "2rem",
            width: "17rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className={cx("item")}>
            <button
              onClick={() => {
                setIsEdit(false);
                handleOpenModal();
              }}
            >
              <IoAddOutline style={{ fontSize: "5rem" }} />
              Tạo danh sách từ
            </button>
          </div>
        </div>
        {isLoading ? <Loader /> : <></>}
        {topics && (
          <div className={cx("wrapper")}>
            <div className={cx("gridview")}>
              {topics &&
                topics.map((val, index) => {
                  return (
                    <Link
                      key={val.idVocList}
                      className={cx("item")}
                      to={`/vocabulary-by-topic/${val.idVocList}`}
                    >
                      <div className={cx("content")}>
                        <div className={cx("title")}>{val.title}</div>
                        <p className={cx("description")}>{val.description}</p>
                        <p className={cx("author")}>
                          <AiOutlineUser />
                          {val.author}
                        </p>
                        <p className={cx("quantity")}>
                          <p className={cx("label")}>
                            <MdOutlineFlipToFront /> Số lượng từ:
                          </p>
                          {val.quantity} từ{" "}
                        </p>
                        <p className={cx("createdate")}>
                          <p className={cx("label")}>
                            <CiCalendar /> Ngày tạo:
                          </p>
                          {val.createDate}
                        </p>
                        <p className={cx("createdate")}>
                          <p className={cx("label")}>
                            {val.isPublic ? <CiUnlock /> : <CiLock />} Trạng
                            thái:
                          </p>
                          {val.isPublic ? "Công khai" : "Riêng tư"}
                        </p>
                      </div>
                      <div className={cx("btn-wrapper")}>
                        <button
                          className={cx("delete-btn")}
                          onClick={(e) => {
                            e.preventDefault();
                            showDeleteWarning(() =>
                              DeleteVocabularyTopic(val.idVocList)
                            );
                          }}
                        >
                          Xóa
                        </button>
                        <button
                          type="button"
                          className={cx("update-btn")}
                          onClick={(e) => {
                            e.preventDefault();
                            setIsEdit(true);
                            setIdListSelected(val.idVocList);
                            handleOpenModal();
                          }}
                        >
                          Sửa
                        </button>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        contentLabel={
          isEdit ? "Nhập Thông Tin Chỉnh Sửa" : "Nhập Thông Tin Danh Sách"
        }
      >
        <form
          className={cx("modal-form")}
          onSubmit={isEdit ? handleUpdate : handleSave}
        >
          <div>
            <h2 className={cx("description")}>Tiêu đề:</h2>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              placeholder="Nhập tiêu đề ..."
              onChange={handleInputChange}
              required
            />
            {errors.title && (
              <span className={cx("error")}>{errors.title}</span>
            )}
          </div>
          <div>
            <h2 className={cx("description")}>Mô tả:</h2>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              placeholder="Nhập mô tả ..."
              onChange={handleInputChange}
              required
            />
            {errors.description && (
              <span className={cx("error")}>{errors.description}</span>
            )}
          </div>
          <div style={{ display: "flex" }}>
            <h2 className={cx("ispublic")}>Công khai:</h2>
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleInputChange}
            />
          </div>
          <div className={cx("button-group")}>
            <button type="submit">Lưu</button>
            <button type="button" onClick={handleCloseModal}>
              Đóng
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default VocabularyUserManager;
