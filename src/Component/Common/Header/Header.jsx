import React, { useContext, useEffect } from "react";
import Head from "./Head";
import "./Header.css";
import logo from "../../../assets/logo-header.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserContext } from "../../../Context/UserContext";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";

function Header() {
  const [click, setClick] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [testType, setTestType] = useState([]);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  function handleLogout() {
    logout();
    navigate("/");
    window.location.reload();
  }
  async function fetchTestType() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/TestType/GetAllTestTypes`
      );
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`${errorData.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      const data = await response.json();
      setTestType(data);
      setIsLoading(false);
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
  }
  useEffect(() => {
    fetchTestType();
  }, []);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="header">
      <Head />
      <header>
        <div className="flexSB">
          <ul
            className={click ? "mobile-nav" : "flexSB "}
            onClick={() => setClick(false)}
          >
            <li
              style={{
                padding: "0 20px 0 20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                onClick={() => navigate("/")}
                style={{ width: "78px" }}
                src={logo}
                alt=""
              ></img>
            </li>
            <li>
              <Link to="/courses">KHÓA HỌC</Link>
            </li>
            <li>
              <Link to="/practice-vocabulary">TỪ VỰNG</Link>
            </li>
            <li>
              <Link to="/test">
                ĐỀ THI THỬ <i className="fas fa-caret-down"></i>
                <div className="dropdown-menu">
                  <ul>
                    {testType &&
                      testType.map((type, index) => {
                        return (
                          <div key={index} className="dropdown-item">
                            <Link to={`/test/type/${type.typeName}`}>
                              {type.typeName}
                            </Link>
                          </div>
                        );
                      })}
                  </ul>
                </div>
              </Link>
            </li>
            {user.auth && (
              <li
                style={{
                  padding: "0 20px 0 20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  onClick={() => navigate("/vippackage")}
                  style={{ height: "26px" }}
                  src="https://estudyme.com/images/get-pro/btn-get-pro.png"
                  alt=""
                ></img>
              </li>
            )}
          </ul>
          {!user.auth ? (
            <div className="start">
              <div className="button">
                <Link to="/login">LOGIN</Link>
              </div>
            </div>
          ) : (
            <div className="navbar-user">
              <div className="navbar-user-infor">
                {user.role[1] === "VipStudent" ? (
                  <img
                    width="64"
                    height="64"
                    src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-vip-music-festival-flaticons-flat-flat-icons.png"
                    alt=""
                  />
                ) : (
                  <></>
                )}
                <div className="navbar-user-avatar">
                  <img
                    src={
                      user.ava ||
                      "https://img.icons8.com/papercut/100/user-female-circle.png"
                    }
                    alt=""
                  />
                </div>
                <div className="navbar-user-name">{user.username}</div>
                <i className="fas fa-caret-down"></i>
              </div>
              <div className="dropdown-menu">
                <ul>
                  <div className="dropdown-item">
                    <Link to={`/user/profile/${user.idUser}`}>
                      Trang cá nhân
                    </Link>
                  </div>
                  <div className="dropdown-item">
                    <Link to={`/user/changePassword`}>Đổi mật khẩu</Link>
                  </div>
                  <div className="dropdown-item">
                    <Link to="/payment-history">Lịch sử thanh toán</Link>
                  </div>
                  <div className="dropdown-item">
                    <Link to="/test/record">Lịch sử làm bài</Link>
                  </div>
                  <div className="dropdown-item" onClick={handleLogout}>
                    Đăng xuất
                  </div>
                </ul>
              </div>
            </div>
          )}
          <button className="toggle" onClick={() => setClick(!click)}>
            {click ? (
              <i className="fa fa-times"> </i>
            ) : (
              <i className="fa fa-bars"></i>
            )}
          </button>
        </div>
      </header>
    </div>
  );
}

export default Header;
