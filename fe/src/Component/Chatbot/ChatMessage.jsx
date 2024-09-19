import React from "react";

function ChatMessage({ img, content, role, customClass }) {
  return (
    <div
      data-testid="chat-msg"
      className={`flex gap-x-2 items-start ${
        role === "user" ? "flex-row-reverse" : ""
      }`}
    >
      <img src={img} alt="avatar" className="w-8 h-8" />
      <div
        className={`w-fit ${
          role === "assistant" ? "bg-white" : "bg-blue-600 text-white"
        } border border-gray-200 rounded-2xl py-2 px-3 text-sm text-left ${customClass}`}
        dangerouslySetInnerHTML={{ __html: content }}
      >
        {/* {content} */}
      </div>
    </div>
  );
}

export default ChatMessage;
