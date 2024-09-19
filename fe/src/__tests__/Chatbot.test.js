import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import fetchMock from "fetch-mock";
import Chatbot from "../Component/Chatbot/Chatbot";
import { UserProviderTest } from "../constant/testConst";

const chatRep = {
  choices: [
    {
      content_filter_results: {
        hate: {
          filtered: false,
          severity: "safe",
        },
        self_harm: {
          filtered: false,
          severity: "safe",
        },
        sexual: {
          filtered: false,
          severity: "safe",
        },
        violence: {
          filtered: false,
          severity: "safe",
        },
      },
      finish_reason: "stop",
      index: 0,
      logprobs: null,
      message: {
        content: "Câu trả lời của hệ thống",
        role: "assistant",
      },
    },
  ],
  created: 1719889217,
  id: "chatcmpl-9gO2b58GOsdfunVGvnP2Q0ALMD3m7",
  model: "gpt-35-turbo",
  object: "chat.completion",
  prompt_filter_results: [
    {
      prompt_index: 0,
      content_filter_results: {
        hate: {
          filtered: false,
          severity: "safe",
        },
        self_harm: {
          filtered: false,
          severity: "safe",
        },
        sexual: {
          filtered: false,
          severity: "safe",
        },
        violence: {
          filtered: false,
          severity: "safe",
        },
      },
    },
  ],
  system_fingerprint: null,
  usage: {
    completion_tokens: 20,
    prompt_tokens: 79,
    total_tokens: 99,
  },
};
const localStorageMock = (function () {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
    removeItem(key) {
      delete store[key];
    },
  };
})();
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});
global.fetch = jest.fn();

describe("Chatbot component", () => {
  beforeEach(() => {
    fetchMock.reset();
    localStorage.clear();
  });

  test("Chatbot toggle", () => {
    render(
      <UserProviderTest>
        <Chatbot />
      </UserProviderTest>
    );

    const botIcon = screen.getByTestId("assistantAva");

    fireEvent.click(botIcon);
    expect(screen.getByText("Trợ lý ảo VictoryU")).toBeInTheDocument();
    expect(screen.getByText(/Xin chào/i)).toBeInTheDocument();

    fireEvent.click(botIcon);

    expect(screen.queryByText("Trợ lý ảo VictoryU")).not.toBeInTheDocument();
  });

  test("Submits a message", async () => {
    fetchMock.post(
      "https://toeicchatbot.openai.azure.com/openai/deployments/chat-gpt-35/chat/completions?api-version=2024-02-15-preview",
      {
        status: 200,
        body: chatRep,
      }
    );

    render(
      <UserProviderTest
        initialUser={{
          username: "testUser",
          idUser: "12345",
          auth: true,
          role: ["Student", "VipStudent"],
          token: "mockToken",
          ava: "https://img.icons8.com/ios/100/user-male-circle--v1.png",
        }}
      >
        <Chatbot />
      </UserProviderTest>
    );

    const botIcon = screen.getByTestId("assistantAva");
    fireEvent.click(botIcon);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Cách mua VIP" },
    });

    fireEvent.click(screen.getByTestId("submit-question"));

    const msg = await screen.findByText("Câu trả lời của hệ thống");
    expect(msg).toBeInTheDocument();
  });

  test("Clears conversation history", () => {
    const { container } = render(
      <UserProviderTest>
        <Chatbot />
      </UserProviderTest>
    );

    const botIcon = screen.getByTestId("assistantAva");
    fireEvent.click(botIcon);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Cách mua VIP" },
    });

    fireEvent.click(screen.getByTestId("submit-question"));

    // Click the clear history button
    fireEvent.click(container.querySelector(".fa-ellipsis"));
    fireEvent.click(screen.getByText("Xóa lịch sử"));

    const msg = screen.getAllByTestId("chat-msg");
    expect(msg.length).toBe(1);
  });

  test("SubmitChatbot handles Free", async () => {
    fetchMock.reset();
    fetchMock.getOnce(
      `${
        process.env.REACT_APP_API_BASE_URL ?? "/api"
      }/ChatBot/GetAvailable/${12345}`,
      {
        status: 200,
        body: {
          idUser: "420f91ad-2927-4181-a1fb-52095831e965",
          availableChat: 0,
          lastReset: "2024-07-02T02:51:29.5344941Z",
        },
      }
    );
    render(
      <UserProviderTest>
        <Chatbot />
      </UserProviderTest>
    );

    const botIcon = screen.getByTestId("assistantAva");
    fireEvent.click(botIcon);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Cách mua VIP" },
    });
    fireEvent.click(screen.getByTestId("submit-question"));
    const noti = await screen.findByText(/hết lượt free/i);
    expect(noti).toBeInTheDocument();
  });

  test("SubmitChatbot handles API 429 Error", async () => {
    fetchMock.reset();

    fetchMock.post(
      "https://toeicchatbot.openai.azure.com/openai/deployments/chat-gpt-35/chat/completions?api-version=2024-02-15-preview",
      {
        status: 429,
        body: {
          error: {
            code: "429",
            message:
              "Requests to the ChatCompletions_Create Operation under Azure OpenAI API version 2024-02-15-preview have exceeded call rate limit of your current OpenAI S0 pricing tier. Please retry after 9 seconds. Please go here: https://aka.ms/oai/quotaincrease if you would like to further increase the default rate limit.",
          },
        },
      }
    );

    render(
      <UserProviderTest
        initialUser={{
          username: "testUser",
          idUser: "12345",
          auth: true,
          role: ["Student", "VipStudent"],
          token: "mockToken",
          ava: "https://img.icons8.com/ios/100/user-male-circle--v1.png",
        }}
      >
        <Chatbot />
      </UserProviderTest>
    );

    const botIcon = screen.getByTestId("assistantAva");
    fireEvent.click(botIcon);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Cách mua VIP" },
    });

    fireEvent.click(screen.getByTestId("submit-question"));
    const noti = await screen.findByText(/gửi yêu cầu quá nhanh/i);
    expect(noti).toBeInTheDocument();
  });

  test("SubmitChatbot handles API Sys Error", async () => {
    fetchMock.reset();

    fetchMock.post(
      "https://toeicchatbot.openai.azure.com/openai/deployments/chat-gpt-35/chat/completions?api-version=2024-02-15-preview",
      {
        status: 400,
        body: {
          error: {
            code: "400",
            message: "",
          },
        },
      }
    );

    render(
      <UserProviderTest
        initialUser={{
          username: "testUser",
          idUser: "12345",
          auth: true,
          role: ["Student", "VipStudent"],
          token: "mockToken",
          ava: "https://img.icons8.com/ios/100/user-male-circle--v1.png",
        }}
      >
        <Chatbot />
      </UserProviderTest>
    );

    const botIcon = screen.getByTestId("assistantAva");
    fireEvent.click(botIcon);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Cách mua VIP" },
    });

    fireEvent.click(screen.getByTestId("submit-question"));
    const noti = await screen.findByText(/lỗi hệ thống/i);
    expect(noti).toBeInTheDocument();
  });

  test("UpdateAvalable handles", async () => {
    fetchMock.reset();
    fetchMock.getOnce(
      `${
        process.env.REACT_APP_API_BASE_URL ?? "/api"
      }/ChatBot/GetAvailable/${12345}`,
      {
        status: 200,
        body: {
          idUser: "420f91ad-2927-4181-a1fb-52095831e965",
          availableChat: 2,
          lastReset: "2024-07-02T02:51:29.5344941Z",
        },
      }
    );
    fetchMock.put(
      `${
        process.env.REACT_APP_API_BASE_URL ?? "/api"
      }/ChatBot/UpdateAvalableChat/12345`,
      {
        status: 500,
        body: { error: "Internal Server Error" },
      }
    );

    render(
      <UserProviderTest>
        <Chatbot />
      </UserProviderTest>
    );

    const botIcon = screen.getByTestId("assistantAva");
    fireEvent.click(botIcon);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Cách mua VIP" },
    });

    fireEvent.click(screen.getByTestId("submit-question"));
  });
});
