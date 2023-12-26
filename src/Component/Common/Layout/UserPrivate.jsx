import React, { useContext} from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../../../Context/UserContext";

function UserPrivate({ element, allowedRoles, ...rest }) {
  const token = localStorage.getItem("token")
  const {decodeToken} = useContext(UserContext)
  return token && decodeToken(token) ? (
    <Outlet />
  ) : (
    <Navigate to="login" />
  );
}

export default UserPrivate;
