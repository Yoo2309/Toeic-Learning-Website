import _ from "lodash";
import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";
import "./AddUser.css";
import { UserContext } from "../../../Context/UserContext";

function AddUser() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [data, setData] = useState(() => ({
    email: "",
    username: "",
    fullname: "",
    password: "",
    role: "",
  }));
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddUser(data) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/Admin/Register-Professor-Admin?role=${data?.role}`,
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
      if (response.ok)
        toast.success("Add user successfully", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 10000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      else
        toast.error("Add user failded", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
    } catch (error) {
      toast.error(`${error}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    navigate(`/admin/user`);
  }

  function changeInput(e) {
    setData({
      ...data,
      [e.target.id]: e.target.value,
    });
  }

  function validateData(data) {
    return true;
  }

  function clickSubmit() {
    // Validate data
    if (validateData(data)) {
      handleAddUser(data);
    }
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
        <form>
          <div>
            <h3>Họ và tên</h3>
            <input
              value={data.fullname}
              placeholder="Nhập họ và tên"
              id="fullname"
              onChange={changeInput}
            />
          </div>
          <div>
            <h3>Username</h3>
            <input
              placeholder="Nhập username"
              id="username"
              onChange={changeInput}
            />
          </div>
          <div>
            <h3>Email</h3>
            <input placeholder="Nhập email" id="email" onChange={changeInput} />
          </div>
          <div>
            <h3>Password</h3>
            <input
              placeholder="Nhập password"
              id="password"
              onChange={changeInput}
            />
          </div>
          <div>
            <h3>Role</h3>
            <input placeholder="Nhập role" id="role" onChange={changeInput} />
          </div>
          <input
            type="button"
            value="Thêm người dùng"
            className="professor-add-lesson-btn"
            onClick={clickSubmit}
          />
        </form>
      </div>
    </div>
  );
}

export default AddUser;
