import React, { useContext} from "react";
import { BsJustify } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context/UserContext";

function AdminHeader({ OpenSidebar }) {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  function handleLogout() {
    logout();
    navigate("/");
    window.location.reload();
  }

  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="navbar-user">
        <div className="navbar-user-infor">
          <div className="navbar-user-avatar">
            <img
              src={
                user.ava ||
                "https://img.icons8.com/papercut/100/user-female-circle.png"
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
              <Link to={`/user/profile/${user.idUser}`}>Trang cá nhân</Link>
            </div>
            <div className="dropdown-item">
              <Link to={`/user/changePassword`}>Đổi mật khẩu</Link>
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

export default AdminHeader;
