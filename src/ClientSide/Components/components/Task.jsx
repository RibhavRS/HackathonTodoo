import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

function Task({ task, deleteTodo, handleTaskEdit, fetchCollaboratorTasks, setNotifications, notifications }) {
  const [showModal, setShowModal] = useState(false);
  const [subtasks, setSubtasks] = useState([{ name: '', collaborators: [], tempName: '', tempCollaboratorId: '' }]);
  const [taskCollaborators, setTaskCollaborators] = useState([]);
  const [tempCollaboratorName, setTempCollaboratorName] = useState('');


  //This is fetching the subtasks please map
  // useEffect(() => {
  //   const fetchSubtasks = async () => {
  //     try {
  //       const token = localStorage.getItem('token');
  //       const response = await fetch(`http://20.84.109.30:8090/api/ts/subtasks/task/${task.id}/user-subtasks`, {
  //         method: 'GET',
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       if (!response.ok) throw new Error('Failed to fetch subtasks');

  //       const data = await response.json();
  //       setSubtasks(data); // Assuming the API returns an array of subtasks
  //     } catch (error) {
  //       console.error('Error fetching subtasks:', error);
  //       toast.error(error.message || 'Failed to fetch subtasks.');
  //     }
  //   };

  //   fetchSubtasks();
  // }, [task]);

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
    for (let subtask of subtasks) {
      await createSubtask(subtask);
    }
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

  const handleAddSubtaskCollaborator = (index, collaboratorId) => {
    const updatedSubtasks = [...subtasks];
    collaboratorId = collaboratorId.trim(); 
    if (collaboratorId && !updatedSubtasks[index].collaborators.includes(collaboratorId)) {
      updatedSubtasks[index].collaborators.push(collaboratorId);
      updatedSubtasks[index].tempCollaboratorId = collaboratorId; 
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

  const handleAddTaskCollaborator = () => {
    if (tempCollaboratorName) {
      setTaskCollaborators([...taskCollaborators, { name: tempCollaboratorName }]);
      setTempCollaboratorName('');
    }
  };

  const handleRemoveTaskCollaborator = (index) => {
    const updatedCollaborators = [...taskCollaborators];
    updatedCollaborators.splice(index, 1);
    setTaskCollaborators(updatedCollaborators);
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
          status: "PENDING",
        }),
      });
  
      if (!response.ok) throw new Error('Failed to create subtask');
      toast.success('Subtask created successfully');
      const subtaskData = await response.json();
      const notificationMessage = `You have a new task assigned in: ${task.title} and Subtask: ${subtask.tempName}`;
      const notificationResponse = await fetch('http://20.84.109.30:8090/api/in/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientId: subtask.tempCollaboratorId,
          message: notificationMessage,
          read: false,
        }),
      });
  
      if (!notificationResponse.ok) throw new Error('Failed to create notification');
  
      // let temp = [...notifications];
      // temp.push(notificationMessage);
      // setNotifications(temp);
      // console.log(notifications);
  
      return subtaskData;
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    }
  };
  
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
        <div key={subtask.id} className="ml-6 mt-2">
          <div className="flex justify-between items-center">
            <div>
              <span>{index + 1}. {subtask.name}</span>
            </div>
            <div className="flex">
              {/* Mapping collaborators for each subtask if available */}
              {subtask.collaborators?.map((collaborator, collabIndex) => (
                <span key={collabIndex} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{collaborator.name}</span>
              ))}
            </div>
          </div>
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
                    Completed
                  </button>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    type="text"
                    value={subtask.tempCollaboratorId}
                    onChange={(e) => handleChangeSubtaskCollaboratorId(index, e.target.value)}
                    className="border border-gray-300 rounded-md p-2 mr-2 flex-grow"
                    placeholder="Assigned User ID"
                  />
                  <button onClick={() => handleAddSubtaskCollaborator(index, subtask.tempCollaboratorId)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Add User
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
            <div className="mt-4">
              <label htmlFor="taskCollaborator" className="block text-grey-darker text-sm font-bold mb-2">Add Task Collaborator:</label>
              <input
                type="text"
                value={tempCollaboratorName}
                onChange={(e) => setTempCollaboratorName(e.target.value)}
                placeholder="Collaborator Name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
              />
              <button onClick={handleAddTaskCollaborator} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 mb-2">
                Add Collaborator
              </button>
            </div>
            <button onClick={handleAddSubtask} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              + Add Subtask
            </button>
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
