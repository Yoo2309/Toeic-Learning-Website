import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

function GoogleLogin() {
  const token = useParams();
  const { loginContext } = useContext(UserContext);
  const navigate = useNavigate()
  useEffect(() => {
    loginContext(token);
    const returnPath = localStorage.getItem("returnPath");
          if (returnPath) {
            // Chuyển hướng người dùng về trang trước khi đăng nhập
            navigate(returnPath);
            localStorage.removeItem("returnPath"); // Xóa đường dẫn sau khi đã sử dụng
          } else {
            // Nếu không có đường dẫn trước đó, chuyển hướng về trang chủ
            navigate("/");
          }
  }, []);
  return <div></div>;
}

export default GoogleLogin;
