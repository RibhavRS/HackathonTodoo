import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./ClientSide/Components/Auth/Login";
import Signup from "./ClientSide/Components/Auth/Signup";
import Dashboard from './ClientSide/Components/Pages/Dashboard';
import "react-toastify/dist/ReactToastify.css";
import MyTaskPage from "./ClientSide/Components/Pages/MyTaskPage";
import WorkspacePage from "./ClientSide/Components/Pages/WorkspacePage";
import HomePage from "./ClientSide/Components/Pages/HomePage";
import ProtectedRoute from "./ClientSide/Components/components/Protectedroute"; 
import { Navigate } from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setLoggedIn(true);
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup handleLogin={handleLogin} />} />
          <Route path="/" element={loggedIn ? <HomePage user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/Dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
          <Route path="/mytasks" element={<ProtectedRoute user={user}><MyTaskPage /></ProtectedRoute>} />
          <Route path="/workspace" element={<ProtectedRoute user={user}><WorkspacePage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
