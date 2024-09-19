import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { UserContext } from "../../../Context/UserContext";
import Loader from "../../Common/Loader/Loader";
import "./AddCourse.css";

function AddCourse({ toggleModal, modal_on }) {
  const { user } = useContext(UserContext);
  const [isloading, setIsLoading] = useState(false);
  const {
    register: new_course,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  async function handleAddCourse(data) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Course/AddCourse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            idUser: user.idUser,
            name: data.name,
            description: data.description,
            isVip: data.isVip,
          }),
        }
      );
      setIsLoading(false);
      toggleModal();
      if (!response.ok) {
        toast.error("Thêm khóa học mới thất bại", {});
      } else {
        toast.success("Thêm khóa học mới thành công");
        reset();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  if (isloading) {
    return <Loader />;
  }
  return (
    <div className="professor-add-course">
      {modal_on && (
        <div className="add-course-modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="add-course-panel">
            <div className="add-course-content">
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
              <form onSubmit={handleSubmit(handleAddCourse)}>
                <div className="add-course-title">
                  <h2>Thêm Khóa học mới</h2>
                </div>
                <div className="input-field">
                  <input
                    type="text"
                    placeholder="Nhập tên Khóa học"
                    {...new_course("name", { required: true })}
                  />
                </div>
                <error>
                  {errors.name?.type === "required" &&
                    "Không được để trống tên"}
                </error>
                <div style={{ display: "flex", width: "fit-content", gap: 4 }}>
                  <input
                    style={{ height: 26, width: 26 }}
                    type="checkbox"
                    {...new_course("isVip")}
                  />
                  <div style={{ padding: 4, fontSize: 16 }}>Is VIP?</div>
                </div>
                <div className="input-field" style={{ height: "7rem" }}>
                  <textarea
                    type="text"
                    placeholder="Nhập mô tả"
                    {...new_course("description", { required: true })}
                  />
                </div>
                <input
                  type="submit"
                  className="vocabulary-submit"
                  value="Thêm"
                ></input>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddCourse;
