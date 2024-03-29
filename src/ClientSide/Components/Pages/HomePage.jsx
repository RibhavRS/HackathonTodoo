
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import MyTaskPage from "./MyTaskPage";
import WorkspacePage from "./WorkspacePage";
import { toast } from "react-toastify";



const HomePage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState("Dashboard");
  const [showModal, setShowModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [todos, setTodos] = useState([]);
  const [workspaceCreators, setWorkspaceCreators] = useState([]);
  const [notifications, setNotifications] = useState(['a', 'b']);
  const [togglenotificationModal, settogglenotificationModal] = useState(false);
  const [reciepants, setreciepants] = useState('');
  const [information, setinformation] = useState('');
  const [showModalNotification, setShowModalNotification] = useState(false);


  const handleDeletenotification = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    setNotifications(updatedNotifications);
  };

  const handleinformationChange = (event) => {
    setinformation(event.target.value);
  }

  const handlereciepantsChange = (event) => {
    setreciepants(event.target.value);
  };

  const toggleNotificationModal = () => {
    setShowModalNotification(!showModalNotification);
  };

  const deleteTodo = (todoId) => {
    const filteredTodos = todos.filter((todo) => todo.id !== todoId);
    setTodos(filteredTodos);
    const updatedWorkspaceCreators = workspaceCreators.map((workspace) => {
      const todosArray = workspace.todos ? workspace.todos : [];
      const updatedTodos = todosArray.filter((todo) => todo.id !== todoId);
      return {
        ...workspace,
        todos: updatedTodos,
      };
    });
    setWorkspaceCreators(updatedWorkspaceCreators);
  };



  const handlenotificationSubmit = async () => {
    const invitationData = {
      receiverId: reciepants,
      message: information,
      status: "SENT"
    };
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://20.84.109.30:8090/api/in/invitations?listId=${listId}', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invitationData),
      });
      if (!response.ok) {
        throw new Error('Failed to create invitation');
      }
      const newInvitation = await response.json();
      setNotifications(prevNotifications => [...prevNotifications, newInvitation]);
      toast.success('Invitation sent successfully');
      setinformation('');
      setreciepants('');
      toggleNotificationModal();
    } catch (error) {
      console.error('Error creating invitation:', error);
      toast.error('Failed to send invitation');
    }
  };




  const tnmodal = () => {
    settogglenotificationModal((prev) => !prev);
  }

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };



  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://20.84.109.30:8090/api/in/notifications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const fetchedNotifications = await response.json();
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    }
  };

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
        <div className="flex-none w-1/4  p-4 h-h-screen  ">
          <nav>
            <Sidebar
              setPage={setPage}
              workspaceCreators={workspaceCreators}
              setWorkspaceCreators={setWorkspaceCreators}
              toggleModal={toggleModal}
              showModal={showModal}
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
        <div className=" w-3/4 bg-grey-100 ">
          {page === "Dashboard" && (
            <Dashboard
              setWorkspaceCreators={setWorkspaceCreators}
              workspaceCreators={workspaceCreators}
              showModal={showModal}
              toggleModal={toggleModal}
              setPage={setPage}
            />
          )}
          {page === "TaskPage" && (
            <MyTaskPage
              pendingTasks={pendingTasks}
              workspaceCreators={workspaceCreators}
              todos={todos}
              setTodos={setTodos}
              deleteTodo={deleteTodo}
            />
          )}
          {workspaceCreators && Array.isArray(workspaceCreators) && workspaceCreators.length !== 0 && workspaceCreators.map((item) => {
              return (
                <div key={item.id}>
                  {page === item.title && (
                    <WorkspacePage
                      item={item}
                      setWorkspaceCreators={setWorkspaceCreators}
                      workspaceCreators={workspaceCreators}
                      selectedWorkspace={item.workspaceName}
                      collaborators={item.collaborators}
                      todos={todos} 
                      setTodos={setTodos}
                      deleteTodo={deleteTodo}
                      completedTasks={completedTasks}
                      setNotifications={setNotifications}
                      notifications={notifications} 
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
