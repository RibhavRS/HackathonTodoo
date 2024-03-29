import React from 'react';
import Task from './Task';

function Workspace({ pendingTasks, handleTaskEdit, remainingTime,deleteTodo,fetchCollaboratorTasks, setNotifications,notifications }) {
    return (
        <div className="mt-2 mb-4 rounded-lg overflow-hidden px-4 py-2">
            <div className="text-center">
                {pendingTasks.map(todo => (
                    <Task
                        key={todo.id}
                        task={todo}
                        handleTaskEdit={handleTaskEdit}
                        deleteTodo={deleteTodo}
                        remainingTime={remainingTime}
                        fetchCollaboratorTasks={fetchCollaboratorTasks}
                        setNotifications={setNotifications}
                        notifications={notifications}
                    />
                ))}
            </div>
        </div>
    );
}

export default Workspace;
