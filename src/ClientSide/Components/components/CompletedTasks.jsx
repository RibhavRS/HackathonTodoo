import React from 'react';
import Task from './Task';

function CompletedTasks({ completedTasks, handleTaskEdit }) {
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold text-center mb-4">Completed Tasks</h2>
            <div className="text-center">
                {completedTasks.map(todo => (
                    <Task key={todo.id} task={todo} onTaskEdit={handleTaskEdit} />
                ))}
            </div>
        </div>
    );
}

export default CompletedTasks;
