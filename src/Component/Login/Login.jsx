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

import { GoogleLogin } from "react-google-login";

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
    const loginElement = document.getElementById("login");
    if (loginElement) {
      loginElement.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  async function handleLogin(login_data) {
    setIsLoading(true);
    try {
      const response = await userAuthen(
        login_data.username,
        login_data.password
      );
      setIsLoading(false);
      if (!response.ok) {
        if (response.status === 404) {
          const errorData = await response.json();
          toast.warning(`${errorData.message}`);
        } else {
          toast.error("Đăng nhập không thành công", {
            autoClose: false,
          });
        }
      } else {
        const data = await response.json();
        if (data.token !== undefined) {
          loginContext(data.token);
          const returnPath = localStorage.getItem("returnPath");
          if (returnPath) {
            // Chuyển hướng người dùng về trang trước khi đăng nhập
            navigate(returnPath);
            localStorage.removeItem("returnPath"); // Xóa đường dẫn sau khi đã sử dụng
          } else {
            // Nếu không có đường dẫn trước đó, chuyển hướng về trang chủ
            navigate("/");
          }
        } else {
          // setIs2FA(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSignUp(sign_up_data) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Authen/Register`,
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
        toast.error(`${errorData.message}`, {});
      } else {
        const data = await response.json();
        toast.success(`${data.message}`);
        SwitchSignUpMode(false);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Authen/Login-2FA`,
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
        toast.error(`${errorData.message}`);
      } else {
        const data = await response.json();
        toast.success(`${data.message}`);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const LoginGoogle = async (resp) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/authen/LoginGoogleResponse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resp),
        }
      );
      setIsLoading(false);
      if (response.ok) {
        const data = await response.json();
        if (data.token !== undefined) {
          loginContext(data.token);
          const returnPath = localStorage.getItem("returnPath");
          if (returnPath) {
            navigate(returnPath);
            localStorage.removeItem("returnPath");
          } else {
            navigate("/");
          }
        }
      } else {
        toast.error("Đăng nhập không thành công");
      }
    } catch (e) {}
  };

  if (isloading) {
    return <Loader />;
  }
  function SwitchSignUpMode(mode) {
    setSignUpMode(mode);
  }
  return (
    <div className="login-wrapper">
      <div className="login" id="login">
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
                      id="login-username"
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
                      id="login-password"
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
                  <input
                    type="submit"
                    value="Đăng nhập"
                    className="btn"
                    id="login-btn"
                  />
                  <p className="social-text">Đăng nhập bằng tài khoản khác</p>
                  <div className="social-media">
                    <a href="#" className="social-icon">
                      <i className="fab fa-facebook"></i>
                    </a>
                    <a href="" className="social-icon">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <GoogleLogin
                      clientId="1047820244524-i4q01pgchejg1cvdfne578ag4sj44elo.apps.googleusercontent.com"
                      buttonText=""
                      onSuccess={(response) => {
                        LoginGoogle(response.profileObj);
                      }}
                      onFailure={(e) => {
                        toast.error("Đăng nhập bằng google thất bại");
                      }}
                      cookiePolicy={"single_host_origin"}
                      isSignedIn={true}
                      className="social-icon customLoginGoogle"
                    />
                    <a href="" className="social-icon">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                  <div
                    className="sign-up-mobile"
                    id="sign-up-mobile"
                    onClick={() => SwitchSignUpMode(true)}
                  >
                    Đăng kí tài khoản
                  </div>
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
                  id="signup-username"
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
                  id="signup-email"
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
                  id="signup-password"
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
              <input
                type="submit"
                value="Đăng ký"
                className="btn"
                id="signup-btn"
              />
              <p className="social-text">Đăng nhập bằng tài khoản khác</p>
              <div className="social-media">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href={`${
                    process.env.REACT_APP_API_BASE_URL ?? "/api"
                  }/Authen/GoogleLogin`}
                  className="social-icon"
                >
                  <i className="fab fa-google"></i>
                </a>
                <a href="" className="social-icon">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
              <div
                className="sign-in-mobile"
                id="sign-in-mobile"
                onClick={() => SwitchSignUpMode(false)}
              >
                Đăng nhập
              </div>
            </form>
          </div>
          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content">
                <h3>Đã là thành viên?</h3>
                <p>Đăng nhập để trải nghiệm trang web ngay!!!</p>
                <button
                  className="btn"
                  id="switch-sign-in-btn"
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
                  id="switch-sign-up-btn"
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
