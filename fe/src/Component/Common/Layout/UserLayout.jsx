import React, { useContext } from "react";
import { UserContext } from "../../../Context/UserContext";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
// import Chatbot from "../../Chatbot/Chatbot";

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
        {/* {user.idUser && <Chatbot />} */}
        {children}
        <Footer />
      </div>
    );
  }
}

export default UserLayout;
