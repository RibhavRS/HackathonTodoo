import React from 'react';
import Task from './Task';

function CompletedTasks({ completedTasks, handleTaskEdit, handleTaskDelete }) {
    return (
         <div className="mt-2 mb-2 border border-gray-700 rounded-lg overflow-hidden px-4 py-2">
            <div className="text-center">
                {completedTasks.map(todo => (
                    <Task
                        key={todo.id}
                        task={todo}
                        onTaskEdit={handleTaskEdit}
                        onTaskDelete={handleTaskDelete}
                    />
                ))}
            </div>
        </div>
    );
}

export default CompletedTasks;
