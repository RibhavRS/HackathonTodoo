import React, { useState } from 'react';

function Task({ task, onTaskEdit, onTaskDelete , remainingTime }) {
  const [showModal, setShowModal] = useState(false);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);

  const handleTaskClick = () => {
    setShowModal(true);
  };

  const handleSaveTask = () => {
    onTaskEdit(task.id, { ...task, subtasks });
    setShowModal(false);
  };

  const handleTaskComplete = () => {
    const updatedTask = { ...task, completed: true };
    onTaskEdit(task.id, updatedTask.description, task.subtasks, true);
    setShowModal(false);
  };

  const handleDeleteTask = () => {
    onTaskDelete(task.id);
  };

  const handleSubtaskChange = (index, value) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index] = value;
    setSubtasks(updatedSubtasks);
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, '']);
  };

  const removeSubtask = (index) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks.splice(index, 1);
    setSubtasks(updatedSubtasks);
  };

  return (
    <div>
      <div
        className={`p-4 mt-2 mb-2 rounded-lg cursor-pointer ${
          task.priority === 'high' ? 'bg-red-200' :
          task.priority === 'medium' ? 'bg-yellow-200' : 'bg-green-200'
        }`}
        onClick={handleTaskClick}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className={task.completed ? 'line-through' : ''}><b>{task.title}</b></span>
            {task.completed && <sup className="text-xs ml-2">✔</sup>}
          </div>
          <div className='flex space-x-2'>
            <span>{task.deadline}</span>
          </div>
        </div>
       
        <div>
          {subtasks.map((subtask, index) => (
            <div key={index} className="ml-4 flex">
              <span>{index + 1}. {subtask}</span>
            </div>
          ))}
        </div>
      </div>
     
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{task.title}</h2>
            <h3 className="text-lg font-semibold mb-2">Subtasks:</h3>
            {subtasks.map((subtask, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={subtask}
                  onChange={(e) => handleSubtaskChange(index, e.target.value)}
                  className="border border-gray-300 rounded-md p-2 mr-2 w-full"
                  placeholder="Enter subtask"
                />
                <button
                  onClick={() => removeSubtask(index)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addSubtask}
              className="text-blue-500 hover:text-blue-700 focus:outline-none mb-4"
            >
              + Add Subtask
            </button>
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
              <button
                onClick={handleDeleteTask}
                className="bg-red-500 text-white rounded px-4 py-2 ml-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Task;
