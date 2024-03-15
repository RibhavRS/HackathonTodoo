
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./ClientSide/Components/Auth/Login";
import Signup from "./ClientSide/Components/Auth/Signup";
import Dashboard from './ClientSide/Components/Pages/Dashboard'
import "react-toastify/dist/ReactToastify.css";
import MyTaskPage from "./ClientSide/Components/Pages/MyTaskPage";
import WorkspacePage from "./ClientSide/Components/Pages/WorkspacePage";
import HomePage from "./ClientSide/Components/Pages/HomePage";

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
          <Route
            path="/signup" element={<Signup handleLogin={handleLogin} />}
          />
          <Route
            path="/" element={loggedIn ? <HomePage user={user} /> : <Login handleLogin={handleLogin} />}
          />
          <Route
            path="/Dashboard"element={<Dashboard />} />
          <Route
            path="/mytasks" element={<MyTaskPage/>}/>
          <Route
            path="/workspace" element={<WorkspacePage />} Component={WorkspacePage}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
