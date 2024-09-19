import React, { useContext} from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "../../../Context/UserContext";

function UserPrivate({ element, allowedRoles, ...rest }) {
  const token = localStorage.getItem("token")
  const {decodeToken} = useContext(UserContext)
  const location = useLocation();

  // Lưu trạng thái trang trước khi đăng nhập nếu người dùng chưa đăng nhập
  if (!token || !decodeToken(token)) {
    localStorage.setItem("returnPath", location.pathname);
  }
  return token && decodeToken(token) ? (
    <Outlet />
  ) : (
    <Navigate to="login" />
  );
}

export default UserPrivate;
