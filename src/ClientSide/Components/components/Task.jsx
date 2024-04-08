import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import './styles/taskStyles.css';


function Task({ task, deleteTodo, handleTaskEdit, fetchCollaboratorTasks }) {
  const [showModal, setShowModal] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [taskCollaborators, setTaskCollaborators] = useState([]);
  const [tempCollaboratorId, setTempCollaboratorId] = useState('');

  useEffect(() => {
    const fetchSubtasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://20.84.109.30:8090/api/ts/subtasks/task/${task.id}/user-subtasks`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch subtasks');

        const data = await response.json();
        console.log(data)
        // 
        setSubtasks(data); 
      } catch (error) {
        console.error('Error fetching subtasks:', error);
        toast.error(error.message || 'Failed to fetch subtasks.');
      }
    };

    fetchSubtasks();
  }, [task]);

  console.log(subtasks)

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
    const updatedSubtasks = subtasks.filter(subtask => subtask.status !== 'COMPLETED');
    handleTaskEdit(task.id, { ...task, subtasks: updatedSubtasks });
    setShowModal(false);
  };
  
  const handleChangeSubtaskTitle = (index, value) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].title = value;
    setSubtasks(updatedSubtasks);
  };

  const handleChangeSubtaskDescription = (index, value) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].description = value;
    setSubtasks(updatedSubtasks);
  };

  const handleChangeSubtaskAssignedUserId = (index, value) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].assignedUserId = value.trim();
    setSubtasks(updatedSubtasks);
  };


  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { id: null, title: '', description: '', assignedUserId: '' }]);
  };
  

  const handleDeleteSubtask = async (subtaskId, index) => {
    try {
      console.log("The subtask ID is", subtaskId);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://20.84.109.30:8090/api/ts/subtasks/${subtaskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) throw new Error('Failed to delete subtask');
  
      // Assuming deletion success, update state to reflect this.
      // Here you use the index to efficiently remove the subtask from the local state.
      const updatedSubtasks = [...subtasks];
      updatedSubtasks.splice(index, 1);
      setSubtasks(updatedSubtasks);
  
      toast.success('Subtask deleted successfully');
    } catch (error) {
      console.error('Error deleting subtask:', error);
      toast.error('Failed to delete subtask');
    }
  };
  


  const handleAddTaskCollaborator = async () => {
    if (tempCollaboratorId) { // Consider renaming this variable
      try {
        const collaboratorId = parseInt(tempCollaboratorId); // Convert input to integer
        console.log(collaboratorId);
        if (isNaN(collaboratorId)) {
          throw new Error('Invalid ID'); // Basic validation
        }
        const token = localStorage.getItem('token');

        const response = await fetch(`http://20.84.109.30:8090/api/ts/tasks/${task.id}/collaborators`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
             Authorization: `Bearer ${token}`
          },
          body: JSON.stringify([collaboratorId])
        });
        if (!response.ok) {
          throw new Error('Failed to add collaborator');
        }
        setTaskCollaborators([...taskCollaborators, { id: collaboratorId, name: `User ${collaboratorId}` }]);
        setTempCollaboratorId(''); // Clear input field
        toast.success('Collaborators added successfully');
      } catch (error) {
        console.error('Error adding collaborators:', error);
        toast.error(error.message || 'Error adding collaborators');
      }
    }
  };
  
  const handleRemoveTaskCollaborator = (index) => {
    const updatedCollaborators = [...taskCollaborators];
    updatedCollaborators.splice(index, 1);
    setTaskCollaborators(updatedCollaborators);
  };


  const handleSaveSubtask = async (subtask, index) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://20.84.109.30:8090/api/ts/subtasks?parentTaskId=${task.id}&assignedUserId=${subtask.assignedUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: subtask.title,
          description: subtask.description,
          status: "PENDING"
          
        }),
      });
      if (!response.ok) throw new Error('Failed to save subtask');
      toast.success('Subtask saved successfully');
      const savedSubtask = await response.json();
      const updatedSubtasks = [...subtasks];
      updatedSubtasks[index] = { ...savedSubtask };
      setSubtasks(updatedSubtasks);
    } catch (error) {
      console.error('Error saving subtask:', error);
      toast.error(error.message || 'Failed to save subtask.');
    }
  };

  
  const handleCompleteSubtask = async (subtaskId, index) => {
    try {
      const token = localStorage.getItem('token');
      const updatedSubtasks = [...subtasks];
      const title = updatedSubtasks[index].title;
      const description = updatedSubtasks[index].description;
      const response = await fetch(`http://20.84.109.30:8090/api/ts/subtasks/${subtaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          description: description,
          status: "COMPLETED"
        }),
      });
  
      if (!response.ok) throw new Error('Failed to mark subtask as completed');
  
      updatedSubtasks[index] = { ...updatedSubtasks[index], status: 'COMPLETED' };
      setSubtasks(updatedSubtasks);
  
      toast.success('Subtask marked as completed');
    } catch (error) {
      console.error('Error completing subtask:', error);
      toast.error(error.message || 'Failed to complete subtask');
    }
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

        {subtasks.map((subtask) => (
  <div key={subtask.id} className={`task-subtask-display ${subtask.status === 'COMPLETED' ? 'task-subtask-completed' : ''}`}>
    <p className="task-subtask-title">Title: {subtask.title}</p>
    <p className="task-subtask-description">Description: {subtask.description}</p>
    <p className="task-subtask-assigned-user">Assigned User ID: {subtask.assignedUserId}</p>
  </div>
))}


        <div className="mt-2 ml-6 flex items-center flex-wrap">



          {taskCollaborators.map((collaborator, index) => (
            <div key={index} className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              <span>{collaborator.name}</span>
              <button onClick={() => handleRemoveTaskCollaborator(index)} className="ml-2 text-red-500 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>


      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 overflow-y-scroll">
          <div className="bg-white p-8 rounded-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">{task.title}</h2>
            
            {subtasks.map((subtask, index) => (
  <div key={index} className={`modal-subtask-container ${subtask.status === 'COMPLETED' ? 'subtask-completed-overlay' : ''}`}>
  <input
    type="text"
    value={subtask.title}
    disabled={subtask.status === 'COMPLETED'}
    onChange={(e) => handleChangeSubtaskTitle(index, e.target.value)}
    className="modal-subtask-input"
  />
  <input
    type="text"
    value={subtask.description}
    disabled={subtask.status === 'COMPLETED'}
    onChange={(e) => handleChangeSubtaskDescription(index, e.target.value)}
    className="modal-subtask-input"
  />
  <input
    type="number"
    value={subtask.assignedUserId}
    disabled={subtask.status === 'COMPLETED'}
    onChange={(e) => handleChangeSubtaskAssignedUserId(index, e.target.value)}
    className="modal-subtask-input"
  />
                      <div className="modal-action-buttons">
                        <button 
                          onClick={() => handleSaveSubtask(subtask, index)} 
                          className="modal-action-button modal-action-button-save"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => handleCompleteSubtask(subtask.id, index)} 
                          className="modal-action-button modal-action-button-complete"
                        >
                          Complete
                        </button>
                        <button 
                          onClick={() => handleDeleteSubtask(subtask.id, index)} 
                          className="modal-action-button modal-action-button-delete"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

              <button onClick={handleAddSubtask} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                + Add Subtask
              </button>



            <div className="mt-4">
              <label htmlFor="taskCollaborator" className="block text-grey-darker text-sm font-bold mb-2">Add Task Collaborator:</label>
              <input
                type="text"
                value={tempCollaboratorId}
                onChange={(e) => setTempCollaboratorId(e.target.value)}
                placeholder="Collaborator Ids"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
              />
              <button onClick={handleAddTaskCollaborator} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 mb-2">
                Add Collaborators
              </button>
            </div>

            <div className="mt-4 flex justify-between">
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
