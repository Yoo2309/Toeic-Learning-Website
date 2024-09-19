import React, { useContext, useEffect, useState } from "react";
import "./AddVocabularyTopic.css";
import { useForm } from "react-hook-form";
import { UserContext } from "../../../Context/UserContext";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";

function AddVocabularyTopic({ toggleModal, modal_on, initTopic }) {
  const { user } = useContext(UserContext);
  const [isloading, setIsLoading] = useState(false);
  const {
    register: vocabulary_topic,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const handleAddVocabularyTopic = async (data) => {
    const currentDate = new Date().toISOString();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/VocList/AddVocList?userId=${user.idUser}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            createDate: currentDate,
            status: "0",
            isPublic: data.isPublic,
          }),
        }
      );
      setIsLoading(false);
      toggleModal();
      if (!response.ok) {
        toast.error(`Thêm chủ đề từ vựng thất bại`, {});
      } else {
        toast.success("Thêm chủ đề từ vựng thành công");
      }
      reset();
    } catch (error) {
      console.log(error);
      toast.error(`${error}`);
    }
  };
  const handleUpdateVocabularyTopic = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/VocList/UpdateVocList/${initTopic?.idVocList}&&${user.idUser}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            isPublic: data.isPublic,
            status: initTopic.status,
          }),
        }
      );
      setIsLoading(false);
      toggleModal();
      if (!response.ok) {
        toast.error("Chỉnh sửa chủ đề từ vựng thất bại", {});
      } else {
        toast.success("Chỉnh sửa chủ đề từ vựng thành công");
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    if (initTopic) {
      setValue("title", initTopic.title);
      setValue("description", initTopic?.description);
      setValue("isPublic", initTopic?.isPublic);
    }
  }, [initTopic, setValue]);
  useEffect(() => {
    if (!modal_on) reset();
  }, [modal_on]);
  if (isloading) {
    return <Loader />;
  }
  return (
    <div className="professor-vocabulary-topic">
      {modal_on && (
        <div className="vocabulary-topic-modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="vocabulary-topic-panel">
            <div className="vocabulary-topic-content">
              <div className="vocabulary-topic-close-btn">
                <svg
                  onClick={toggleModal}
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="34"
                  height="34"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#E04F5F"
                    d="M504.1,256C504.1,119,393,7.9,256,7.9C119,7.9,7.9,119,7.9,256C7.9,393,119,504.1,256,504.1C393,504.1,504.1,393,504.1,256z"
                  ></path>
                  <path
                    fill="#FFF"
                    d="M285,256l72.5-84.2c7.9-9.2,6.9-23-2.3-31c-9.2-7.9-23-6.9-30.9,2.3L256,222.4l-68.2-79.2c-7.9-9.2-21.8-10.2-31-2.3c-9.2,7.9-10.2,21.8-2.3,31L227,256l-72.5,84.2c-7.9,9.2-6.9,23,2.3,31c4.1,3.6,9.2,5.3,14.3,5.3c6.2,0,12.3-2.6,16.6-7.6l68.2-79.2l68.2,79.2c4.3,5,10.5,7.6,16.6,7.6c5.1,0,10.2-1.7,14.3-5.3c9.2-7.9,10.2-21.8,2.3-31L285,256z"
                  ></path>
                </svg>
              </div>
              <form
                onSubmit={handleSubmit(
                  initTopic
                    ? handleUpdateVocabularyTopic
                    : handleAddVocabularyTopic
                )}
              >
                <div className="add-vocabulary-topic-title">
                  <h2>{initTopic ? "Cập nhật" : "Tạo"} danh sách từ vựng</h2>
                </div>
                <div className="input-field">
                  <input
                    type="text"
                    placeholder="Nhập tên danh sách "
                    {...vocabulary_topic("title", { required: true })}
                  />
                </div>
                <error>
                  {errors.title?.type === "required" &&
                    "Không được để trống tên"}
                </error>
                <div className="input-field">
                  <input
                    type="text"
                    placeholder="Nhập tên mô tả danh sách"
                    {...vocabulary_topic("description", { required: true })}
                  />
                </div>
                <error>
                  {errors.decription?.type === "required" &&
                    "Không được để trống mô tả"}
                </error>
                <div style={{ display: "flex", width: "fit-content", gap: 4 }}>
                  <input
                    style={{ height: 26, width: 26 }}
                    type="checkbox"
                    {...vocabulary_topic("isPublic")}
                  />
                  <div style={{ padding: 4, fontSize: 16, fontWeight: 600 }}>
                    Công khai?
                  </div>
                </div>
                <input
                  type="submit"
                  className="vocabulary-submit"
                  value={initTopic ? "Cập nhật" : "Tạo"}
                ></input>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddVocabularyTopic;
