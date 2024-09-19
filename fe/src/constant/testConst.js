import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserContext, UserProvider } from "../Context/UserContext";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

export const UserProviderTest = ({ children, initialUser }) => {
  const [user, setUser] = useState(
    initialUser ?? {
      username: "testUser",
      idUser: "12345",
      auth: true,
      role: "Student",
      token: "mockToken",
      ava: "https://img.icons8.com/ios/100/user-male-circle--v1.png",
    }
  );

  const logout = () => {
    setUser({
      username: "",
      idUser: "",
      auth: false,
      role: "",
      token: "",
      ava: "https://img.icons8.com/ios/100/user-male-circle--v1.png",
    });
  };

  return (
    <UserContext.Provider
      value={{
        user: user,
        logout: logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const renderWithUserRole = (ui, { user, ...options } = {}) => {
  const Wrapper = ({ children }) => (
    <UserProviderTest initialUser={user}>
      <BrowserRouter>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          closeOnClick
          pauseOnHover
          draggable
        />
        {children}
      </BrowserRouter>
    </UserProviderTest>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};

export const renderWithCustom = (children) => {
  return render(
    <UserProvider>
      <BrowserRouter>
        <ToastContainer />
        {children}
      </BrowserRouter>
    </UserProvider>
  );
};
