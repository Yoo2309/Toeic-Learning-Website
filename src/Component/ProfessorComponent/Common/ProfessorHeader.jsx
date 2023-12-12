import React, { useContext, useEffect, useState } from "react";
import { BsJustify } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context/UserContext";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";

function ProfessorHeader({ OpenSidebar }) {
  const { user, logout } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [ava, setAva] = useState(
    "https://img.icons8.com/papercut/100/user-female-circle.png"
  );
  const navigate = useNavigate();
  function handleLogout() {
    logout();
    navigate("/");
    window.location.reload();
  }
  const getAvatar = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/Authen/GetProfile?id=${user.idUser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setIsLoading(false);
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
          setAva(data.imageURL);
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
  useEffect(() => {
    if (user.idUser) {
      getAvatar();
    }
  }, [user]);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="navbar-user">
        <div className="navbar-user-infor">
          <div className="navbar-user-avatar">
            <img src={ava} alt="" />
          </div>
          <div className="navbar-user-name">{user.username}</div>
          <i className="fas fa-caret-down"></i>
        </div>
        <div className="dropdown-menu">
          <ul>
            <div className="dropdown-item">
              <Link to={`/user/profile/${user.idUser}`}>Trang cá nhân</Link>
            </div>
            <div className="dropdown-item" onClick={handleLogout}>
              Logout
            </div>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default ProfessorHeader;
