import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

function Task({ task, deleteTodo, handleTaskEdit, fetchCollaboratorTasks }) {
  const [showModal, setShowModal] = useState(false);
  const [subtasks, setSubtasks] = useState([{ name: '', collaborators: [], tempName: '', tempCollaboratorId: '' }]);

  const handleTaskClick = () => setShowModal(true);

  const handleDeleteTask = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://20.84.109.30:8090/api/ts/tasks/${task.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete task');

      deleteTodo(task.id);
      toast.success("Todo Deleted");
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://20.84.109.30:8090/api/ts/tasks/${task.id}/complete`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to complete task');

      handleTaskEdit(task.id, task.description, true);
      fetchCollaboratorTasks();
      setShowModal(false);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };


  const handleSaveTask = async () => {
    // Create subtasks via API
    for (let subtask of subtasks) {
      if (subtask.status === 'PENDING') {
        await createSubtask(subtask);
      }
    }
    // Filter out subtasks that have been successfully created
    const updatedSubtasks = subtasks.filter(subtask => subtask.status !== 'COMPLETED');
    handleTaskEdit(task.id, { ...task, subtasks: updatedSubtasks });
    setShowModal(false);
  };

  const handleUpdateSubtaskName = (index) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].name = updatedSubtasks[index].tempName;
    setSubtasks(updatedSubtasks);
  };

  const handleChangeSubtaskName = (index, value) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].tempName = value;
    setSubtasks(updatedSubtasks);
  };

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { name: '', collaborators: [], tempName: '', tempCollaboratorId: '' }]);
  };

  const handleRemoveSubtask = (index) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks.splice(index, 1);
    setSubtasks(updatedSubtasks);
  };

  const handleAddSubtaskCollaborator = (index) => {
    const updatedSubtasks = [...subtasks];
    const collaboratorId = updatedSubtasks[index].tempCollaboratorId.trim();
    if (collaboratorId && !updatedSubtasks[index].collaborators.includes(collaboratorId)) {
      updatedSubtasks[index].collaborators.push(collaboratorId);
      updatedSubtasks[index].tempCollaboratorId = '';
      setSubtasks(updatedSubtasks);
    }
  };

  const handleChangeSubtaskCollaboratorId = (index, value) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].tempCollaboratorId = value;
    setSubtasks(updatedSubtasks);
  };

  const handleRemoveSubtaskCollaborator = (subtaskIndex, collaboratorIndex) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[subtaskIndex].collaborators.splice(collaboratorIndex, 1);
    setSubtasks(updatedSubtasks);
  };

  const createSubtask = async (subtask) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://20.84.109.30:8090/api/ts/subtasks?parentTaskId=${task.id}&assignedUserId=${subtask.tempCollaboratorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: subtask.tempName,
          description: subtask.tempName, 
          status: subtask.status,
        }),
      });

      if (!response.ok) throw new Error('Failed to create subtask');
      
      toast.success('Subtask created successfully');
      return await response.json();
    } catch (error) {
      console.error('Error creating subtask:', error);
      toast.error('Failed to create subtask');
    }
  };



  // The rest of your component logic remains the same
  
  const handleCompleteSubtask = (index) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].status = 'COMPLETED';
    setSubtasks(updatedSubtasks);
  };

  return (
    <div>
      <div
        className={`p-4 mt-2 mb-2 rounded-lg cursor-pointer ${task.priority === 'HIGH' ? 'bg-red-200' : task.priority === 'MEDIUM' ? 'bg-yellow-200' : 'bg-green-200'}`}
        onClick={handleTaskClick}
      >
        <div className="flex justify-between items-center">
          <div>
            <span className={task.completed ? 'line-through' : ''}><b>{task.title}</b></span>
            {task.completed && <sup className="text-xs ml-2">✔</sup>}
          </div>
          <div>
            <span>{task.deadline}</span>
            <button onClick={() => setShowModal(true)} className="ml-2 text-gray-500 hover:text-gray-700">+</button>
          </div>
        </div>


        {subtasks.map((subtask, index) => (
          <div key={index} className="ml-6 mt-2">
            <div className="flex justify-between items-center">
              <div>
                <span>{index + 1}. {subtask.name}</span>
              </div>
              <div className="flex">
                {subtask.collaborators.map((collaborator, collabIndex) => (
                  <span key={collabIndex} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{collaborator}</span>
                ))}
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* Modal for Adding/Editing Subtasks and Collaborators */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <div className="bg-white p-8 rounded-lg w-1/2">
          <h2 className="text-xl font-semibold mb-4">{task.title}</h2>
          {subtasks.map((subtask, index) => (
            <div key={index} className="mb-4">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={subtask.tempName}
                    onChange={(e) => handleChangeSubtaskName(index, e.target.value)}
                    className="border border-gray-300 rounded-md p-2 mr-2 flex-grow"
                    placeholder="Subtask name"
                  />
                  <button onClick={() => handleUpdateSubtaskName(index)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Save
                  </button>
                  <button onClick={() => handleRemoveSubtask(index)} className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Delete
                  </button>
                  <button onClick={() => handleCompleteSubtask(index)} className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Mark as Completed
                </button>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    type="text"
                    value={subtask.tempCollaboratorId}
                    onChange={(e) => handleChangeSubtaskCollaboratorId(index, e.target.value)}
                    className="border border-gray-300 rounded-md p-2 mr-2 flex-grow"
                    placeholder="Collaborator's ID"
                  />
                  <button onClick={() => handleAddSubtaskCollaborator(index)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Add Collaborator
                  </button>
                </div>
                <div className="flex flex-wrap">
                  {subtask.collaborators.map((collaborator, collabIndex) => (
                    <div key={collabIndex} className="flex items-center mr-2 mb-2">
                      <div className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">{collaborator}</div>
                      <button onClick={() => handleRemoveSubtaskCollaborator(index, collabIndex)} className="ml-1 text-red-500 hover:text-red-700">
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={handleAddSubtask} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              + Add Subtask
            </button>
            <div className="mt-4 flex justify-end">
              <button onClick={handleSaveTask} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Save Changes
              </button>
              {!task.completed && (
                <button onClick={handleTaskComplete} className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 focus:outline-none">Complete</button>
              )}
              <button onClick={handleDeleteTask} className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 focus:outline-none">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Task;
