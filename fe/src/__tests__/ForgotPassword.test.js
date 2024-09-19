import fetchMock from "fetch-mock";
import { renderWithCustom } from "../constant/testConst";
import ForgotPassword from "../Component/Login/ForgotPassword";
import { fireEvent, screen, waitFor } from "@testing-library/react";

describe("Forgot Password", () => {
  beforeEach(() => {
    fetchMock.reset();
    fetchMock.post(
      `${
        process.env.REACT_APP_API_BASE_URL ?? "/api"
      }/Authen/SendForgotPasswordCode?email=test@example.com`, // Replace with your actual endpoint URL and parameters
      {
        status: 200,
        body: { status: "Success", message: "OTP sent successfully" },
      }
    );
    fetchMock.post(
      `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Authen/ForgotPassword`,
      {
        status: 200,
        body: {
          status: "Success",
          message: "Đặt lại password thành công",
        },
      }
    );
  });
  test("Element mail", () => {
    renderWithCustom(<ForgotPassword />);
    const mailInput = screen.getByPlaceholderText("Nhập Email");
    expect(mailInput).toBeInTheDocument();
  });

  test("Send mail", async () => {
    renderWithCustom(<ForgotPassword />);

    const mailInput = screen.getByPlaceholderText("Nhập Email");
    expect(mailInput).toBeInTheDocument();

    fireEvent.change(mailInput, { target: { value: "test@example.com" } });

    const submit = screen.getByTestId("submit-mail");
    fireEvent.click(submit);

    const otpInput = await screen.findByText(/ĐẶT LẠI MẬT KHẨU/i);
    expect(otpInput).toBeInTheDocument();
  });

  test("Reset Password", async () => {
    const { container } = renderWithCustom(<ForgotPassword />);

    const mailInput = screen.getByPlaceholderText("Nhập Email");
    expect(mailInput).toBeInTheDocument();

    fireEvent.change(mailInput, { target: { value: "test@example.com" } });

    const submit = screen.getByTestId("submit-mail");
    fireEvent.click(submit);

    const label = await screen.findByText(/ĐẶT LẠI MẬT KHẨU/i);
    expect(label).toBeInTheDocument();

    const opt = screen.getByPlaceholderText("Nhập OTP");
    expect(opt).toBeInTheDocument();
    const newPwd = screen.getByPlaceholderText("Nhập mật khẩu mới");
    expect(newPwd).toBeInTheDocument();
    const confirmPwd = screen.getByPlaceholderText("Xác nhận mật khẩu");
    expect(confirmPwd).toBeInTheDocument();

    fireEvent.change(opt, { target: { value: "123456" } });
    fireEvent.change(newPwd, { target: { value: "Dutran@2309" } });
    fireEvent.change(confirmPwd, { target: { value: "Dutran@2309" } });

    const otpInput = container.querySelector(".send-otp-submit");
    expect(otpInput).toBeInTheDocument();
    fireEvent.click(otpInput);

    await waitFor(() => {
      expect(
        screen.getByText("Đặt lại password thành công")
      ).toBeInTheDocument();
    });
  });

  test("Validate Field", async () => {
    const { container } = renderWithCustom(<ForgotPassword />);

    const mailInput = screen.getByPlaceholderText("Nhập Email");
    expect(mailInput).toBeInTheDocument();

    fireEvent.change(mailInput, { target: { value: "test@example.com" } });

    const submit = screen.getByTestId("submit-mail");
    fireEvent.click(submit);

    const label = await screen.findByText(/ĐẶT LẠI MẬT KHẨU/i);
    expect(label).toBeInTheDocument();

    const opt = screen.getByPlaceholderText("Nhập OTP");
    expect(opt).toBeInTheDocument();
    const newPwd = screen.getByPlaceholderText("Nhập mật khẩu mới");
    expect(newPwd).toBeInTheDocument();
    const confirmPwd = screen.getByPlaceholderText("Xác nhận mật khẩu");
    expect(confirmPwd).toBeInTheDocument();

    fireEvent.change(opt, { target: { value: "" } });
    fireEvent.blur(opt);

    const otpInput = container.querySelector(".send-otp-submit");
    expect(otpInput).toBeInTheDocument();
    fireEvent.click(otpInput);

    const otpError = await screen.findByText("OTP is required");
    expect(otpError).toBeInTheDocument();
  });

  test("Validate Password", async () => {
    const { container } = renderWithCustom(<ForgotPassword />);

    const mailInput = screen.getByPlaceholderText("Nhập Email");
    expect(mailInput).toBeInTheDocument();

    fireEvent.change(mailInput, { target: { value: "test@example.com" } });

    const submit = screen.getByTestId("submit-mail");
    fireEvent.click(submit);

    const label = await screen.findByText(/ĐẶT LẠI MẬT KHẨU/i);
    expect(label).toBeInTheDocument();

    const opt = screen.getByPlaceholderText("Nhập OTP");
    expect(opt).toBeInTheDocument();
    const newPwd = screen.getByPlaceholderText("Nhập mật khẩu mới");
    expect(newPwd).toBeInTheDocument();
    const confirmPwd = screen.getByPlaceholderText("Xác nhận mật khẩu");
    expect(confirmPwd).toBeInTheDocument();

    fireEvent.change(opt, { target: { value: "123456" } });
    fireEvent.blur(opt);
    fireEvent.change(newPwd, { target: { value: "test" } });
    fireEvent.blur(newPwd);
    fireEvent.change(confirmPwd, { target: { value: "test" } });
    fireEvent.blur(confirmPwd);

    const otpInput = container.querySelector(".send-otp-submit");
    expect(otpInput).toBeInTheDocument();
    fireEvent.click(otpInput);

    const otpError = await screen.findByText(/Phải có ít nhất 6 ký tự/i);
    expect(otpError).toBeInTheDocument();
  });

  test("Validate Confirm Password", async () => {
    const { container } = renderWithCustom(<ForgotPassword />);

    const mailInput = screen.getByPlaceholderText("Nhập Email");
    expect(mailInput).toBeInTheDocument();

    fireEvent.change(mailInput, { target: { value: "test@example.com" } });

    const submit = screen.getByTestId("submit-mail");
    fireEvent.click(submit);

    const label = await screen.findByText(/ĐẶT LẠI MẬT KHẨU/i);
    expect(label).toBeInTheDocument();

    const opt = screen.getByPlaceholderText("Nhập OTP");
    expect(opt).toBeInTheDocument();
    const newPwd = screen.getByPlaceholderText("Nhập mật khẩu mới");
    expect(newPwd).toBeInTheDocument();
    const confirmPwd = screen.getByPlaceholderText("Xác nhận mật khẩu");
    expect(confirmPwd).toBeInTheDocument();

    fireEvent.change(opt, { target: { value: "123456" } });
    fireEvent.blur(opt);
    fireEvent.change(newPwd, { target: { value: "Dutran@2309" } });
    fireEvent.blur(newPwd);
    fireEvent.change(confirmPwd, { target: { value: "test" } });
    fireEvent.blur(confirmPwd);

    const otpInput = container.querySelector(".send-otp-submit");
    expect(otpInput).toBeInTheDocument();
    fireEvent.click(otpInput);

    const otpError = await screen.findByText(/Mật khẩu không khớp/i);
    expect(otpError).toBeInTheDocument();
  });

  test("Error Reset", async () => {
    fetchMock.reset();
    fetchMock.post(
      `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Authen/ForgotPassword`,
      {
        status: 400,
        body: { message: "Invalid OTP" },
      }
    );
    fetchMock.post(
      `${
        process.env.REACT_APP_API_BASE_URL ?? "/api"
      }/Authen/SendForgotPasswordCode?email=test@example.com`, // Replace with your actual endpoint URL and parameters
      {
        status: 200,
        body: { status: "Success", message: "OTP sent successfully" },
      }
    );

    const { container } = renderWithCustom(<ForgotPassword />);

    const mailInput = screen.getByPlaceholderText("Nhập Email");
    expect(mailInput).toBeInTheDocument();

    fireEvent.change(mailInput, { target: { value: "test@example.com" } });

    const submit = screen.getByTestId("submit-mail");
    fireEvent.click(submit);

    const label = await screen.findByText(/ĐẶT LẠI MẬT KHẨU/i);
    expect(label).toBeInTheDocument();

    const opt = screen.getByPlaceholderText("Nhập OTP");
    expect(opt).toBeInTheDocument();
    const newPwd = screen.getByPlaceholderText("Nhập mật khẩu mới");
    expect(newPwd).toBeInTheDocument();
    const confirmPwd = screen.getByPlaceholderText("Xác nhận mật khẩu");
    expect(confirmPwd).toBeInTheDocument();

    fireEvent.change(opt, { target: { value: "123456" } });
    fireEvent.blur(opt);
    fireEvent.change(newPwd, { target: { value: "Dutran@2309" } });
    fireEvent.blur(newPwd);
    fireEvent.change(confirmPwd, { target: { value: "Dutran@2309" } });
    fireEvent.blur(confirmPwd);

    const otpInput = container.querySelector(".send-otp-submit");
    expect(otpInput).toBeInTheDocument();
    fireEvent.click(otpInput);

    const otpError = await screen.findByText(
      /Đặt lại password không thành công/i
    );
    expect(otpError).toBeInTheDocument();
  });
});
