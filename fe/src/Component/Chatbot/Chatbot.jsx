import React, { Fragment, useContext, useEffect, useState } from "react";
import { UserContext } from "../../Context/UserContext";
import ChatMessage from "./ChatMessage";
import {
  AZURE_SEARCH_ENDPOINT,
  AZURE_SEARCH_INDEX,
  AZURE_SEARCH_KEY,
  OPENAI_API_KEY,
  OPENAI_DEPLOYMENT,
  OPENAI_ENDPOINT,
} from "../../constant/chatbot";
import { toast } from "react-toastify";

function Chatbot() {
  const { user } = useContext(UserContext);
  const [state, setState] = useState({
    openBot: false,
    expand: false,
  });
  const assistantAva =
    "https://img.icons8.com/?size=100&id=D7zLidTn6pHw&format=png&color=000000";
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [conversation, setConversation] = useState([]);

  const searchAzure = async () => {
    try {
      const response = await fetch(
        `${AZURE_SEARCH_ENDPOINT}/indexes/${AZURE_SEARCH_INDEX}/docs/search?api-version=2024-05-01-preview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": AZURE_SEARCH_KEY,
          },
          body: JSON.stringify({
            search: input,
            queryType: "semantic",
            semanticConfiguration: "default",
          }),
        }
      );
      const data = await response.json();
      const results = data.value.map((doc) => doc.content);
      return results;
    } catch (error) {
      console.error("Error searching Azure Search: ", error);
      return false;
    }
  };
  const ChatgptSearch = async (input_message) => {
    try {
      const response = await fetch(
        `${OPENAI_ENDPOINT}/openai/deployments/${OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-02-15-preview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": OPENAI_API_KEY,
          },
          body: JSON.stringify({
            messages: input_message,
            temperature: 0.7,
            top_p: 0.95,
            frequency_penalty: 0,
            presence_penalty: 0,
          }),
        }
      );
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const submitChatbot = async () => {
    const searchResults = await searchAzure();
    try {
      setIsLoading(true);
      let response;
      if (searchResults) {
        const limitedSearchResult = searchResults[0].substring(0, 15000);
        response = await ChatgptSearch([
          ...conversation,
          {
            role: "assistant",
            content:
              "Use the following information to assist with the user's query: " +
              limitedSearchResult,
          },
          { role: "user", content: input },
        ]);
      } else {
        response = await ChatgptSearch([
          ...conversation,
          { role: "user", content: input },
        ]);
      }
      if (response.status === 200) {
        const data = await response.json();
        setConversation((prevConversation) => [
          ...prevConversation,
          {
            role: "assistant",
            content: data?.choices[0].message.content,
          },
        ]);
      } else {
        const data = await response.json();
        console.log(data);
        setError(
          response.status === 429
            ? `Bạn đang gửi yêu cầu quá nhanh. Thử lại sau ${
                data.error.message?.match(/retry after (\d+) seconds/)[1] ??
                "vài"
              } giây.`
            : "Lỗi hệ thống"
        );
      }
    } catch (error) {
      console.log(error);
      setError("Lỗi hệ thống");
    } finally {
      setIsLoading(false);
    }
  };
  const checkAvalable = async () => {
    if (user.role[1] === "VipStudent") return true;
    else {
      try {
        const response = await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL ?? "/api"
          }/ChatBot/GetAvailable/${user.idUser}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (!response.ok) {
          console.log(response);
        } else {
          const data = await response?.json();
          if (data.availableChat > 0) return true;
        }
        return false;
      } catch (error) {
        toast.error(`${error}`);
      }
    }
  };
  const UpdateAvalable = async () => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/ChatBot/UpdateAvalableChat/${user.idUser}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) {
        toast.error(`Get User Profile failed`, {});
      } else {
        const data = await response?.json();
        if (data.availableChat > 0) return true;
      }
      return false;
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  const submitQuestion = async () => {
    setConversation((prevConversation) => [
      ...prevConversation,
      {
        role: "user",
        content: input,
      },
    ]);
    setInput("");
    setError("");
    const check = await checkAvalable();
    if (check) {
      submitChatbot();
      if (user.role[1] !== "VipStudent") UpdateAvalable();
    } else {
      setConversation((prevConversation) => [
        ...prevConversation,
        {
          role: "assistant",
          content: `Đã hết lượt free trong tháng. Vui lòng truy cập trang <a class="!underline !text-blue-700" href="/vippackage">Get VIP</a> để nâng cấp tài khoản`,
        },
      ]);
    }
  };

  useEffect(() => {
    if (conversation.length)
      localStorage.setItem("chatbot", JSON.stringify(conversation));
  }, [conversation]);

  useEffect(() => {
    const userConversation = localStorage.getItem("chatbot");
    if (userConversation) setConversation(JSON.parse(userConversation));
    else
      setConversation([
        {
          role: "assistant",
          content: "Xin chào, đây là VictoryU. Bạn cần giúp đỡ gì ạ.",
        },
      ]);
  }, []);

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
    <Fragment>
      <div
        className={`fixed bottom-4 right-4 z-10`}
        onClick={() =>
          setState((prevState) => ({
            ...prevState,
            openBot: !prevState.openBot,
          }))
        }
      >
        <img
          src={assistantAva}
          data-testid="assistantAva"
          alt=""
          className="w-16 h-16"
        />
      </div>
      {state.openBot && (
        <div
          className={`${
            state.expand ? "h-[80vh] w-[60vw]" : "h-[65vh] w-[350px]"
          } border border-gray-300 rounded-xl fixed bottom-0 right-4 z-20 bg-slate-100 shadow-lg flex flex-col`}
        >
          <div className="px-4 py-2 flex justify-between items-center bg-primary-300  rounded-t-xl">
            <div className="inline-flex items-center gap-2">
              <img src={assistantAva} alt="avatar" className="w-8 h-8" />
              <div className="font-semibold text-lg tracking-tight">
                Trợ lý ảo VictoryU
              </div>
            </div>
            <div className="flex gap-3 items-center">
              {state.expand ? (
                <i
                  className="fa-solid fa-minimize fa-xl cursor-pointer"
                  onClick={() =>
                    setState((prevState) => ({
                      ...prevState,
                      expand: !prevState.expand,
                    }))
                  }
                ></i>
              ) : (
                <i
                  className="fa-solid fa-maximize fa-xl cursor-pointer"
                  onClick={() =>
                    setState((prevState) => ({
                      ...prevState,
                      expand: !prevState.expand,
                    }))
                  }
                ></i>
              )}
              <i
                className="fa-solid fa-minus fa-xl cursor-pointer"
                onClick={() =>
                  setState((prevState) => ({
                    ...prevState,
                    openBot: false,
                  }))
                }
              ></i>
            </div>
          </div>
          <div className="px-4 py-2 w-full flex-1 flex flex-col gap-2 overflow-auto">
            {conversation?.map((message, index) => (
              <ChatMessage
                content={message.content}
                role={message.role}
                img={message.role === "assistant" ? assistantAva : user.ava}
              />
            ))}
            {isLoading && (
              <ChatMessage
                content={"..."}
                role="assistant"
                img={assistantAva}
              />
            )}
            {error && (
              <ChatMessage
                content={error}
                role="assistant"
                img={assistantAva}
                customClass={"!bg-rose-400"}
              />
            )}
          </div>
          <hr />
          <div className="w-full px-4 py-2 flex justify-between bg-white">
            <div className="w-full flex items-center gap-2">
              <div className="relative w-fit">
                <i className="fa-solid fa-ellipsis fa-lg absolute top-0 left-0 cursor-pointer"></i>
                <input
                  type="checkbox"
                  className="filter-btn absolute -top-2 left-0 w-6 h-6 z-1 opacity-0 peer cursor-pointer"
                />
                <div
                  className="hidden peer-checked:flex absolute -top-16 left-2 w-32 p-4 bg-white drop-shadow-[0_6px_6px_rgba(0,0,0,0.35)] items-center gap-4 cursor-pointer text-md font-semibold text-rose-900"
                  onClick={() => {
                    localStorage.removeItem("chatbot");
                    setConversation([
                      {
                        role: "assistant",
                        content:
                          "Xin chào, đây là VictoryU. Bạn cần giúp đỡ gì ạ.",
                      },
                    ]);
                  }}
                >
                  Xóa lịch sử
                </div>
              </div>
              <input
                type="text"
                className="w-full text-sm leading-5 pl-4 outline-none"
                onChange={(e) => setInput(e.currentTarget.value)}
                value={input}
                onKeyUp={(e) => {
                  if (e.key === "Enter" && input !== "") submitQuestion();
                }}
                autoFocus
              />
            </div>
            <img
              className="h-8 max-w-8"
              data-testid="submit-question"
              src="https://img.icons8.com/fluency/48/filled-sent.png"
              alt="filled-sent"
              onClick={() => {
                submitQuestion();
              }}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Chatbot;
