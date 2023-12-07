/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import "./Login.css";
import { useEffect, useState } from "react";
import signinImage from "../../assets/signin.svg";
import signupImage from "../../assets/signup.svg";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import Loader from "../Common/Loader/Loader";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const [signUpMode, setSignUpMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [is2FA, setIs2FA] = useState(false);
  const [otp, setOTP] = useState([]);
  const ref_otp = useRef([]);

  const { userAuthen, loginContext } = useContext(UserContext);
  const {
    register: loginData,
    handleSubmit: handleSubmitLogin,
    formState: { errors: error_login },
    getValues,
  } = useForm();
  const {
    register: SignUpData,
    handleSubmit: handleSubmitSignUp,
    formState: { errors: error_signup },
  } = useForm();
  const focusNextOTPItem = (event, index) => {
    const newotp = [...otp];
    newotp[index] = ref_otp.current[index].value;
    setOTP(newotp);

    if (index < ref_otp.current.length - 1 && event.key !== "Tab") {
      if (index === 0 && ref_otp.current[index].value === "") {
      } else {
        ref_otp.current[index + 1].focus();
      }
    }
    if (event.key === "Backspace" && index > 0) {
      ref_otp.current[index - 1].focus();
      ref_otp.current[index].value = "";
    }
  };
  useEffect(() => {
    window.scrollTo(0, 210);
  }, []);

  async function handleLogin(login_data) {
    setIsLoading(true);
    const response = await userAuthen(login_data.username, login_data.password);
    setIsLoading(false);
    if (!response.ok) {
      const errorData = await response.json();
      toast.error(`${errorData.message}`, {
        position: toast.POSITION.BOTTOM_RIGHT, // Vị trí hiển thị
        autoClose: 5000, // Tự động đóng sau 3 giây
        closeOnClick: true, // Đóng khi click
        pauseOnHover: true, // Tạm dừng khi di chuột qua
        draggable: true, // Có thể kéo thông báo
      });
    } else {
      const data = await response.json();
      if (data.token !== undefined) {
        loginContext(data.token);
        navigate("/");
      } else {
        toast.success(`${data.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 10000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setIs2FA(true);
      }
    }
  }

  async function handleSignUp(sign_up_data) {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://localhost:7112/api/Authen/Register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: sign_up_data.username,
            email: sign_up_data.email,
            password: sign_up_data.password,
          }),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`${errorData.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        const data = await response.json();
        toast.success(`${data.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 10000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
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
  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    console.log(otp, getValues("username"));
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://localhost:7112/api/Authen/Login-2FA",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: otp.join(""),
            username: getValues("username"),
          }),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response.json();
        console.log(response);
        toast.error(`${errorData.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        const data = await response.json();
        toast.success(`${data.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 10000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
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
  };
  if (isloading) {
    return <Loader />;
  }
  function SwitchSignUpMode(mode) {
    setSignUpMode(mode);
  }
  return (
    <div className="login-wrapper" id="login-wrapper">
      <div className="login">
        <div className={`container ${signUpMode ? "sign-up-mode" : null}`}>
          <div className="signin-signup">
            {!is2FA ? (
              <form
                action=""
                className="sign-in-form"
                onSubmit={handleSubmitLogin(handleLogin)}
              >
                <div className="signin-input">
                  <h2 className="title">Đăng nhập</h2>
                  <div className="input-field">
                    <i className="fas fa-user"></i>
                    <input
                      type="text"
                      placeholder="Tên đăng nhập"
                      {...loginData("username", { required: true })}
                    />
                  </div>
                  <error>
                    {error_login.username?.type === "required" &&
                      "Username is required"}
                  </error>
                  <div className="input-field">
                    <i className="fas fa-lock"></i>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mật khẩu"
                      {...loginData("password", { required: true })}
                    />
                    {!showPassword ? (
                      <i
                        className="fa-regular fa-eye"
                        onClick={() => setShowPassword(true)}
                      ></i>
                    ) : (
                      <i
                        className="fa-regular fa-eye-slash"
                        onClick={() => setShowPassword(false)}
                      ></i>
                    )}
                  </div>
                  <error>
                    {error_login.password?.type === "required" &&
                      "Password is required"}
                  </error>
                  <a className="forgot-password">
                    <Link to="/forgot-password">Quên mật khẩu</Link>
                  </a>
                  <input type="submit" value="Đăng nhập" className="btn" />
                  <p className="social-text">Đăng nhập bằng tài khoản khác</p>
                  <div className="social-media">
                    <a href="#" className="social-icon">
                      <i className="fab fa-facebook"></i>
                    </a>
                    <a href="" className="social-icon">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="" className="social-icon">
                      <i className="fab fa-google"></i>
                    </a>
                    <a href="" className="social-icon">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                  <button
                    className="sign-up-mobile"
                    id="sign-up-mobile"
                    onClick={() => SwitchSignUpMode(false)}
                  >
                    Đăng kí tài khoản
                  </button>
                </div>
              </form>
            ) : (
              <div className="confirm-otp-wrapper">
                <div>
                  <h2 className="title" style={{ textAlign: "center" }}>
                    XÁC THỰC OTP
                  </h2>
                  <p style={{ textAlign: "center" }}>
                    OTP xác thực đã được gửi đến email {}
                  </p>
                </div>
                <form className="confirm-otp-form" onSubmit={handleSubmitOTP}>
                  <div className="input-otp-wrapper">
                    <input
                      type="text"
                      className="input-otp-item"
                      maxLength={1}
                      onKeyUp={(event) => focusNextOTPItem(event, 0)}
                      ref={(el) => (ref_otp.current[0] = el)}
                    />
                    <input
                      type="text"
                      className="input-otp-item"
                      maxLength={1}
                      onKeyUp={(event) => focusNextOTPItem(event, 1)}
                      ref={(el) => (ref_otp.current[1] = el)}
                    />
                    <input
                      type="text"
                      id="otp3"
                      className="input-otp-item"
                      maxLength={1}
                      onKeyUp={(event) => focusNextOTPItem(event, 2)}
                      ref={(el) => (ref_otp.current[2] = el)}
                    />
                    <input
                      type="text"
                      className="input-otp-item"
                      maxLength={1}
                      onKeyUp={(event) => focusNextOTPItem(event, 3)}
                      ref={(el) => (ref_otp.current[3] = el)}
                    />
                    <input
                      type="text"
                      className="input-otp-item"
                      maxLength={1}
                      onKeyUp={(event) => focusNextOTPItem(event, 4)}
                      ref={(el) => (ref_otp.current[4] = el)}
                    />
                    <input
                      type="text"
                      className="input-otp-item"
                      maxLength={1}
                      onKeyUp={(event) => focusNextOTPItem(event, 5)}
                      ref={(el) => (ref_otp.current[5] = el)}
                    />
                  </div>
                  <input type="submit" className="send-otp-submit"></input>
                </form>
              </div>
            )}
            <form
              action=""
              className="sign-up-form"
              onSubmit={handleSubmitSignUp(handleSignUp)}
            >
              <h2 className="title">Đăng kí</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Tên đăng nhập"
                  {...SignUpData("username", { required: true })}
                />
              </div>
              <error>
                {error_signup.username?.type === "required" &&
                  "Username is required"}
              </error>
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input
                  type="text"
                  placeholder="Email"
                  {...SignUpData("email", {
                    required: true,
                    pattern:
                      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  })}
                />
              </div>
              <error>
                {error_signup.email?.type === "required" &&
                  "Username is required"}
                {error_signup.email?.type === "pattern" &&
                  "Email đã nhập không đúng định dạng"}
              </error>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  {...SignUpData("password", {
                    required: true,
                    pattern:
                      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{6,}/,
                  })}
                />
                {!showPassword ? (
                  <i
                    className="fa-regular fa-eye"
                    onClick={() => setShowPassword(true)}
                  ></i>
                ) : (
                  <i
                    className="fa-regular fa-eye-slash"
                    onClick={() => setShowPassword(false)}
                  ></i>
                )}
              </div>
              <error>
                {error_signup.password?.type === "required" &&
                  "Username is required"}
                {error_signup.password?.type === "pattern" &&
                  "Phải có ít nhất 6 ký tự, một chữ hoa, một chữ thường, một chữ số, một ký tự đặc biệt"}
              </error>
              <input type="submit" value="Đăng ký" className="btn" />
              <p className="social-text">Đăng nhập bằng tài khoản khác</p>
              <div className="social-media">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="" className="social-icon">
                  <i className="fab fa-google"></i>
                </a>
                <a href="" className="social-icon">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
              <button
                className="sign-in-mobile"
                id="sign-in-mobile"
                onClick={() => SwitchSignUpMode(false)}
              >
                Đăng nhập
              </button>
            </form>
          </div>
          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content">
                <h3>Đã là thành viên?</h3>
                <p>Đăng nhập để trải nghiệm trang web ngay!!!</p>
                <button
                  className="btn"
                  id="sign-in-btn"
                  onClick={() => SwitchSignUpMode(false)}
                >
                  Đăng nhập
                </button>
              </div>
              <img src={signinImage} alt="" className="image" />
            </div>
            <div className="panel right-panel">
              <div className="content">
                <h3>Bạn là người mới?</h3>
                <p>
                  Đăng kí tài khoản để trải nghiệm trang web ngay bây giờ!!!
                </p>
                <button
                  className="btn"
                  id="sign-up-btn"
                  onClick={() => SwitchSignUpMode(true)}
                >
                  Đăng ký
                </button>
              </div>
              <img src={signupImage} alt="" className="image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
