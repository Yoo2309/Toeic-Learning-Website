import React, { useContext, useState } from "react";
import { UserContext } from "../../../Context/UserContext";
import ProfessorHeader from "../../ProfessorComponent/Common/ProfessorHeader";
import ProfessorSidebar from "../../ProfessorComponent/Common/ProfessorSidebar";

function ProfessorLayout({ children }) {
  const { user } = useContext(UserContext);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(true);
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  if (user.role === "Professor") {
    return (
      <div className="professor-layout">
        <div className={`${openSidebarToggle ? "grid-container" : ""}`}>
          <ProfessorHeader OpenSidebar={OpenSidebar} />
          <ProfessorSidebar
            openSidebarToggle={openSidebarToggle}
            OpenSidebar={OpenSidebar}
          />
          {children}
        </div>
      </div>
    );
  }
}

export default ProfessorLayout;
