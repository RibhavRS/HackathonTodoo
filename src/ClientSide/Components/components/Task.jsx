import React, { useState } from 'react';

function Task({ task, onTaskEdit }) {
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState(task.description || '');

  const handleTaskClick = () => {
    setShowModal(true);
  };

  const handleSaveTask = () => {
    onTaskEdit(task.id, description);
    setShowModal(false);
  };

  const handleTaskComplete = () => {
    onTaskEdit(task.id, description, true);
  };

  return (
    <div>
      <div
        className={`p-4 mb-4 rounded-lg cursor-pointer ${
          task.priority === 'high' ? 'bg-red-200' : 
          task.priority === 'medium' ? 'bg-yellow-200' : 'bg-green-200'
        }`}
        onClick={handleTaskClick}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
            {task.completed && <sup className="text-xs ml-2">✔</sup>}
          </div>
          <div className=' flex space-x-2'>
          <span>{task.deadline}</span>
          <span>{task.description}</span>
          </div>
        </div>
      </div>
      {/* Task Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{task.title}</h2>
            <textarea
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
            <div className="flex justify-between">
              <button
                onClick={handleSaveTask}
                className="bg-blue-500 text-white rounded px-4 py-2 ml-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                OK
              </button>
              {!task.completed && (
                <button
                  onClick={handleTaskComplete}
                  className="bg-green-500 text-white rounded px-4 py-2 ml-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Task;
