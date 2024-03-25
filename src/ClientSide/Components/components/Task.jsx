import React, { useState } from 'react';

function Task({ task, deleteTodo, handleTaskEdit }) {
  const [showModal, setShowModal] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [collaboratorName, setCollaboratorName] = useState('');
  const [hoveredCollaborator, setHoveredCollaborator] = useState(null);

  const handleTaskClick = () => {
    setShowModal(true);
  };

  const handleSaveTask = () => {
    handleTaskEdit(task.id, { ...task, subtasks, collaborators });
    setShowModal(false);
  };

  const handleTaskComplete = () => {
    const updatedTask = { ...task, completed: true };
    handleTaskEdit(task.id, updatedTask.description, true); 
    setShowModal(false);
  };

  const handleDeleteTask = () => {
    deleteTodo(task.id);
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

  const handleCollaboratorSubmit = () => {
    setCollaborators([...collaborators, collaboratorName]);
    setCollaboratorName('');
  };

  const removeCollaborator = (index) => {
    const updatedCollaborators = [...collaborators];
    updatedCollaborators.splice(index, 1);
    setCollaborators(updatedCollaborators);
  };

  const handleCollaboratorHover = (collaborator) => {
    setHoveredCollaborator(collaborator);
  };

  const handleCollaboratorBlur = () => {
    setHoveredCollaborator(null);
  };

  const handleDeleteCollaborator = (index) => {
    removeCollaborator(index);
    setHoveredCollaborator(null);
  };

  return (
    <div>
      <div
        className={`p-4 mt-2 mb-2 rounded-lg cursor-pointer ${task.priority === 'high' ? 'bg-red-200' :
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
            <button onClick={() => setShowModal(true)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
              +
            </button>
          </div>
        </div>

        <div>
          {subtasks.map((subtask, index) => (
            <div key={index} className="ml-4 flex">
              <span>{index + 1}. {subtask}</span>
            </div>
          ))}
        </div>

        <div className="flex mt-2">
          {collaborators.map((collaborator, index) => (
            <div key={index} className="relative mr-2">
              <div
                className="rounded-full bg-gray-300 w-8 h-8 flex items-center justify-center text-white z-10"
                onMouseEnter={() => handleCollaboratorHover(collaborator)}
                onMouseLeave={handleCollaboratorBlur}
              >
                {collaborator[0]}
              </div>
              {hoveredCollaborator === collaborator && (
                <div className="absolute top-0 left-full ml-2 bg-white border border-gray-300 p-2 rounded z-20">
                  <span>{collaborator}</span>
                  <button onClick={() => handleDeleteCollaborator(index)} className="ml-2 text-red-500 hover:text-red-700 focus:outline-none">
                    Delete
                  </button>
                </div>
              )}
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

            <h3 className="text-lg font-semibold mb-2">Collaborators:</h3>
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={collaboratorName}
                onChange={(e) => setCollaboratorName(e.target.value)}
                className="border border-gray-300 rounded-md p-2 mr-2 w-full"
                placeholder="Enter collaborator's name"
              />
              <button
                onClick={handleCollaboratorSubmit}
                className="text-blue-500 hover:text-blue-700 focus:outline-none"
              >
                Add
              </button>
            </div>
            {collaborators.map((collaborator, index) => (
              <div key={index} className="flex items-center mb-2">
                <span>{collaborator}</span>
                <button onClick={() => handleDeleteCollaborator(index)} className="ml-2 text-red-500 hover:text-red-700 focus:outline-none">
                  Delete
                </button>
              </div>
            ))}

            <div className="flex justify-between">
              <button
                onClick={handleSaveTask}
                className="bg-blue-500 text-white rounded
                px-4 py-2 ml-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
