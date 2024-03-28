import React, { useContext, useEffect, useState } from "react";
import "./AddVocabulary.css";
import { useForm } from "react-hook-form";
import { UserContext } from "../../../Context/UserContext";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";

function AddVocabulary({
  toggleModal,
  modal_on,
  idTopic,
  isUpdate,
  current_word,
}) {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [vocabulary, setVocabulary] = useState({
    engWord: current_word.engWord,
    wordType: current_word.wordType,
    meaning: current_word.meaning,
  });
  const {
    register: word,
    handleSubmit,
    formState: { errors: error_add },
    getValues,
    reset,
  } = useForm();

  useEffect(() => {
    setVocabulary({
      engWord: current_word.engWord,
      wordType: current_word.wordType,
      meaning: current_word.meaning,
    });
  }, [current_word]);
  useEffect(() => {
    reset();
  }, [modal_on]);
  async function handleAddVocabulary() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Vocabulary/AddVocabulary?userId=${user.idUser}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            idTopic: idTopic,
            engWord: getValues("engWord"),
            wordType: getValues("wordType"),
            meaning: getValues("meaning"),
          }),
        }
      );
      setIsLoading(false);
      toggleModal();
      if (!response.ok) {
        toast.error(`Thêm từ vựng thất bại`, {});
      } else {
        toast.success("Thêm từ vựng thành công");
      }
      reset();
    } catch (error) {
      console.log(error);
      toast.error(`${error}`);
    }
  }
  async function handleUpdateVocabulary() {
    if (
      vocabulary.engWord !== "" &&
      vocabulary.wordType !== "" &&
      vocabulary.meaning !== ""
    ) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL ?? "/api"
          }/Vocabulary/UpdateVocabulary/${current_word.idVoc}&&${user.idUser}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              idTopic: idTopic,
              engWord: vocabulary.engWord,
              wordType: vocabulary.wordType,
              meaning: vocabulary.meaning,
            }),
          }
        );
        setIsLoading(false);
        toggleModal();
        if (!response.ok) {
          toast.error("Cập nhật từ vựng thất bại");
        } else {
          toast.success("Cập nhật từ vựng thành công");
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
  }
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="professor-vocabulary">
      {modal_on && (
        <div className="vocabulary-modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="vocabulary-panel">
            <div className="vocabulary-content">
              <div className="vocabulary-close-btn">
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
              {!isUpdate ? (
                <form onSubmit={handleSubmit(handleAddVocabulary)}>
                  <div className="add-vocabulary-title">
                    <h2>Thêm từ vựng mới</h2>
                  </div>
                  <div className="input-field">
                    <input
                      type="text"
                      placeholder="Nhập từ tiếng Anh"
                      {...word("engWord", { required: true })}
                    />
                  </div>
                  <error>
                    {error_add.engWord?.type === "required" &&
                      "Không được để trống từ"}
                  </error>
                  <div className="input-field">
                    <input
                      type="text"
                      placeholder="Nhập từ loại"
                      {...word("wordType", { required: true })}
                    />
                  </div>
                  <error>
                    {error_add.wordType?.type === "required" &&
                      "Không được để trống từ loại"}
                  </error>
                  <div className="input-field">
                    <input
                      type="text"
                      placeholder="Nhập nghĩa của từ"
                      {...word("meaning", { required: true })}
                    />
                  </div>
                  <error>
                    {error_add.meaning?.type === "required" &&
                      "Không được để trống nghĩa"}
                  </error>
                  <input
                    type="submit"
                    className="vocabulary-submit"
                    value="Thêm"
                  ></input>
                </form>
              ) : (
                <form onSubmit={handleSubmit(handleUpdateVocabulary)}>
                  <div className="add-vocabulary-title">
                    <h2>Chỉnh sửa từ vựng</h2>
                  </div>
                  <div className="input-field">
                    <input
                      type="text"
                      value={vocabulary.engWord}
                      onChange={(e) =>
                        setVocabulary({
                          ...vocabulary,
                          engWord: e.target.value,
                        })
                      }
                    />
                  </div>
                  {vocabulary.engWord === "" ? (
                    <error>Không được để trống từ</error>
                  ) : (
                    <></>
                  )}
                  <div className="input-field">
                    <input
                      value={vocabulary.wordType}
                      onChange={(e) =>
                        setVocabulary({
                          ...vocabulary,
                          wordType: e.target.value,
                        })
                      }
                      type="text"
                    />
                  </div>
                  {vocabulary.wordType === "" ? (
                    <error>Không được để từ loại</error>
                  ) : (
                    <></>
                  )}
                  <div className="input-field">
                    <input
                      value={vocabulary.meaning}
                      onChange={(e) =>
                        setVocabulary({
                          ...vocabulary,
                          meaning: e.target.value,
                        })
                      }
                      type="text"
                    />
                  </div>
                  {vocabulary.meaning === "" ? (
                    <error>Không được để trống nghĩa</error>
                  ) : (
                    <></>
                  )}
                  <input
                    type="submit"
                    className="vocabulary-submit"
                    value="Sửa"
                  ></input>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddVocabulary;
