import { useState, useEffect, useContext } from "react";
import { ReactComponent as DownArrow } from "../../../../assets/down-arrow.svg";
import { ReactComponent as UpArrow } from "../../../../assets/up-arrow.svg";
import { useForm } from "react-hook-form";
import { UserContext } from "../../../../Context/UserContext";

function CommentItem({
  handleInsertNode,
  handleEditNode,
  handleDeleteNode,
  comment,
}) {
  const { user } = useContext(UserContext);
  const [input, setInput] = useState(comment.content);
  const [editMode, setEditMode] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [expand, setExpand] = useState(false);

  const {
    handleSubmit: SubmitComment,
    register: comment_data,
    formState: { errors },
  } = useForm();

  const handleNewComment = () => {
    setExpand(!expand);
    setShowInput(true);
  };

  const handleInsert = (comment_data) => {
    handleInsertNode(comment_data);
  };
  const handleEdit = () => {
    handleEditNode(comment.id, input);
  };
  const handleDelete = () => {
    handleDeleteNode(comment.id);
  };

  useEffect(() => {
    if (expand) {
      const element = document.getElementById(`comment_${comment.id}`);
      if (element) {
        element.focus();
      }
    }
  }, [expand]);

  return (
    <div className="w-full mt-10 flex items-start gap-3">
      <div className="h-14 w-14 rounded-full overflow-hidden m-1">
        <img
          className="h-14 w-14"
          src={
            user.idUser === comment.idUser
              ? user.ava
              : "https://img.icons8.com/ios/100/user-male-circle--v1.png"
          }
          alt=""
        />
      </div>
      <div className="w-full">
        <div
          className={
            "w-full bg-gray-100 flex flex-col px-2 py-1 w-72 cursor-pointer rounded-md"
          }
        >
          <div className="flex flex-col gap-3 justify-center leading-8">
            <input
              className="p-2 border-none bg-gray-100 border-transparent focus:outline-none focus:ring-0"
              style={{ wordWrap: "break-word" }}
              value={input}
              onChange={(e) => {
                setInput(e.currentTarget?.value);
              }}
              id={`content_${comment.id}`}
            ></input>

            <div className="flex">
              {editMode ? (
                <>
                  <div
                    className="text-xs p-2 rounded-md text-gray-700 font-semibold cursor-pointer"
                    onClick={() => {
                      setEditMode(false);
                      handleEdit();
                    }}
                  >
                    SAVE
                  </div>
                  <div
                    className="text-xs p-2 rounded-md text-gray-700 font-semibold cursor-pointer"
                    onClick={() => {
                      setEditMode(false);
                      setInput(comment.content);
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
                  {user.idUser === comment.idUser ? (
                    <>
                      <div
                        className="text-xs p-2 rounded-md text-gray-700 font-semibold cursor-pointer"
                        onClick={() => {
                          const element = document.getElementById(
                            `content_${comment.id}`
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
                  id={`comment_${comment.id}`}
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

          {comment?.replies?.map((cmnt) => {
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
  );
}

export default CommentItem;
