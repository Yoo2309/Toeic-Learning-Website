import { useState, useEffect, useContext, Fragment } from "react";
import { ReactComponent as DownArrow } from "../../../../assets/down-arrow.svg";
import { ReactComponent as UpArrow } from "../../../../assets/up-arrow.svg";
import { useForm } from "react-hook-form";
import { UserContext } from "../../../../Context/UserContext";
import ReportComment from "../Report/ReportComment";

function CommentItem({
  handleInsertNode,
  handleEditNode,
  handleDeleteNode,
  comment,
}) {
  const { user } = useContext(UserContext);
  const [currentComent, setCurrentComent] = useState(
    comment.firstComment ?? comment
  );
  const [editMode, setEditMode] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [expand, setExpand] = useState(false);

  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const { handleSubmit: SubmitComment, register: comment_data } = useForm();

  const handleNewComment = () => {
    setExpand(!expand);
    setShowInput(true);
  };

  const handleInsert = (comment_data) => {
    handleInsertNode({
      idLesson: currentComent.idLesson,
      idCommentReply: currentComent.idComment,
      idUser: user.idUser,
      content: comment_data.content,
    });
  };
  const handleEdit = () => {
    handleEditNode({
      idComment: currentComent.idComment,
      idLesson: currentComent.idLesson,
      idUser: user.idUser,
      content: currentComent.content,
      idCommentReply: currentComent.idCommentReply,
    });
  };
  const handleDelete = () => {
    handleDeleteNode(currentComent.idComment);
  };

  useEffect(() => {
    if (expand) {
      const element = document.getElementById(
        `comment_${currentComent.idComment}`
      );
      if (element) {
        element.focus();
      }
    }
  }, [expand, currentComent.idComment]);

  useEffect(() => {
    setCurrentComent(comment.firstComment ?? comment);
  }, [comment]);
  useEffect(() => {
    const uncheckFilerInputs = (e) => {
      if (!(e.target instanceof HTMLInputElement)) {
        const filerInputs = document.querySelectorAll("input.filter-btn");
        filerInputs.forEach((input) => {
          input.checked = false;
        });
      }
    };
    document.body.addEventListener("click", uncheckFilerInputs);
    return () => {
      document.body.removeEventListener("click", uncheckFilerInputs);
    };
  }, []);

  return (
    currentComent && (
      <Fragment>
        <ReportComment
          toggleModal={toggleModal}
          modal_on={modal}
          comment={currentComent}
        />
        <div
          className="w-full mt-5 flex items-start gap-3"
          data-testid="comment-item"
        >
          <div className="h-14 w-14 border-gray-500 rounded-full overflow-hidden m-1">
            <img
              className="h-14 w-14"
              src={
                currentComent.imageURL ??
                "https://img.icons8.com/ios/100/user-male-circle--v1.png"
              }
              alt=""
            />
          </div>
          <div className="w-full">
            <div className="w-full flex gap-5">
              <div>{currentComent.username}</div>
              <div className="text-sm italic">
                {currentComent.createdDate.replace("T", " ")}
              </div>
            </div>
            <div className="w-full flex gap-4 group bg-white">
              <div
                className={
                  "w-full  flex flex-col px-2 py-1 cursor-pointer rounded-md "
                }
              >
                <div className="flex flex-col gap-2 justify-center leading-8">
                  {editMode ? (
                    <textarea
                      className="w-full resize-none p-2 border-none bg-white border-transparent focus:outline-none focus:ring-0"
                      value={currentComent.content}
                      onChange={(e) => {
                        setCurrentComent({
                          ...currentComent,
                          content: e.currentTarget.value,
                        });
                      }}
                      id={`content_${currentComent.idComment}`}
                    ></textarea>
                  ) : (
                    <div className="w-full h-fit resize-none p-2 border-none bg-white border-transparent focus:outline-none focus:ring-0">
                      {currentComent.content}
                    </div>
                  )}
                  <div className="flex">
                    {editMode ? (
                      <>
                        <div
                          className="text-xs p-2 rounded-md text-gray-700 font-semibold cursor-pointer"
                          onClick={() => {
                            setEditMode(false);
                            if (currentComent.content) handleEdit();
                            else
                              setCurrentComent(comment.firstComment ?? comment);
                          }}
                        >
                          SAVE
                        </div>
                        <div
                          className="text-xs p-2 rounded-md text-gray-700 font-semibold cursor-pointer"
                          onClick={() => {
                            setEditMode(false);
                            setCurrentComent(comment.firstComment ?? comment);
                          }}
                        >
                          CANCEL
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="text-xs p-2 rounded-md text-gray-700 font-semibold cursor-pointer"
                          onClick={() => {
                            handleNewComment();
                          }}
                        >
                          {
                            <div className="flex items-center">
                              {expand ? (
                                <UpArrow width="10px" height="10px" />
                              ) : (
                                <DownArrow width="10px" height="10px" />
                              )}{" "}
                              REPLY
                            </div>
                          }
                        </div>
                        {user.idUser === currentComent.idUser ? (
                          <>
                            <div
                              className="text-xs p-2 rounded-md text-gray-700 font-semibold cursor-pointer"
                              onClick={() => {
                                const element = document.getElementById(
                                  `content_${currentComent.idComment}`
                                );
                                if (element) {
                                  element.focus();
                                }
                                setEditMode(true);
                              }}
                            >
                              EDIT
                            </div>
                            <div
                              className="text-xs p-2 rounded-md text-gray-700 font-semibold cursor-pointer"
                              onClick={() => {
                                handleDelete();
                              }}
                            >
                              DELETE
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              {user.idUser !== currentComent.idUser && (
                <div className="hidden group-hover:block relative">
                  <i className="fa-solid fa-ellipsis-vertical fa-lg absolute top-6 right-4 cursor-pointer"></i>
                  <input
                    type="checkbox"
                    className="filter-btn absolute top-4 right-3 w-6 h-6 z-1 opacity-0 peer cursor-pointer"
                  />
                  <div
                    className="hidden peer-checked:flex absolute top-6 right-6 w-52 p-4 bg-primary-50 shadow-lg items-center gap-4 cursor-pointer"
                    onClick={toggleModal}
                  >
                    <div className="text-md font-semibold">
                      Báo cáo bình luận
                    </div>
                    <i className="fa-solid fa-flag fa-lg"></i>
                  </div>
                </div>
              )}
            </div>
            <div
              style={{
                display: expand ? "block" : "none",
                paddingLeft: 25,
                width: "100%",
              }}
            >
              {showInput && (
                <form
                  className="w-full mt-6 flex gap-[5px] items-start"
                  onSubmit={SubmitComment(handleInsert)}
                >
                  <div className="h-14 w-14 border-[1px] border-gray-500 rounded-full overflow-hidden m-1">
                    <img
                      className="h-14 w-14"
                      src={
                        user.ava ??
                        "https://img.icons8.com/ios/100/user-male-circle--v1.png"
                      }
                      alt=""
                    />
                  </div>
                  <div className="w-full">
                    <textarea
                      type="text"
                      className="w-full p-2 border-none border-transparent focus:outline-none focus:ring-0 flex border border-gray-300 items-center justify-between cursor-pointer rounded-md bg-gray-200"
                      id={`comment_${currentComent.idComment}`}
                      {...comment_data("content", { required: true })}
                    />
                    <div className="flex">
                      <input
                        className="text-xs p-2 border-transparent focus:outline-none focus:ring-0 rounded-md text-gray-700 font-semibold cursor-pointer"
                        value="REPLY"
                        type="submit"
                      />
                      <div
                        className="text-xs p-2 rounded-md text-gray-700 font-semibold cursor-pointer"
                        onClick={() => {
                          setShowInput(false);
                          if (!comment?.replies?.length) setExpand(false);
                        }}
                      >
                        CANCEL
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {comment?.secondComments?.map((cmnt, index) => {
                return (
                  <CommentItem
                    handleInsertNode={handleInsertNode}
                    handleEditNode={handleEditNode}
                    handleDeleteNode={handleDeleteNode}
                    comment={cmnt}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </Fragment>
    )
  );
}

export default CommentItem;
