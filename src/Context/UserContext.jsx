import { jwtDecode } from "jwt-decode";
import React from "react";
import { useState, useEffect, createContext } from "react";
import { toast } from "react-toastify";
const UserContext = createContext({
  username: "",
  idUser: "",
  auth: false,
  role: "",
  token: "",
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: "",
    idUser: "",
    auth: false,
    role: "",
    token: "",
    ava: "https://img.icons8.com/papercut/100/user-female-circle.png",
  });
  function isTokenExpired(exp) {
    if (exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      return currentTime > exp;
    } else {
      return false;
    }
  }
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const token_decode = decodeToken(token);
      console.log(token_decode);
      if (token_decode && !isTokenExpired(token_decode.exp)) {
        const {
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name":
            username = "",
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
            role = "",
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier":
            idUser = "",
        } = token_decode;

        setUser((user) => ({
          username: username,
          role: role,
          auth: true,
          idUser: idUser,
          token: token,
        }));
      } else {
        localStorage.removeItem("token");
        setUser((user) => ({
          username: "",
          idUser: "",
          role: "",
          auth: false,
          token: "",
          ava: "https://img.icons8.com/papercut/100/user-female-circle.png",
        }));
      }
    }
  }, []);

  useEffect(() => {
    if (user.idUser) {
      getAvatar(user.idUser, user.token);
    }
  }, [user.idUser]);

  const isValidJWT = (token) => {
    const parts = token.split(".");
    return Array.isArray(parts) && parts.length === 3;
  };

  const decodeToken = (token) => {
    try {
      if (isValidJWT(token)) {
        return jwtDecode(token);
      }
    } catch {
      return false;
    }
  };
  const loginContext = (token) => {
    const token_decode = decodeToken(token);
    const {
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": username,
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": role,
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier":
        idUser,
    } = token_decode;
    setUser((user) => ({
      username: username,
      role: role,
      auth: true,
      idUser: idUser,
      token: token,
    }));
    localStorage.setItem("token", token);
  };
  const userAuthen = async (username, pwd) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/Authen/Login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: pwd,
          }),
        }
      );
      return response;
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
  const getAvatar = async (idUser, token) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/Authen/GetProfile?id=${idUser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        toast.error(`Get User Profile failed`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        const data = await response.json();
        if (data.imageURL) {
          setUser((prevState) => ({
            ...prevState,
            ava: data.imageURL,
          }));
        }
      }
    } catch (error) {
      toast.error(`${error}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    setUser((user) => ({
      username: "",
      role: "",
      auth: false,
      token: "",
      idUser: "",
      ava: "https://img.icons8.com/papercut/100/user-female-circle.png",
    }));
  };

  return (
    <UserContext.Provider
      value={{ user, logout, userAuthen, loginContext, decodeToken, setUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
export { UserContext, UserProvider };
