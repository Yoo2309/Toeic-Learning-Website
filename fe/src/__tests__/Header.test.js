import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithCustom, renderWithUserRole } from "../constant/testConst";
import Header from "../Component/Common/Header/Header";

jest.mock("gapi-script", () => ({
  loadGapiInsideDOM: jest.fn().mockResolvedValue(true),
}));

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Header element", () => {
    renderWithCustom(<Header />);
    const course = screen.getByText(/Khóa học/i);
    expect(course).toBeInTheDocument();

    const vocab = screen.getByText(/Từ vựng/i);
    expect(vocab).toBeInTheDocument();

    const test = screen.getByText(/Đề thi thử/i);
    expect(test).toBeInTheDocument();

    const loginBtn = screen.getByText(/Đăng nhập/i);
    expect(loginBtn).toBeInTheDocument();

    const logoutBtn = screen.queryByText(/Đăng xuất/i);
    expect(logoutBtn).not.toBeInTheDocument();
  });

  test("User header", () => {
    renderWithUserRole(<Header />);
    const course = screen.getByText(/GET PRO/i);
    expect(course).toBeInTheDocument();

    const username = screen.getByText(/testUser/i);
    expect(username).toBeInTheDocument();

    const profileLabel = screen.getByText(/trang cá nhân/i);
    expect(profileLabel).toBeInTheDocument();
    const changPwdLabel = screen.getByText(/mật khẩu/i);
    expect(changPwdLabel).toBeInTheDocument();
    const testHistory = screen.getByText(/làm bài/i);
    expect(testHistory).toBeInTheDocument();
    const paidHistory = screen.getByText(/thanh toán/i);
    expect(paidHistory).toBeInTheDocument();
    const lougoutLabel = screen.getByText(/đăng xuất/i);
    expect(lougoutLabel).toBeInTheDocument();
    const logo = screen.getByTestId("logo-image");
    expect(logo).toBeInTheDocument();

    const loginBtn = screen.queryByText(/Đăng nhập/i);
    expect(loginBtn).not.toBeInTheDocument();
  });

  test("Header element navigate", async () => {
    renderWithCustom(<Header />);

    const course = await screen.findByText(/Khóa học/i);
    const vocab = await screen.findByText(/Từ vựng/i);
    const test = await screen.findByText(/Đề thi thử/i);
    const loginBtn = await screen.findByText(/Đăng nhập/i);
    const miniTest = await screen.findByText(/MiniTest/i);
    const logo = screen.getByTestId("logo-image");

    fireEvent.click(logo);
    expect(window.location.href).toMatch(/^http(s)?:\/\/[^/]+\/$/);

    fireEvent.click(course);
    expect(window.location.href).toContain("courses");

    fireEvent.click(vocab);
    expect(window.location.href).toContain("practice-vocabulary");

    fireEvent.click(test);
    expect(window.location.href).toContain("test");

    fireEvent.click(loginBtn);
    expect(window.location.href).toContain("login");

    fireEvent.click(miniTest);
    expect(window.location.href).toContain("MiniTest");
  });

  test("User header element navigate", async () => {
    renderWithUserRole(<Header />);

    const profileLabel = await screen.findByText(/trang cá nhân/i);
    fireEvent.click(profileLabel);
    expect(window.location.href).toContain(`/user/profile/12345`);

    const changPwdLabel = await screen.findByText(/mật khẩu/i);
    fireEvent.click(changPwdLabel);
    expect(window.location.href).toContain("changePassword");

    const testHistory = await screen.findByText(/làm bài/i);
    fireEvent.click(testHistory);
    expect(window.location.href).toContain("record");

    const paidHistory = await screen.findByText(/thanh toán/i);
    fireEvent.click(paidHistory);
    expect(window.location.href).toContain("payment");

    const lougoutLabel = await screen.findByText(/đăng xuất/i);
    fireEvent.click(lougoutLabel);

    const usernameElement = screen.queryByText(/testUser/i);
    expect(usernameElement).not.toBeInTheDocument();
  });

  test("Usser header VIP", async () => {
    renderWithUserRole(<Header />, {
      user: {
        username: "dutran",
        idUser: "12345",
        auth: true,
        role: ["Student", "VipStudent"],
        token: "mockToken",
        ava: "https://img.icons8.com/ios/100/user-male-circle--v1.png",
      },
    });

    const vipImage = screen.getByTestId("vip-image");
    expect(vipImage).toBeInTheDocument();
  });
  test("Usser header Logout", async () => {
    renderWithUserRole(<Header />);

    const lougoutLabel = await screen.findByText(/đăng xuất/i);
    fireEvent.click(lougoutLabel);

    const usernameElement = screen.queryByText(/đăng xuất/i);
    expect(usernameElement).not.toBeInTheDocument();
  });
});
