import React, { useState } from "react";
import AddTodo from "../components/AddTodo";
import CompletedTasks from "../components/CompletedTasks";
import Statistics from "../components/Statistics";
import Workspace from "../components/Workspace";

function WorkspacePage({ workspaceCreators, item, setWorkspaceCreators }) {
  const [todoText, setTodoText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [nextId, setNextId] = useState(1);
  const [todos, setTodos] = useState([]);
  const [deadline, setDeadline] = useState((new Date()).toLocaleString());

  const handleAddTodo = () => {
    if (todoText.trim() === "") {
      return;
    }
    const newTodo = {
      id: nextId,
      title: todoText,
      priority: priority,
      deadline: deadline,
      description: '',
      completed: false,
      date: new Date().toISOString().slice(0, 10),
    };
    setTodos([...todos, newTodo]);

    const updatedWorkspaceCreators = workspaceCreators.map((workspace) => {
      if (
        workspace.workspaceName === item.workspaceName &&
        workspace.collaborators === item.collaborators
      ) {
        return {
          ...workspace,
          todos: [...(workspace.todos || []), newTodo],
        };
      }
      return workspace;
    });

    setWorkspaceCreators(updatedWorkspaceCreators);


    setTodoText("");
    setPriority("medium");
    setNextId(nextId + 1);
  };

  console.log(item);

  // const getTasksForWorkspace = (workspaceName) => {
  //   const workspace = workspaces.find((w) => w.name === workspaceName);
  //   return workspace ? workspace.tasks : [];
  // };

  const handleTaskEdit = (id, description, completed) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          console.log(todo);
          return { ...todo, description, completed };
        }
        return todo;
      })
    );

    item.todos = item.todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, description, completed };
      }
      return todo;
    });
  };

  const completedTasks = item.todos.filter((todo) => todo.completed);
  const pendingTasks = item.todos.filter((todo) => !todo.completed);

  const totalCompletedTasks = completedTasks.length;
  const totalPendingTasks = pendingTasks.length;
  const totalTasks = totalCompletedTasks + totalPendingTasks;
  const completedPercentage =
    totalTasks > 0 ? Math.round((totalCompletedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col h-screen">
      {/* <Header onLogout={handleLogout} /> */}
      <div className="flex flex-1">
        <div className="flex-grow p-8">
          <div key={item.workspaceName}>
            <h2>{item.workspaceName}</h2>

            <AddTodo
              todoText={todoText}
              setTodoText={setTodoText}
              priority={priority}
              Deadline={deadline}
              setDeadline={setDeadline}
              setPriority={setPriority}
              handleAddTodo={() => handleAddTodo()}
            />
            <Statistics
              totalPendingTasks={totalPendingTasks}
              totalCompletedTasks={totalCompletedTasks}
              completedPercentage={completedPercentage}
            />

            <Workspace
              pendingTasks={pendingTasks}
              handleTaskEdit={handleTaskEdit}
            />

            <CompletedTasks
              completedTasks={completedTasks}
              handleTaskEdit={handleTaskEdit}
            />
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkspacePage;
