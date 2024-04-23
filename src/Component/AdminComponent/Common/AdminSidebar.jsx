import React from "react";
import { Link } from "react-router-dom";
import brand_logo from "../../../assets/logo.png";

function AdminSidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside id="sidebar" className={!openSidebarToggle ? "sidebar-hidden" : ""}>
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <img src={brand_logo} alt=""/>
        </div>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <Link
            style={{ display: "flex", gap: 5, alignItems: "center" }}
            to="admin/user"
          >
            <img
              width="34"
              height="34"
              src="https://img.icons8.com/material-sharp/24/user-male-circle.png"
              alt="user-male-circle"
            />
            Account
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link
            style={{ display: "flex", gap: 5, alignItems: "center" }}
            to="admin/vip-package"
          >
            <img
              width="34"
              height="34"
              src="https://img.icons8.com/fluency/48/vip.png"
              alt="vip"
            />
            VIP Package
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default AdminSidebar;
