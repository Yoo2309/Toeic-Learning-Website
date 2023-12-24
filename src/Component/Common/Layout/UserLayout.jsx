import React, { useContext } from "react";
import { UserContext } from "../../../Context/UserContext";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function UserLayout({ children }) {
  const { user } = useContext(UserContext);
  if (
    user.role === "" ||
    user.role === "Student" ||
    user.role[1] === "VipStudent"
  ) {
    return (
      <div className="user-layout">
        <Header />
        {children}
        <Footer />
      </div>
    );
  }
}

export default UserLayout;
