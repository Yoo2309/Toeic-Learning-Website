import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../Context/UserContext";
import CommentItem from "./CommentItem";

function Comment() {
  const [commentsData, setCommentsData] = useState([]);
  const { user } = useContext(UserContext);
  const [input, setInput] = useState("");

  const handleInsertNode = (inserted_node) => {
    console.log(inserted_node);
  };

  const handleEditNode = (edited_content, edited_id) => {
    console.log(edited_content, edited_id);
  };

  const handleDeleteNode = (edited_id) => {
    console.log(edited_id);
  };

  const fetchComments = async () => {
    try {
      const resp = await fetch("http://localhost:8000/comments");
      const data = await resp.json();
      setCommentsData(data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className=" w-full ">
      <div className="w-full flex gap-3 items-center">
        <div className="h-14 w-14 rounded-full overflow-hidden m-1">
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
          className="w-full p-2 flex border border-gray-300 items-center justify-between cursor-pointer rounded-md bg-gray-200"
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type..."
        />
        <img
          className="h-12 max-w-12"
          src="https://img.icons8.com/fluency/48/filled-sent.png"
          alt="filled-sent"
          onClick={() => {}}
        />
      </div>
      {commentsData?.map((comment) => {
        return (
          <div key={comment.id}>
            <CommentItem
              handleInsertNode={handleInsertNode}
              handleEditNode={handleEditNode}
              handleDeleteNode={handleDeleteNode}
              comment={comment}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Comment;
