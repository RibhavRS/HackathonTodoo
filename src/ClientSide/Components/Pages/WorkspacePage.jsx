import React, { useState } from "react";
import AddTodo from "../components/AddTodo";
import CompletedTasks from "../components/CompletedTasks";
import Statistics from "../components/Statistics";
import Workspace from "../components/Workspace";

function WorkspacePage({ workspaceCreators, item, setWorkspaceCreators, todos, setTodos, deleteTodo }) {
  const [todoText, setTodoText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [nextId, setNextId] = useState(1);
  const [deadline, setDeadline] = useState(new Date().toLocaleString());
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleAddTodo = async () => {
    if (todoText.trim() === "") {
      return;
    }
    const newTodo = {
      title: todoText,
      priority: priority,
      deadline: deadline,
      description: '',
      completed: false,
      date: new Date().toISOString().slice(0, 10),
    };
  
    try {
      const response = await fetch('https://65ee234e08706c584d9b1c74.mockapi.io/reactcrud/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
  
      const addedTodo = await response.json();
  
      setTodos([...todos, addedTodo]);
  
      const updatedWorkspaceCreators = workspaceCreators.map((workspace) => {
        if (
          workspace.id === item.id 
        ) {
          return {
            ...workspace,
            todos: [...(workspace.todos || []), addedTodo],
          };
        }
        return workspace;
      });
  
      setWorkspaceCreators(updatedWorkspaceCreators);
  
      // Reset form fields and state
      setTodoText("");
      setPriority("medium");
      setNextId(nextId + 1);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };
  
  

  const handleTaskEdit = (id, description, completed,) => {
    console.log("id:", id);
    console.log("description:", description);
    console.log("completed:", completed);
  
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
        if (
          workspace.id === item.id 
        ) {
          return {
            ...workspace,
            todos: workspace.todos.map((todo) => {
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
  


  const completedTasks = item.todos.filter((todo) => todo.completed);
  const pendingTasks = item.todos.filter((todo) => !todo.completed);
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
                  <b>Name:</b>{item.workspaceName}
                </h2>
                <p><b>Description:</b> {item.description}</p>
              </div>
              <div className="ml-auto overflow-y ">
              <div className="flex">
              {/* <button onClick={() => setIsPopupOpen(true)} className="bg-red-500 float-right hover:bg-red-700 text-white text-sm py-1 px-2 rounded">
                 Add New Collaborator
              </button> */}
                </div>
                {/* <div>
                <p><b>Collaborators:</b>
                {item.collaborators}
                 </p>
                </div> */}
              </div>
            </div>

            {/* {isPopupOpen && (
  <div className="fixed z-10 inset-0 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
      <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Collaborator</h3>
              <div className="mt-2">
                <input
                  type="text"
                  value={newCollaboratorName}
                  onChange={(e) => setNewCollaboratorName(e.target.value)}
                  placeholder="Enter collaborator's name"
                  className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md mb-2"
                />
                <button onClick={handleAddCollaborator} className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm">
                  Add
                </button>
                <button onClick={() => setIsPopupOpen(false)} className="mt-2 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)} */}


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
            <h2 className="text-2xl font-semibold text-center mb-4">
              WORKSPACE
            </h2>
            <Workspace pendingTasks={pendingTasks} handleTaskEdit={handleTaskEdit} deleteTodo={deleteTodo} />
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
