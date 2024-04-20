import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { UserContext } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import Loader from "../Common/Loader/Loader";

function ChangePassword() {
  const { user, logout } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register: changePassData,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  async function handleChangPassword(data) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Authen/ChangePassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            username: user.username,
            currentPassword: data.password,
            newPassword: data.new_password,
            confirmPassword: data.confirm_password,
          }),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error("Đổi password thất bại", {});
      } else {
        toast.success("Đổi password thành công");
        logout();
        navigate("/");
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="flex items-center justify-between flex-col my-5">
      <form
        onSubmit={handleSubmit(handleChangPassword)}
        className="bg-white px-10 pb-10 pt-2 rounded-md w-[500px] flex flex-col items-center"
      >
        <h1>Đổi mật khẩu</h1>
        <div className="w-full h-12 bg-gray-100 my-2 border-2 border-blue-900 rounded-full flex items-center">
          <input
            className="flex-1 bg-transparent border-none outline-none w-full text-lg font-semibold text-black px-4"
            type="text"
            placeholder="Nhập mật khẩu cũ"
            {...changePassData("password", { required: true })}
          />
        </div>
        <error>
          {errors.password?.type === "required" && "OTP is required"}
        </error>
        <div className="w-full h-12 bg-gray-100 my-2 border-2 border-blue-900 rounded-full flex items-center">
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none w-full text-lg font-semibold text-black px-4"
            placeholder="Nhập mật khẩu mới"
            {...changePassData("new_password", {
              required: true,
              pattern:
                /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{6,}/,
            })}
          />
        </div>
        <error>
          {errors.new_password?.type === "required" && "Password is required"}
          {errors.new_password?.type === "pattern" &&
            "Phải có ít nhất 6 ký tự, một chữ hoa, một chữ thường, một chữ số, một ký tự đặc biệt"}
        </error>
        <div className="w-full h-12 bg-gray-100 my-2 border-2 border-blue-900 rounded-full flex items-center">
          <input
            type={"text"}
            className="flex-1 bg-transparent border-none outline-none w-full text-lg font-semibold text-black px-4"
            placeholder="Xác nhận mật khẩu"
            {...changePassData("confirm_password", {
              required: true,
              validate: (value) =>
                value === getValues("new_password") || "Mật khẩu không khớp",
            })}
          />
        </div>
        <error>
          {errors.confirm_password?.type === "required" &&
            "Confirm Password is required"}
          {errors.confirm_password?.type === "validate" &&
            "Mật khẩu không khớp"}
        </error>
        <input type="submit" className="send-otp-submit"></input>
      </form>
    </div>
  );
}

export default ChangePassword;
