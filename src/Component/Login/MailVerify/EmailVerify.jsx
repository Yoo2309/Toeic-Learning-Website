import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import css from "./email-verify.module.scss";
import { toast } from "react-toastify";

function EmailVerify() {
  const navigate = useNavigate();

  useEffect(() => {
    const showToast = (seconds) => {
      let message = `Chuyển hướng đến trang đăng nhập sau ${seconds} giây`;

      return new Promise((resolve, reject) => {
        const toastId = toast.info(message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: seconds * 1000, // Thời gian tồn tại của toast là seconds giây
        });

        // Đếm ngược và chuyển hướng sau seconds giây
        const timer = setInterval(() => {
          seconds -= 1;
          if (seconds === 0) {
            clearInterval(timer);
            resolve();
          } else {
            message = `Chuyển hướng đến trang đăng nhập sau ${seconds} giây`;
            toast.update(toastId, {
              render: message,
              autoClose: seconds * 1000,
            });
          }
        }, 1000);
      });
    };

    showToast(5).then(() => {
      navigate("/login");
    });
  }, []);
  console.log("render");

  return (
    <div className={css["login-success-wrapper"]}>
      <div className={css["login-success-bg"]}>
        <img
          width="250"
          height="250"
          src="https://cdn-icons-png.flaticon.com/512/912/912023.png"
          alt="open-envelope"
        />
        <h2>Verified!!!</h2>
        <p>You have successfully verified account.</p>
      </div>
    </div>
  );
}

export default EmailVerify;
