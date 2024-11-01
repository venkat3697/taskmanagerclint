// /frontend/src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { TaskManager } from "../components/TaskManager";
import { useUser } from "../context/UserContext";

export const Dashboard = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { userId, setUserId } = useUser()|| {}; // Access user and setUser from context

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const username = params.get("username");

    if (token) {
      console.log("Token:", token, username);
      const userDetails = jwtDecode(token);
      setUserId(userDetails.id);
      setUser(username);
      // Save token, for example in localStorage
      localStorage.setItem("token", token);
    } else {
      const myToken = localStorage.getItem("token");
      if(myToken){
        const userDetails = jwtDecode(myToken);
        setUser(userDetails.username);
        setUserId(userDetails.id);
      }else{
        
          navigate("/login");
        
      }
     

      
    }
  }, [location]);

  return (
    <div>
      <div>
        <h2>Welcome,{user}</h2>
        <TaskManager />
      </div>
    </div>
  );
};
