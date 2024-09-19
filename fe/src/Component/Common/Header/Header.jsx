import React, { useContext, useEffect } from "react";
import Head from "./Head";
import "./Header.css";
import logo from "../../../assets/logo-header.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserContext } from "../../../Context/UserContext";
import { GoogleLogout } from "react-google-login";
import { loadGapiInsideDOM } from "gapi-script";

function Header() {
  const [click, setClick] = useState(false);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  function handleLogout() {
    logout();
    navigate("/");
  }
  const initGapi = async () => {
    try {
      const resp = await loadGapiInsideDOM();
      if (resp) console.log("Google API loaded successfully!");
    } catch (error) {
      console.log("Error loading Google API:", error);
    }
  };
  useEffect(() => {
    initGapi();
  }, []);

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
                data-testid="logo-image"
              ></img>
            </li>
            <li>
              <Link to="/courses">KHÓA HỌC</Link>
            </li>
            <li>
              <div>
                <div onClick={() => navigate("/practice-vocabulary")}>
                  TỪ VỰNG <i className="fas fa-caret-down"></i>
                </div>
                <div className="dropdown-menu">
                  <ul>
                    {user.auth && (
                      <div className="dropdown-item">
                        <Link to={`/vocabulary-by-user/${user.idUser}`}>
                          Từ của bạn
                        </Link>
                      </div>
                    )}
                    <div className="dropdown-item">
                      <Link to={`/practice-vocabulary`}>Khám phá</Link>
                    </div>
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <div>
                <div onClick={() => navigate("/test")}>
                  ĐỀ THI THỬ <i className="fas fa-caret-down"></i>
                </div>
                <div className="dropdown-menu">
                  <ul>
                    <div className="dropdown-item">
                      <Link to={`/test/type/MiniTest`}>MiniTest</Link>
                    </div>
                    <div className="dropdown-item">
                      <Link to={`/test/type/FullTest`}>FullTest</Link>
                    </div>
                  </ul>
                </div>
              </div>
            </li>
            {user.auth && (
              <li style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Link to="/vippackage">GET PRO</Link>
                <img
                  width="32"
                  height="32"
                  src="https://img.icons8.com/fluency/48/crown.png"
                  alt="crown"
                />
              </li>
            )}
          </ul>
          {user.auth ? (
            <div className="navbar-user">
              <div className="navbar-user-infor">
                {user.role[1] === "VipStudent" ? (
                  <img
                    width="64"
                    height="64"
                    src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-vip-music-festival-flaticons-flat-flat-icons.png"
                    alt=""
                    data-testid="vip-image"
                  />
                ) : (
                  <></>
                )}
                <div className="navbar-user-avatar">
                  <img
                    src={
                      user.ava ||
                      "https://img.icons8.com/ios/100/user-male-circle--v1.png"
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
                    <GoogleLogout
                      clientId="1047820244524-i4q01pgchejg1cvdfne578ag4sj44elo.apps.googleusercontent.com"
                      buttonText="Đăng xuất"
                      onLogoutSuccess={() => {
                        console.log("Logout success.");
                      }}
                      icon={false}
                      className="customButtonLogout "
                    />
                  </div>
                </ul>
              </div>
            </div>
          ) : (
            <div className="start">
              <div className="login-button">
                <Link to="/login">ĐĂNG NHẬP</Link>
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
