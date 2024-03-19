import React from 'react';
import Task from './Task';

function Workspace({ pendingTasks, handleTaskEdit, handleTaskDelete, remainingTime }) {
    return (
        <div className="mt-2 mb-4 rounded-lg overflow-hidden px-4 py-2">
            <div className="text-center">
                {pendingTasks.map(todo => (
                    <Task
                        key={todo.id}
                        task={todo}
                        onTaskEdit={handleTaskEdit}
                        onTaskDelete={handleTaskDelete}
                        remainingTime={remainingTime}
                    />
                ))}
            </div>
        </div>


    );
}

export default Workspace;
