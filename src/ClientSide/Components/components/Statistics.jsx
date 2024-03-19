import React from 'react';

function Statistics({ totalPendingTasks, totalCompletedTasks, completedPercentage }) {
    return (
        <div className="flex justify-around mb-6">
             <div className="relative bg-gradient-to-br from-blue-300 to-blue-500 p-4 rounded-lg shadow-md transform hover:scale-105 transition duration-300">
             <h2 className="text-xl font-semibold text-white z-10">Pending Tasks</h2>
                <p className="text-3xl font-bold text-white z-10">{totalPendingTasks}</p>
            </div>
            <div className="relative bg-gradient-to-br from-green-300 to-green-500 p-4 rounded-lg shadow-md transform hover:scale-105 transition duration-300">
            <h2 className="text-xl font-semibold text-white z-10">Completed Tasks</h2>
                <p className="text-3xl font-bold text-white z-10">{totalCompletedTasks}</p>
            </div>
            <div className="relative bg-gradient-to-br from-yellow-300 to-yellow-500 p-4 rounded-lg shadow-md transform hover:scale-105 transition duration-300">
            <h2 className="text-xl font-semibold text-white z-10">Completed Percentage</h2>
                <p className="text-3xl font-bold text-white z-10">{completedPercentage}%</p>
            </div>
        </div>
    );
}

export default Statistics;
