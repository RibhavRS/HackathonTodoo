
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import MyTaskPage from "./MyTaskPage";
import WorkspacePage from "./WorkspacePage";
import Modal from "../components/Modal";

const HomePage = ({ user }) => {
  const [page, setPage] = useState("Dashboard");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // const handleDeleteWorkspace = (workspaceName) => {
  //   setWorkspaceCreators((prevWorkspaceCreators) =>
  //     prevWorkspaceCreators.filter(
  //       (item) => item.workspaceName !== workspaceName
  //     )
  //   );
  // };

  const handleLogout = () => {
    navigate("/login");
  };

  const [todos, setTodos] = useState([]);

  const handleTaskEdit = (id, description, subtasks, completed) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, description: description, subtasks: subtasks, completed: completed };
        }
        return todo;
      })
    );
  };

  const handleTaskDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const onClose = () => {
    setShowModal(false);
  };
  
  const onNotification = () => {
    
    setNotificationCount(notificationCount + 1);
  };
  

  const pendingTasks = todos.filter((todo) => !todo.completed);

  const [workspaceCreators, setWorkspaceCreators] = useState([]);

  const completedTasks = todos.filter(todo => todo.completed);
  const totalCompletedTasks = completedTasks.length;
  const totalPendingTasks = pendingTasks.length;
  const totalTasks = totalCompletedTasks + totalPendingTasks;
  const completedPercentage = totalTasks > 0 ? Math.round((totalCompletedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col h-screen">
      <Header onLogout={handleLogout} notificationCount={notificationCount} toggleModal={toggleModal} />
      <div className="flex flex-1">
        <div className="flex-none w-1/4 bg-gray-200 p-4 h-100vh">
          <nav>
            <Sidebar
              setPage={setPage}
              workspaceCreators={workspaceCreators}
              setWorkspaceCreators={setWorkspaceCreators}
              // onClose={onClose} 
              onNotification={onNotification}
            />
          </nav>
        </div>
        <div className=" w-3/4 bg-grey-100">
          {page === "Dashboard" && (
            <Dashboard
            setWorkspaceCreators={setWorkspaceCreators}
            workspaceCreators={workspaceCreators}
            // selectedWorkspace={workspaceName}
            // handleDeleteWorkspace={handleDeleteWorkspace}
            // modal={modal}
            // show={showModal}
            toggleModal= {toggleModal}
            setPage={setPage}
            />
          )}
          {page === "TaskPage" && (
            <MyTaskPage
              handleTaskEdit={handleTaskEdit}
              pendingTasks={pendingTasks}
              workspaceCreators={workspaceCreators}
              todos={todos}
              setTodos={setTodos}
              totalCompletedTasks={totalCompletedTasks}
              completedTasks={completedTasks}
              totalPendingTasks={totalPendingTasks}
              completedPercentage={completedPercentage}
              handleTaskDelete={handleTaskDelete}
            />
          )}
          {workspaceCreators.length !== 0 &&
            workspaceCreators.map((item) => {
              return (
                <div key={item.workspaceName}>
                  {page === item.workspaceName && (
                    <WorkspacePage
                      item={item}
                      setWorkspaceCreators={setWorkspaceCreators}
                      workspaceCreators={workspaceCreators}
                      selectedWorkspace={item.workspaceName}
                    />
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
