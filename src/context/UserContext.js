// /frontend/src/context/UserContext.js
import React, { createContext, useContext, useState } from "react";
import jwtDecode from "jwt-decode";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(""); // Initialize user state

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
