import React, { Fragment, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../../../Context/UserContext";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";
import { bingRequest } from "../../../constant/bing";

export async function getImageFileFromUrl(engWord) {
  const imageUrl = await bingRequest(engWord);
  try {
    const proxyUrl =
      "https://nodejs-serverless-function-express-phi-ashy.vercel.app/api/fetchImage?url=";
    const response = await fetch(proxyUrl + encodeURIComponent(imageUrl));
    const blob = await response.blob();
    const filename = imageUrl.split("/").pop();
    const file = new File([blob], filename, { type: blob.type });
    return file;
  } catch (error) {
    console.error("Error converting URL to file:", error);
  }
}

function AddVocabulary({
  toggleModal,
  modal_on,
  idTopic,
  current_word,
  reFetchData,
}) {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const {
    register: word,
    handleSubmit,
    formState: { errors: error_add },
    setValue,
    reset,
  } = useForm();

  async function handleAddVocabulary(vocabulary) {
    const formData = new FormData();
    if (idTopic) formData.append("idList", idTopic);
    for (const key in vocabulary) {
      formData.append(key, vocabulary[key]);
    }
    formData.append("status", false);
    if (image) {
      formData.append("image", image);
    } else {
      const autoImg = await getImageFileFromUrl(vocabulary.engWord);
      formData.append("image", autoImg);
    }
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Vocabulary/AddVocabulary?userId=${user.idUser}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        }
      );
      toggleModal();
      if (!response.ok) {
        toast.error(`Thêm từ vựng thất bại`, {});
      } else {
        toast.success("Thêm từ vựng thành công");
        reFetchData();
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  }
  async function handleUpdateVocabulary(vocabulary) {
    const formData = new FormData();
    if (idTopic) formData.append("idList", idTopic);
    for (const key in vocabulary) {
      formData.append(key, vocabulary[key]);
    }
    formData.append("status", false);
    if (image) {
      formData.append("image", image);
    } else {
      const autoImg = await getImageFileFromUrl(vocabulary.engWord);
      formData.append("image", autoImg);
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Vocabulary/UpdateVocabulary/${current_word.idVoc}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        }
      );
      setIsLoading(false);
      toggleModal();
      if (!response.ok) {
        toast.error("Cập nhật từ vựng thất bại");
      } else {
        toast.success("Cập nhật từ vựng thành công");
        reFetchData();
      }
    } catch (error) {
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
  const handleDeleteImage = () => {
    var image_upload = document.getElementById("unit_image");
    image_upload.value = "";
    image_upload.type = "file";
    setImage("");
  };

  useEffect(() => {
    if (current_word) {
      setValue("topic", current_word.topic);
      setValue("engWord", current_word.engWord);
      setValue("wordType", current_word.wordType);
      setValue("meaning", current_word.meaning);
      setValue("pronunciation", current_word.pronunciation);
      setValue("example", current_word.example);
      setImage(current_word.image);
    }
  }, [current_word]);

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
    if (!modal_on) {
      reset();
      setImagePreview("");
    }
  }, [modal_on]);
  if (isLoading) {
    return <Loader fullLoad={true} />;
  }
  return (
    <Fragment>
      {modal_on && (
        <div className="w-screen h-screen top-0 left-0 right-0 bottom-0 fixed z-20">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="w-full h-full flex justify-center items-center">
            <div className="absolute max-h-[95vh] h-auto bg-slate-100 py-6 px-4 rounded-lg w-[40vw] overflow-y-scroll">
              <div className="absolute top-4 right-4 flex justify-end">
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
              <h2 className="text-center">
                {current_word ? "Cập nhật từ vựng" : "Thêm từ vựng mới"}
              </h2>
              <form
                onSubmit={handleSubmit((vocabulary) => {
                  if (current_word) handleUpdateVocabulary(vocabulary);
                  else handleAddVocabulary(vocabulary);
                })}
                className="flex flex-col gap-4 mt-5 items-center"
              >
                <div
                  className={`custom-input ${
                    error_add.topic && "!border-rose-800"
                  }`}
                >
                  <input
                    className="w-full text-base font-normal leading-tight border-none outline-none p-0"
                    type="text"
                    placeholder="Nhập từ chủ đề của từ"
                    {...word("topic", { required: true })}
                  />
                </div>
                <div
                  className={`custom-input ${
                    error_add.engWord && "!border-rose-800"
                  }`}
                >
                  <input
                    className="w-full text-base font-normal leading-tight border-none outline-none p-0"
                    type="text"
                    placeholder="Nhập từ tiếng Anh"
                    {...word("engWord", { required: true })}
                  />
                </div>
                <div
                  className={`custom-input ${
                    error_add.wordType && "!border-rose-800"
                  }`}
                >
                  <input
                    className="w-full text-base font-normal leading-tight border-none outline-none p-0"
                    type="text"
                    placeholder="Nhập từ loại"
                    {...word("wordType", { required: true })}
                  />
                </div>
                <div
                  className={`custom-input ${
                    error_add.pronunciation && "!border-rose-800"
                  }`}
                >
                  <input
                    className="w-full text-base font-normal leading-tight border-none outline-none p-0"
                    type="text"
                    placeholder="Nhập phiên âm"
                    {...word("pronunciation", { required: true })}
                  />
                </div>
                <div
                  className={`custom-input ${
                    error_add.meaning && "!border-rose-800"
                  }`}
                >
                  <input
                    className="w-full text-base font-normal leading-tight border-none outline-none p-0"
                    type="text"
                    placeholder="Nhập nghĩa của từ"
                    {...word("meaning", { required: true })}
                  />
                </div>
                <div
                  className={`custom-input ${
                    error_add.example && "!border-rose-800"
                  }`}
                >
                  <input
                    className="w-full text-base font-normal leading-tight border-none outline-none p-0"
                    type="text"
                    placeholder="Nhập ví dụ"
                    {...word("example", { required: true })}
                  />
                </div>
                <div className="w-full">
                  <div>Chọn ảnh minh họa</div>
                  <input
                    type="file"
                    id="unit_image"
                    onChange={(e) => setImage(e.target.files[0])}
                  ></input>
                </div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Uploaded"
                    className="max-w-full h-auto"
                  />
                )}
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
                <input
                  type="submit"
                  className="w-60 h-12 bg-primary-900 text-white font-semibold uppercase cursor-pointer rounded-[50px] border-none"
                  value={current_word ? "Sửa" : "Thêm"}
                ></input>
              </form>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default AddVocabulary;
