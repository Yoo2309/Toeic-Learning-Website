import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../Context/UserContext";
import CommentItem from "./CommentItem";
import { toast } from "react-toastify";
import Loader from "../../../Common/Loader/Loader";
// import { OPENAI_DEPLOYMENT, openAIClient } from "../../../../constant/chatbot";

// Hàm tạo chuỗi định dạng ngày tháng từ đối tượng Date
export function formatDateTime() {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); 
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
}

function Comment({ id }) {
  const [isLoading, setIsLoading] = useState(false);
  const [commentsData, setCommentsData] = useState([]);
  const { user } = useContext(UserContext);
  const [input, setInput] = useState("");

  // const checkValidateComment = async (content) => {
  //   let result = true;
  //   setIsLoading(true);

  //   try {
  //     const response = await openAIClient.getCompletions(
  //       OPENAI_DEPLOYMENT,
  //       [content],
  //       {
  //         maxTokens: 500,
  //         temperature: 0.7,
  //         topP: 0.95,
  //         presencePenalty: 0,
  //         frequencyPenalty: 0,
  //       }
  //     );
  //   } catch (error) {
  //     if (error?.status === 400) {
  //       toast.warning("Bình luận của bạn chứa các nội dung không phù hợp!!");
  //       result = false;
  //     } else {
  //       result = true;
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  //   return result;
  // };

  const handleInsertNode = async (inserted_node) => {
    // const checked = await checkValidateComment(inserted_node.content);
    const checked = true;
    if (checked)
      try {
        setIsLoading(true);
        const myDate = formatDateTime();
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Comment/AddComment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idLesson: inserted_node.idLesson,
              idUser: inserted_node.idUser,
              content: inserted_node.content,
              idCommentReply: inserted_node.idCommentReply,
              createdDate: myDate,
              isDeleted: false,
            }),
          }
        );
        setIsLoading(false);
        if (!response.ok) {
          const errorData = await response?.json();
          toast.error(`${errorData.message}`);
        } else {
          handleSetCommentData();
        }
      } catch (error) {
        toast.error(`${error}`);
      }
  };

  const handleEditNode = async (edited_comment) => {
    // const checked = await checkValidateComment(edited_comment.content);
    const checked = true;
    if (checked)
      try {
        setIsLoading(true);
        const myDate = formatDateTime();
        const response = await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL ?? "/api"
          }/Comment/UpdateComment?idComment=${edited_comment.idComment}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idLesson: edited_comment.idLesson,
              idUser: edited_comment.idUser,
              content: edited_comment.content,
              idCommentReply: edited_comment.idCommentReply,
              createdDate: myDate,
            }),
          }
        );
        setIsLoading(false);
        if (!response.ok) {
          const errorData = await response?.json();
          toast.error(`${errorData.message}`);
        } else {
          handleSetCommentData();
        }
      } catch (error) {
        toast.error(`${error}`);
      }
  };

  const handleDeleteNode = async (edited_id) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Comment/DeleteComment?idComment=${edited_id}&idUser=${user.idUser}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        handleSetCommentData();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Comment/GetComment?idLesson=${id}`
      );
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response?.json();
        return data;
      }
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSetCommentData = async () => {
    const data = await fetchComments();
    setCommentsData(data);
  };
  useEffect(() => {
    handleSetCommentData();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="w-full flex justify-end">
      <div className="lg:w-3/4 w-full px-5 mb-10 max-w-[830px]-mb-0">
        <div className="w-full flex gap-3 items-center">
          <div className="h-14 w-14 border-gray-500 rounded-full overflow-hidden m-1">
            <img
              className="h-14 w-14"
              src={
                user.ava ??
                "https://img.icons8.com/ios/100/user-male-circle--v1.png"
              }
              alt=""
            />
          </div>
          <textarea
            type="text"
            className="w-full p-2 flex border border-gray-300 items-center justify-between rounded-md bg-primary-50"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="type..."
          />
          <img
            className="h-12 max-w-12"
            src="https://img.icons8.com/fluency/48/filled-sent.png"
            alt="filled-sent"
            onClick={() => {
              handleInsertNode({
                idLesson: id,
                idUser: user.idUser,
                content: input,
              });
              setInput("");
            }}
          />
        </div>
        {commentsData?.map((comment) => {
          return (
            <CommentItem
              key={comment.firstComment.idComment ?? comment.idComment}
              handleInsertNode={handleInsertNode}
              handleEditNode={handleEditNode}
              handleDeleteNode={handleDeleteNode}
              comment={comment}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Comment;
