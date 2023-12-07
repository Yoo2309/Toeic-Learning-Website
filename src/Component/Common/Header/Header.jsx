import React, { useContext, useEffect } from "react";
import Head from "./Head";
import "./Header.css";
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
  }
  async function fetchTestType() {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://localhost:7112/api/TestType/GetAllTestTypes"
      );
      console.log(response);
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
            <li>
              <Link to="/">HOME</Link>
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
                <div className="navbar-user-avatar">
                  <img
                    src="https://img.icons8.com/papercut/100/user-female-circle.png"
                    alt=""
                  />
                </div>
                <div className="navbar-user-name">{user.username}</div>
                <i className="fas fa-caret-down"></i>
              </div>
              <div className="dropdown-menu">
                <ul>
                  <div className="dropdown-item">
                    <Link to="/user/profile">Trang cá nhân</Link>
                  </div>
                  <div className="dropdown-item">
                    <Link to="/vippackage">Mua gói Vip</Link>
                  </div>
                  <div className="dropdown-item">
                    <Link to="/payment-history">Lịch sử thanh toán</Link>
                  </div>
                  <div className="dropdown-item" onClick={handleLogout}>
                    Logout
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
