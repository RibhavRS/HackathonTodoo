import React from 'react';

function Statistics({ totalPendingTasks, totalCompletedTasks, completedPercentage }) {
    return (
        <div className="flex justify-around mb-6">
            <div className="bg-gray-200 p-4 rounded-lg">
                <h2 className="text-xl font-semibold">Pending Tasks</h2>
                <p className="text-3xl font-bold">{totalPendingTasks}</p>
            </div>
            <div className="bg-gray-200 p-4 rounded-lg">
                <h2 className="text-xl font-semibold">Completed Tasks</h2>
                <p className="text-3xl font-bold">{totalCompletedTasks}</p>
            </div>
            <div className="bg-gray-200 p-4 rounded-lg">
                <h2 className="text-xl font-semibold">Completed Percentage</h2>
                <p className="text-3xl font-bold">{completedPercentage}%</p>
            </div>
        </div>
    );
}

export default Statistics;
