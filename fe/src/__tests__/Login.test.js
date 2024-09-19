import React from "react";
import { fireEvent, screen, act, render } from "@testing-library/react";
import { renderWithCustom } from "../constant/testConst";
import fetchMock from "fetch-mock";
import Login from "../Component/Login/Login";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "../Context/UserContext";

const loginResp = {
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidGVzdFVzZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEyMyIsImp0aSI6IjgxMzM3ZjIxLWZkNzgtNDkxOS05M2QwLTk3ZThjMGJhN2IxMyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJTdHVkZW50IiwiVmlwU3R1ZGVudCJdLCJleHAiOjE3MTk3NTMyNzEsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjgwODAifQ.zYJwKKmxuwh42D2kbjeDQRKpFrFTQBIomgYmynnkKrg",
  expiration: "2024-06-30T13:14:31Z",
  emailConfirmed: true,
  freeTest: false,
};

describe("Login", () => {
  beforeEach(() => {
    fetchMock.reset();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    window.scrollTo = jest.fn();
  });

  test("Login Element", () => {
    renderWithCustom(<Login />);

    const username = screen.queryAllByPlaceholderText(/Tên đăng nhập/i);
    expect(username[0]).toBeInTheDocument();

    const pwd = screen.queryAllByPlaceholderText(/Mật khẩu/i);
    expect(pwd[0]).toBeInTheDocument();

    const email = screen.queryByPlaceholderText(/email/i);
    expect(email).toBeInTheDocument();
  });

  test("Validate Login", async () => {
    const { container } = renderWithCustom(<Login />);

    const submitButton = container.querySelector("#login-btn");
    const username = container.querySelector("#login-username");

    await act(async () => {
      fireEvent.change(username, { target: { value: "" } });
      fireEvent.blur(username);
      fireEvent.submit(submitButton);
    });

    const errorMsg1 = await screen.findAllByText(/Username is required/i);
    const errorMsg2 = await screen.findAllByText(/Password is required/i);

    expect(errorMsg1[0]).toBeInTheDocument();
    expect(errorMsg2[0]).toBeInTheDocument();
  });

  test("Validate SignUp", async () => {
    const { container } = renderWithCustom(<Login />);

    const submitButton = container.querySelector("#signup-btn");
    const username = container.querySelector("#signup-username");

    await act(async () => {
      fireEvent.change(username, { target: { value: "" } });
      fireEvent.blur(username);
      fireEvent.submit(submitButton);
    });

    const errorMsg1 = await screen.findAllByText(/Username is required/i);
    const errorMsg2 = await screen.findAllByText(/Password is required/i);
    const errorMsg3 = await screen.findAllByText(/Email is required/i);

    expect(errorMsg1[0]).toBeInTheDocument();
    expect(errorMsg2[0]).toBeInTheDocument();
    expect(errorMsg3[0]).toBeInTheDocument();
  });

  test("Validate SignUp pattern", async () => {
    const { container } = renderWithCustom(<Login />);

    const submitButton = container.querySelector("#signup-btn");
    const email = container.querySelector("#signup-email");
    const passwordInput = container.querySelector("#signup-password");

    await act(async () => {
      fireEvent.change(email, { target: { value: "test" } });
      fireEvent.blur(email);
      fireEvent.change(passwordInput, { target: { value: "test" } });
      fireEvent.blur(passwordInput);
      fireEvent.submit(submitButton);
    });

    const errorMsg1 = await screen.findAllByText(
      /Phải có ít nhất 6 ký tự, một chữ hoa, một chữ thường, một chữ số, một ký tự đặc biệt/i
    );
    const errorMsg2 = await screen.findAllByText(
      /Email đã nhập không đúng định dạng/i
    );

    expect(errorMsg1[0]).toBeInTheDocument();
    expect(errorMsg2[0]).toBeInTheDocument();
  });

  test("Input Login", async () => {
    fetchMock.post(
      `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Authen/Login`,
      {
        status: 200,
        body: loginResp,
      }
    );
    fetchMock.get(
      `${
        process.env.REACT_APP_API_BASE_URL ?? "/api"
      }/Authen/GetProfile?id=123`,
      {
        status: 200,
        body: {
          imageURL: "https://example.com/avatar.jpg",
        },
      }
    );
    const { container } = renderWithCustom(<Login />);

    const submitButton = container.querySelector("#login-btn");
    const username = container.querySelector("#login-username");
    const passwordInput = container.querySelector("#login-password");

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: "testUser" } });
      fireEvent.blur(passwordInput);
      fireEvent.change(username, { target: { value: "NewPass@123" } });
      fireEvent.blur(username);
      fireEvent.submit(submitButton);
    });
  });

  test("Input Login load", async () => {
    const { container } = renderWithCustom(<Login />);

    const submitButton = container.querySelector("#login-btn");
    const username = container.querySelector("#login-username");
    const passwordInput = container.querySelector("#login-password");

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: "testUser" } });
      fireEvent.blur(passwordInput);
      fireEvent.change(username, { target: { value: "NewPass@123" } });
      fireEvent.blur(username);
      fireEvent.submit(submitButton);
    });
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  test("Login failed", async () => {
    fetchMock.reset();
    fetchMock.post(
      `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Authen/Login`,
      {
        status: 401,
        body: {
          type: "https://tools.ietf.org/html/rfc7235#section-3.1",
          title: "Unauthorized",
          status: 401,
          traceId: "00-4ef21a2751a85393b809e74d0e8d8c0a-440f34718ca4a802-00",
        },
      }
    );
    fetchMock.get(
      `${
        process.env.REACT_APP_API_BASE_URL ?? "/api"
      }/Authen/GetProfile?id=123`,
      {
        status: 200,
        body: {
          imageURL: "https://example.com/avatar.jpg",
        },
      }
    );
    const { container } = render(
      <UserProvider>
        <BrowserRouter>
          <ToastContainer autoClose={false} />
          <Login />
        </BrowserRouter>
      </UserProvider>
    );

    const submitButton = container.querySelector("#login-btn");
    const username = container.querySelector("#login-username");
    const passwordInput = container.querySelector("#login-password");

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: "testUser" } });
      fireEvent.blur(passwordInput);
      fireEvent.change(username, { target: { value: "NewPass@123" } });
      fireEvent.blur(username);
      fireEvent.submit(submitButton);
    });
    const msg = await screen.findAllByText(/đăng nhập không thành công/i);
    expect(msg[0]).toBeInTheDocument();
  });

  test("Input SignUp", async () => {
    fetchMock.reset();
    fetchMock.post(
      `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Authen/Register`,
      {
        status: 200,
        body: {
          message:
            "We have sent EmailConfirm to testuser@example.com. Verified your email to Login!",
          status: "Success",
        },
      }
    );

    const { container } = render(
      <UserProvider>
        <BrowserRouter>
          <ToastContainer autoClose={false} />
          <Login />
        </BrowserRouter>
      </UserProvider>
    );

    const submitButton = container.querySelector("#signup-btn");
    const username = container.querySelector("#signup-username");
    const passwordInput = container.querySelector("#signup-password");
    const email = container.querySelector("#signup-email");

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: "testUser" } });
      fireEvent.blur(passwordInput);
      fireEvent.change(username, { target: { value: "NewPass@123" } });
      fireEvent.blur(username);
      fireEvent.change(email, { target: { value: "dutran1@gmail.com" } });
      fireEvent.blur(email);
      fireEvent.submit(submitButton);
    });

    // expect(await screen.findByText(/Verified your email/i)).toBeInTheDocument();
  });
});
