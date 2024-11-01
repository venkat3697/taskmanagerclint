import React from "react";
import { BrowserRouter as Router, Route, Routes, redirect } from "react-router-dom";
import { LayoutPage } from "./pages/Layout";
import { SignUp } from "./pages/Signup";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      {" "}
      <Router>
        <Routes>
          <Route path="/" element={<LayoutPage />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
