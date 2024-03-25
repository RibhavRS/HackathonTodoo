import React from "react";
import Task from "../components/Task";
import Workspace from "../components/Workspace";
import Statistics from "../components/Statistics";
import CompletedTasks from '../components/CompletedTasks';


const MyTaskPage = ({handleTaskEdit,workspaceCreators,deleteTodo}) => {


  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <div className="flex-grow p-4">
          <h2 className="text-lg font-semibold mb-4">Tasks</h2>
          {workspaceCreators.map((workspace) => (
            <div key={workspace.id}>
              <h1><b>{workspace.workspaceName}</b></h1>
              {workspace.todos.map((todo, index) => (
                <Task key={todo.id} task={todo} onTaskEdit={handleTaskEdit} deleteTodo={deleteTodo} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyTaskPage;
