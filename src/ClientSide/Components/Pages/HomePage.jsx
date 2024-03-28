
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import MyTaskPage from "./MyTaskPage";
import WorkspacePage from "./WorkspacePage";


const HomePage = ({ user }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState("Dashboard");
  // const [collaborators, setCollaborators] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [todos, setTodos] = useState([]);
  const [workspaceCreators, setWorkspaceCreators] = useState([]);
  const [notifications, setNotifications] = useState(['a', 'b']);
  const [togglenotificationModal,settogglenotificationModal] = useState(false);
  const [reciepants, setreciepants] = useState('');
  const [information, setinformation] = useState('');
  const [showModalNotification, setShowModalNotification] = useState(false);


  const handleDeletenotification = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    setNotifications(updatedNotifications);
  };

  const handleinformationChange = (event) =>{
    setinformation(event.target.value);
}

const handlereciepantsChange = (event) => {
    setreciepants(event.target.value);
};

const toggleNotificationModal = () => {
  setShowModalNotification(!showModalNotification);
};

const deleteTodo = (todoId) => {
  // Filter out the todo with the given todoId from todos
  const filteredTodos = todos.filter((todo) => todo.id !== todoId);
  setTodos(filteredTodos);

  // Update workspaceCreators, ensuring each workspace has a todos array and then filter todos
  const updatedWorkspaceCreators = workspaceCreators.map((workspace) => {
    // Ensure workspace.todos is initialized as an empty array if it's undefined
    const todosArray = workspace.todos ? workspace.todos : [];
    // Filter out the todo with the given todoId from todosArray
    const updatedTodos = todosArray.filter((todo) => todo.id !== todoId);
    return {
      ...workspace,
      todos: updatedTodos,
    };
  });
  setWorkspaceCreators(updatedWorkspaceCreators);
};



  const handlenotificationSubmit = () => {
    let temp = [...notifications]
    temp.push(information)
    setNotifications(temp); 
    toggleNotificationModal();
    setinformation('')
    setreciepants('')
  };
  

  const tnmodal = () =>{
    settogglenotificationModal((prev) => !prev);
  }
  
  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };



  const handleLogout = () => {
    navigate("/login");
  };

  
  // const onNotification = () => {
  //   setNotificationCount(notificationCount + 1);
  // };

  const pendingTasks = todos.filter((todo) => !todo.completed);
  const completedTasks = todos.filter(todo => todo.completed);


  return (
    <div className="flex flex-col h-screen">
      <Header onLogout={handleLogout} 
      notificationCount={notificationCount} 
      toggleModal={toggleModal} 
      notifications={notifications} 
      tnmodal={tnmodal}
      handleDeletenotification={handleDeletenotification}
      setPage={setPage}
       />

      <div className="flex flex-1">
        <div className="flex-none w-1/4 bg-gray-200 p-4 h-100vh">
          <nav>
            <Sidebar
              setPage={setPage}
              workspaceCreators={workspaceCreators}
              setWorkspaceCreators={setWorkspaceCreators}
              toggleModal={toggleModal}
              showModal={showModal}
              // handleCollaboratorsChange={handleCollaboratorsChange}
              // collaborators={collaborators}
              // setCollaborators={setCollaborators}
              handlenotificationSubmit={handlenotificationSubmit}
              handleinformationChange={handleinformationChange}
              handlereciepantsChange={handlereciepantsChange}
              reciepants={reciepants} 
              information={information}
              toggleNotificationModal={toggleNotificationModal}
              showModalNotification={showModalNotification}
            />
          </nav>
        </div>
        <div className=" w-3/4 bg-grey-100">
          {page === "Dashboard" && (
            <Dashboard
            setWorkspaceCreators={setWorkspaceCreators}
            workspaceCreators={workspaceCreators}
            showModal={showModal}
            toggleModal= {toggleModal}
            setPage={setPage}
            />
          )}
          {page === "TaskPage" && (
            <MyTaskPage
              // handleTaskEdit={handleTaskEdit}
              pendingTasks={pendingTasks}
              workspaceCreators={workspaceCreators}
              todos={todos}
              setTodos={setTodos}
              deleteTodo={deleteTodo}
            />
          )}
{
  workspaceCreators && Array.isArray(workspaceCreators) && workspaceCreators.length !== 0 && workspaceCreators.map((item) => {
    return (
      <div key={item.id}>
        {page === item.title && (
          <WorkspacePage
            item={item}
            setWorkspaceCreators={setWorkspaceCreators}
            workspaceCreators={workspaceCreators}
            selectedWorkspace={item.workspaceName}
            collaborators={item.collaborators}
            todos={todos} // Add a check for todos
            setTodos={setTodos}
            deleteTodo={deleteTodo}
            completedTasks={completedTasks} // Add a check for completedTasks
          />
        )}
      </div>
    );
  })
}



        </div>
      </div>
    </div>
  );
};

export default HomePage;
