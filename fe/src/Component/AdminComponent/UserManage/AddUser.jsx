import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";
import "./AddUser.css";
import { UserContext } from "../../../Context/UserContext";
import { useForm } from "react-hook-form";

function AddUser() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const {
    register: userData,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddUser(data) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Admin/Register-Professor-Admin?role=${data?.role}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(data),
        }
      );
      setIsLoading(false);
      if (response.ok) toast.success("Thêm người dùng thành công");
      else {
        toast.error("Thêm người dùng thất bại", {});
      }
    } catch (error) {
      toast.error(`${error}`);
    }
    navigate(`/admin/user`);
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="add-lesson-wrapper">
      <div className="professor-board-header">
        <div className="professor-managment-title">
          <h3 style={{ marginLeft: "1rem" }}>THÊM NGƯỜI DÙNG MỚI</h3>
        </div>
        <img
          onClick={() => navigate(`/admin/user`)}
          width="50"
          height="50"
          src="https://img.icons8.com/ios-filled/50/2d9358/reply-arrow.png"
          alt="reply-arrow"
        />
      </div>
      <div className="add-user-form-wrapper">
        <form onSubmit={handleSubmit(handleAddUser)}>
          <div>
            <h3>Họ và tên</h3>
            <input
              placeholder="Nhập họ tên"
              {...userData("fullname", { required: true })}
            />
            <error>
              {errors.fullname?.type === "required" &&
                "Không được để trống họ tên"}
            </error>
          </div>
          <div>
            <h3>Username</h3>
            <input
              placeholder="Nhập username"
              {...userData("username", { required: true })}
            />
            <error>
              {errors.username?.type === "required" &&
                "Không được để trống username"}
            </error>
          </div>
          <div>
            <h3>Email</h3>
            <input
              placeholder="Nhập email"
              {...userData("email", { required: true })}
            />
            <error>
              {errors.email?.type === "required" && "Không được để trống email"}
            </error>
          </div>
          <div>
            <h3>Password</h3>
            <input
              placeholder="Nhập password"
              {...userData("password", { required: true })}
            />
            <error>
              {errors.password?.type === "required" &&
                "Không được để trống password"}
            </error>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3>Role</h3>
            <select className="" {...userData("role", { required: true })}>
              <option value="Professor">Professor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <button type="submit" className="professor-add-lesson-btn">
              Thêm người dùng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
