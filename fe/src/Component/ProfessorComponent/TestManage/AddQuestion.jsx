import React, { useContext, useEffect, useState } from "react";
import "../CourseManage/Lesson/Quiz/AddQuestion.css";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Loader from "../.././Common/Loader/Loader";
import { UserContext } from "../../../Context/UserContext";

function AddQuestion({
  toggleModal,
  modal_on,
  idUnit,
  isUpdate,
  initial_question,
}) {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [current_question, setQuestion] = useState({
    idQuestion: initial_question.idQuestion,
    content: initial_question.content,
    answer: initial_question.answer,
    explaination: initial_question.explaination,
    choice_1: initial_question.choice_1,
    choice_2: initial_question.choice_2,
    choice_3: initial_question.choice_3,
    choice_4: initial_question.choice_4,
  });
  const {
    register: question,
    handleSubmit,
    formState: { errors: error_add },
    getValues,
    reset,
  } = useForm();

  useEffect(() => {
    reset();
  }, [modal_on]);
  async function handleAddQuestion() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Question/AddQuestion/${
          user.idUser
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            idUnit: idUnit,
            content: getValues("content"),
            answer: getValues("answer"),
            explaination: getValues("explaination"),
            choice_1: getValues("choice_1"),
            choice_2: getValues("choice_2"),
            choice_3: getValues("choice_3"),
            choice_4: getValues("choice_4"),
          }),
        }
      );
      setIsLoading(false);
      toggleModal();
      if (!response.ok) {
        toast.error(`Thêm câu hỏi mới thất bại`, {});
      } else {
        toast.success("Thêm câu hỏi mới thành công");
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error}`);
    }
  }
  async function handleUpdateQuestion() {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Question/UpdateQuestion/${current_question.idQuestion}&&${
          user.idUser
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            idUnit: idUnit,
            content: current_question.content,
            answer: current_question.answer,
            explaination: current_question.explaination,
            choice_1: current_question.choice_1,
            choice_2: current_question.choice_2,
            choice_3: current_question.choice_3,
            choice_4: current_question.choice_4,
          }),
        }
      );
      setIsLoading(false);
      toggleModal();
      if (!response.ok) {
        toast.error(`Chỉnh sửa câu hỏi thất bại`, {});
      } else {
        toast.success("Chỉnh sửa câu hỏi thành công");
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
    <div className="professor-add-question">
      {modal_on && (
        <div className="question-modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="question-panel">
            <div className="question-content">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="add-question-title">
                  <h2>{isUpdate ? "Sửa câu hỏi" : `Thêm câu hỏi mới`}</h2>
                </div>
                <div className="question-close-btn">
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
              </div>
              {!isUpdate ? (
                <form
                  style={{ gap: "5px" }}
                  onSubmit={handleSubmit(handleAddQuestion)}
                >
                  <div className="input-field">
                    <textarea
                      style={{ height: "2rem" }}
                      type="text"
                      placeholder="Nhập câu hỏi"
                      {...question("content", { required: true })}
                    />
                  </div>
                  <error>
                    {error_add.content?.type === "required" &&
                      "Không được để trống nội dung câu hỏi"}
                  </error>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="question-add-label">Lựa chọn 1:</div>
                    <div style={{ width: "100%" }}>
                      <div className="input-field">
                        <input
                          type="text"
                          placeholder="Nhập lựa chọn"
                          {...question("choice_1", { required: true })}
                        />
                      </div>
                      <error>
                        {error_add.choice_1?.type === "required" &&
                          "Không được để trống lựa chọn"}
                      </error>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="question-add-label">Lựa chọn 2:</div>
                    <div style={{ width: "100%" }}>
                      <div className="input-field">
                        <input
                          type="text"
                          placeholder="Nhập lựa chọn"
                          {...question("choice_2", { required: true })}
                        />
                      </div>
                      <error>
                        {error_add.choice_2?.type === "required" &&
                          "Không được để trống lựa chọn"}
                      </error>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="question-add-label">Lựa chọn 3:</div>
                    <div style={{ width: "100%" }}>
                      <div className="input-field">
                        <input
                          type="text"
                          placeholder="Nhập lựa chọn"
                          {...question("choice_3", { required: true })}
                        />
                      </div>
                      <error>
                        {error_add.choice_3?.type === "required" &&
                          "Không được để trống lựa chọn"}
                      </error>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="question-add-label">Lựa chọn 4:</div>
                    <div style={{ width: "100%" }}>
                      <div className="input-field">
                        <input
                          type="text"
                          placeholder="Nhập lựa chọn"
                          {...question("choice_4", { required: true })}
                        />
                      </div>
                      <error>
                        {error_add.choice_4?.type === "required" &&
                          "Không được để trống lựa chọn"}
                      </error>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="question-add-label">Đáp án</div>
                    <select
                      className="question-answer"
                      {...question("answer", { required: true })}
                    >
                      <option value="1">Lựa chọn 1</option>
                      <option value="2">Lựa chọn 2</option>
                      <option value="3">Lựa chọn 3</option>
                      <option value="4">Lựa chọn 4</option>
                    </select>
                  </div>

                  <div className="input-field" style={{ height: "4rem" }}>
                    <textarea
                      type="text"
                      placeholder="Nhập giải thích"
                      {...question("explaination")}
                    />
                  </div>
                  <input
                    type="submit"
                    className="question-submit"
                    value="Thêm"
                  ></input>
                </form>
              ) : (
                <form
                  style={{ gap: "5px" }}
                  onSubmit={handleSubmit(handleUpdateQuestion)}
                >
                  <div className="input-field">
                    <textarea
                      style={{ height: "2rem" }}
                      type="text"
                      value={current_question.content}
                      onChange={(e) =>
                        setQuestion({
                          ...current_question,
                          content: e.target.value,
                        })
                      }
                    />
                  </div>
                  {current_question.content === "" ? (
                    <error>Không được để trống nội dung câu hỏi</error>
                  ) : (
                    <></>
                  )}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="question-add-label">Lựa chọn 1:</div>
                    <div style={{ width: "100%" }}>
                      <div className="input-field">
                        <input
                          type="text"
                          value={current_question.choice_1}
                          onChange={(e) =>
                            setQuestion({
                              ...current_question,
                              choice_1: e.target.value,
                            })
                          }
                        />
                      </div>
                      {current_question.choice_1 === "" ? (
                        <error>Không được để trống lựa chọn</error>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="question-add-label">Lựa chọn 2:</div>
                    <div style={{ width: "100%" }}>
                      <div className="input-field">
                        <input
                          type="text"
                          value={current_question.choice_2}
                          onChange={(e) =>
                            setQuestion({
                              ...current_question,
                              choice_2: e.target.value,
                            })
                          }
                        />
                      </div>
                      {current_question.choice_2 === "" ? (
                        <error>Không được để trống lựa chọn</error>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="question-add-label">Lựa chọn 3:</div>
                    <div style={{ width: "100%" }}>
                      <div className="input-field">
                        <input
                          type="text"
                          value={current_question.choice_3}
                          onChange={(e) =>
                            setQuestion({
                              ...current_question,
                              choice_3: e.target.value,
                            })
                          }
                        />
                      </div>
                      {current_question.choice_3 === "" ? (
                        <error>Không được để trống lựa chọn</error>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="question-add-label">Lựa chọn 4:</div>
                    <div style={{ width: "100%" }}>
                      <div className="input-field">
                        <input
                          type="text"
                          value={current_question.choice_4}
                          onChange={(e) =>
                            setQuestion({
                              ...current_question,
                              choice_4: e.target.value,
                            })
                          }
                        />
                      </div>
                      {current_question.choice_4 === "" ? (
                        <error>Không được để trống lựa chọn</error>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="question-add-label">Đáp án</div>
                    <select
                      className="question-answer"
                      value={current_question.answer}
                      onChange={(e) =>
                        setQuestion({
                          ...current_question,
                          answer: e.target.value,
                        })
                      }
                    >
                      <option value="1">Lựa chọn 1</option>
                      <option value="2">Lựa chọn 2</option>
                      <option value="3">Lựa chọn 3</option>
                      <option value="4">Lựa chọn 4</option>
                    </select>
                  </div>
                  <div className="input-field" style={{ height: "4rem" }}>
                    <textarea
                      type="text"
                      placeholder="Nhập giải thích"
                      value={current_question.explaination}
                      onChange={(e) =>
                        setQuestion({
                          ...current_question,
                          explaination: e.target.value,
                        })
                      }
                    />
                  </div>
                  {/* {current_question.explaination === "" ? (
                    <error>Không được để trống giải thích</error>
                  ) : (
                    <></>
                  )} */}
                  <input
                    type="submit"
                    className="question-submit"
                    value="Cập nhật"
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
export default AddQuestion;
