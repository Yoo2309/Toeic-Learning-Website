import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../../../Context/UserContext";
import Loader from "../../Common/Loader/Loader";
import "./UserManage.css";
import { showDeleteWarning } from "../../Common/Alert/Alert";

function UserManage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);

  async function resetPassword(email) {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Admin/ResetPassword/${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({}),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error("Đặt lại password thất bại", {});
      } else {
        toast.success("Đặt lại password thành công");
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  async function fetchUsers() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Admin/GetAllUsers`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData}`);
      } else {
        const data = await response?.json();
        setUsers(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  async function deleteUserById(id) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Admin/DeleteUser/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({}),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error(`Xóa người dùng thất bại`, {});
      } else {
        toast.success("Xóa người dùng thành công");
        fetchUsers();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  useEffect(() => {
    fetchUsers();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="professor-lesson-list">
      <div className="professor-managment-sub-title">
        <h3 style={{ paddingLeft: "10px" }}>QUẢN LÝ NGƯỜI DÙNG</h3>
      </div>

      <div className="professor-add-button-wrapper">
        <img
          onClick={() => navigate("/admin")}
          width="50"
          height="50"
          src="https://img.icons8.com/ios-filled/50/2d9358/reply-arrow.png"
          alt="reply-arrow"
        />
        <div
          className="professor-add-button"
          onClick={() => navigate(`/admin/user/add`)}
        >
          <img
            width="34"
            height="34"
            src="https://img.icons8.com/doodle/48/add.png"
            alt="add"
          />
          <h3>THÊM NGƯỜI DÙNG MỚI</h3>
        </div>
      </div>
      <div className="wordList-wrapper">
        <div className="wordList-item" style={{ fontWeight: 600 }}>
          <div>Họ và tên</div>
          <div>Tên người dùng</div>
          <div>Email</div>
          <div className="btn-wrapper">Hành động</div>
        </div>
        {users &&
          users.map((item, index) => {
            return (
              <div key={index} className="wordList-item">
                <div className="text-truncate">{item?.fullname}</div>
                <div className="text-truncate">{item?.username}</div>
                <div
                  className="text-truncate"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {item?.email}
                  {item?.roles[1] === "VipStudent" && (
                    <img
                      width="34"
                      height="34"
                      src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-vip-music-festival-flaticons-flat-flat-icons.png"
                      alt=""
                    />
                  )}
                </div>
                <div className="btn-wrapper">
                  <button
                    className="delete-btn"
                    onClick={() =>
                      showDeleteWarning(() => deleteUserById(item.id))
                    }
                  >
                    Xóa
                  </button>
                  <button
                    className="update-btn"
                    onClick={() => resetPassword(item?.email)}
                  >
                    Reset password
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default UserManage;
