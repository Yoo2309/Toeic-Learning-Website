import React, { useContext, useState } from "react";
import { UserContext } from "../../../Context/UserContext";
import AdminSidebar from "../../AdminComponent/Common/AdminSidebar";
import AdminHeader from "../../AdminComponent/Common/AdminHeader";

function AdminLayout({ children }) {
  const { user } = useContext(UserContext);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(true);
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  if (user.role === "Admin") {
    return (
      <div className="professor-layout">
        <div className={`${openSidebarToggle ? "grid-container" : ""}`}>
          <AdminHeader OpenSidebar={OpenSidebar} />
          <AdminSidebar
            openSidebarToggle={openSidebarToggle}
            OpenSidebar={OpenSidebar}
          />
          {children}
        </div>
      </div>
    );
  }
}

export default AdminLayout;
