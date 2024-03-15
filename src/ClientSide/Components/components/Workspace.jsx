import React from 'react';
import Task from './Task';

function Workspace({ pendingTasks, handleTaskEdit }) {
    const calculateRemainingTime = (deadline) => {
        const currentTime = new Date();
        const deadlineTime = new Date(deadline);
        const difference = deadlineTime - currentTime;
        if (difference <= 0) {
            return 'Deadline passed';
        } else {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            return `${days}d ${hours}h ${minutes}m`;
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold text-center mb-4">Workspace</h2>
            <div className="text-center">
                {pendingTasks.map(todo => (
                    <Task key={todo.id} task={todo} remainingTime={calculateRemainingTime(todo.deadline)} onTaskEdit={handleTaskEdit} />
                ))}
            </div>
        </div>
    );
}

export default Workspace;
