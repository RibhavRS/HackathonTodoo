import React from 'react';
import Task from './Task';

function CompletedTasks({ completedTasks, handleTaskEdit, deleteTodo }) {
    return (
        <div className="mt-2 mb-2 rounded-lg overflow-hidden px-4 py-2">
            <div className="text-center">
                {completedTasks && completedTasks.map(todo => (
                    <Task
                        key={todo.id}
                        task={todo}
                        handleTaskEdit={handleTaskEdit}
                        deleteTodo={deleteTodo}
                    />
                ))}
            </div>
        </div>
    );
}

export default CompletedTasks;

