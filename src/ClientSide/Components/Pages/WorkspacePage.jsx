import React, { useState, useEffect } from "react";
import AddTodo from "../components/AddTodo";
import CompletedTasks from "../components/CompletedTasks";
import Statistics from "../components/Statistics";
import Workspace from "../components/Workspace";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function WorkspacePage({ workspaceCreators, item, setWorkspaceCreators, todos, setTodos, deleteTodo }) {
  const [todoText, setTodoText] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [nextId, setNextId] = useState(1);
  const [deadline, setDeadline] = useState(new Date().toLocaleString());
  const [isPopupOpen, setIsPopupOpen] = useState(false);


  
  useEffect(() => {
    fetchCollaboratorTasks();
  }, []); 

  const fetchCollaboratorTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const listId = localStorage.getItem('listId');
      const response = await fetch(`http://20.84.109.30:8090/api/ts/tasks/list/${listId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch collaborator tasks');
      }

      const tasks = await response.json();
      setTodos(tasks);
    } catch (error) {
      console.error('Error fetching collaborator tasks:', error);
    }
  };



  const handleAddTodo = async (item) => {
    if (todoText.trim() === "") {
      return;
    }
  
    const newTodo = {
      title: todoText,
      description: item.description,
      status: "PENDING",
      priority: priority,
      collaborators: [],
      deadline: item.deadline,
    };
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://20.84.109.30:8090/api/ts/tasks?listId=${localStorage.getItem('listId')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newTodo),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
  
      const addedTodo = await response.json();
      toast.update("Todo Added")
      setTodos([...todos, addedTodo]);

  
      const updatedWorkspaceCreators = workspaceCreators.map((workspace) => {
        if (workspace.id === item.id) {
          return {
            ...workspace,
            todos: [...(workspace.todos || []), addedTodo],
          };
        }
        return workspace;
      });

      console.log(response.body)
  
      setWorkspaceCreators(updatedWorkspaceCreators);
  
      setTodoText("");
      setPriority("MEDIUM");
      setNextId(nextId + 1);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };




  
  const handleTaskEdit = (id, description, completed) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, description, completed };
        }
        return todo;
      })
    );
  
    setWorkspaceCreators((prevWorkspaceCreators) =>
      prevWorkspaceCreators.map((workspace) => {
        if (workspace.id === (item ? item.id : null)) {
          return {
            ...workspace,
            todos: todos.map((todo) => {
              if (todo.id === id) {
                return { ...todo, description, completed };
              }
              return todo;
            }),
          };
        }
        return workspace;
      })
    );
  };
  
  


  const completedTasks = todos ? todos.filter((todo) => todo.status == "COMPLETED") : [];
  const pendingTasks = todos ? todos.filter((todo) => todo.status == "PENDING") : [];

  console.log("completed tasks:", completedTasks )
  console.log("pending tasks:", pendingTasks )
  
  const totalCompletedTasks = completedTasks.length;
  const totalPendingTasks = pendingTasks.length;
  const totalTasks = totalCompletedTasks + totalPendingTasks;
  const completedPercentage =
    totalTasks > 0 ? Math.round((totalCompletedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <div className="flex-grow p-8">
          <div key={`${item.workspaceName}-${item.index}`}>
            <div className="flex justify-between">
              <div>
                <h2>
                  <b>Name:</b>{item.title}
                </h2>
                <p><b>Description:</b> {item.description}</p>
              </div>
            </div>
            <ToastContainer />
            <AddTodo
              todoText={todoText}
              setTodoText={setTodoText}
              priority={priority}
              Deadline={deadline}
              setDeadline={setDeadline}
              setPriority={setPriority}
              handleAddTodo={handleAddTodo}
              item={item}
            />
            <Statistics
              totalPendingTasks={totalPendingTasks}
              totalCompletedTasks={totalCompletedTasks}
              completedPercentage={completedPercentage}
            />

{/* 
{todos.map((todo) => (
  <div key={todo.id}>
    <li>{todo.title} {todo.status} {todo.priority}</li>
  </div>
))} */}
            <h2 className="text-2xl font-semibold text-center mb-4">
              WORKSPACE
            </h2>
            <Workspace pendingTasks={pendingTasks} handleTaskEdit={handleTaskEdit} deleteTodo={deleteTodo} fetchCollaboratorTasks={fetchCollaboratorTasks} />
            <h2 className="text-2xl font-semibold text-center mb-4">
              COMPLETED TASKS
            </h2>
            <CompletedTasks completedTasks={completedTasks} handleTaskEdit={handleTaskEdit} deleteTodo={deleteTodo} />
      </div>
    </div>
  </div>
</div>
);
}

export default WorkspacePage;
